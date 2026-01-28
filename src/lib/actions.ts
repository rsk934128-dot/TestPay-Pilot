'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { interpretApiResponseCode, type InterpretApiResponseCodeOutput } from '@/ai/flows/interpret-api-response-codes'
import { addTransaction, resetTransactions } from '@/lib/data'
import type { CardType, Transaction } from '@/lib/definitions'

// A mock function to simulate calling a payment gateway
async function simulateGatewayProcessing(amount: number) {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const isSuccess = Math.random() > 0.2; // 80% success rate

  if (isSuccess) {
    return {
      status: 'Success',
      responseCode: '00',
      gatewayMessage: 'Transaction Approved',
      transactionId: `tpay_${Date.now()}${Math.random().toString(36).substring(2, 10)}`,
    };
  } else {
    const errorCodes = [
      { code: '51', message: 'Insufficient Funds' },
      { code: '14', message: 'Invalid Card Number' },
      { code: '54', message: 'Expired Card' },
      { code: '05', message: 'Do Not Honor' },
    ];
    const randomError = errorCodes[Math.floor(Math.random() * errorCodes.length)];
    return {
      status: 'Failed',
      responseCode: randomError.code,
      gatewayMessage: randomError.message,
      transactionId: `tpay_${Date.now()}${Math.random().toString(36).substring(2, 10)}`,
    };
  }
}

const FormSchema = z.object({
  id: z.string(),
  cardNumber: z.string().refine(val => /^\d{13,16}$/.test(val), {
    message: 'Card number must be 13-16 digits.',
  }),
  expiryDate: z.string().refine(val => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
    message: 'Use MM/YY format.',
  }),
  cvv: z.string().refine(val => /^\d{3,4}$/.test(val), {
    message: 'CVV must be 3-4 digits.',
  }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  cardType: z.enum(['Visa', 'Mastercard', 'Amex', 'Other']),
});

const CreateTransaction = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    cardNumber?: string[];
    expiryDate?: string[];
    cvv?: string[];
    amount?: string[];
  };
  message?: string | null;
};

export async function createTestPayment(prevState: State, formData: FormData) {
  const validatedFields = CreateTransaction.safeParse({
    cardNumber: formData.get('cardNumber'),
    expiryDate: formData.get('expiryDate'),
    cvv: formData.get('cvv'),
    amount: formData.get('amount'),
    cardType: formData.get('cardType'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check your inputs.',
    };
  }

  const { amount, cardNumber, cardType, expiryDate } = validatedFields.data;

  try {
    const gatewayResponse = await simulateGatewayProcessing(amount);

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      amount,
      cardNumber: cardNumber,
      cardType: cardType as CardType,
      expiryDate,
      status: gatewayResponse.status as 'Success' | 'Failed',
      responseCode: gatewayResponse.responseCode,
      gatewayMessage: gatewayResponse.gatewayMessage,
      transactionId: gatewayResponse.transactionId,
    };
    
    addTransaction(newTransaction);
    
  } catch (error) {
    return {
      message: 'Gateway simulation failed. Please try again.',
    };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/history');
  const lastTransaction = addTransaction.prototype.getLastTransaction() // bit of a hack to get the last transaction
  if (lastTransaction) {
    redirect(`/dashboard/result/${lastTransaction.id}`);
  } else {
    // Fallback if transaction isn't found, though it should be.
    redirect('/dashboard/history');
  }
}

export async function getInterpretation(responseCode: string, gatewayMessage: string): Promise<InterpretApiResponseCodeOutput | null> {
  try {
    const result = await interpretApiResponseCode({ responseCode, gatewayMessage });
    return result;
  } catch (error) {
    console.error('AI interpretation failed:', error);
    return null;
  }
}

export async function resetAllData() {
  resetTransactions();
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/history');
  redirect('/dashboard');
}
