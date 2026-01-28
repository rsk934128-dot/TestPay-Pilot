import type { Transaction } from './definitions';

// In-memory store for transactions
let transactions: Transaction[] = [];

// A few initial transactions for demonstration purposes
const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-07-21T10:30:00Z',
    amount: 50,
    cardNumber: '4242424242424242',
    cardType: 'Visa',
    expiryDate: '12/25',
    status: 'Success',
    responseCode: '00',
    gatewayMessage: 'লেনদেন অনুমোদিত',
    transactionId: 'tpay_mock_1a2b3c4d',
  },
  {
    id: '2',
    date: '2024-07-21T09:15:00Z',
    amount: 10,
    cardNumber: '5555555555555555',
    cardType: 'Mastercard',
    expiryDate: '11/24',
    status: 'Failed',
    responseCode: '51',
    gatewayMessage: 'অপর্যাপ্ত তহবিল',
    transactionId: 'tpay_mock_5e6f7g8h',
  },
  {
    id: '3',
    date: '2024-07-20T18:45:00Z',
    amount: 120.5,
    cardNumber: '378282246310005',
    cardType: 'Amex',
    expiryDate: '01/26',
    status: 'Success',
    responseCode: '00',
    gatewayMessage: 'লেনদেন অনুমোদিত',
    transactionId: 'tpay_mock_9i0j1k2l',
  },
    {
    id: '4',
    date: '2024-07-20T15:00:00Z',
    amount: 10,
    cardNumber: '4242424242424242',
    cardType: 'Visa',
    expiryDate: '12/25',
    status: 'Success',
    responseCode: '00',
    gatewayMessage: 'লেনদেন অনুমোদিত',
    transactionId: 'tpay_mock_3m4n5o6p',
  },
  {
    id: '5',
    date: '2024-07-19T11:20:00Z',
    amount: 250,
    cardNumber: '5555555555555555',
    cardType: 'Mastercard',
    expiryDate: '11/24',
    status: 'Failed',
    responseCode: '05',
    gatewayMessage: 'লেনদেন প্রত্যাখ্যান করা হয়েছে',
    transactionId: 'tpay_mock_7q8r9s0t',
  },
];

transactions = [...initialTransactions];

export function getTransactions(): Transaction[] {
  // Return transactions sorted by date, most recent first
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getTransactionById(id: string): Transaction | undefined {
  return transactions.find(tx => tx.id === id);
}

export function addTransaction(transaction: Transaction) {
  transactions.unshift(transaction); // Add to the beginning of the array
  return transaction;
}

addTransaction.prototype.getLastTransaction = function() {
  return transactions[0];
}

export function resetTransactions() {
  transactions = [...initialTransactions];
}

export function getTransactionStats() {
    const total = transactions.length;
    const success = transactions.filter(tx => tx.status === 'Success').length;
    const failed = total - success;
    
    const failureReasons = transactions
      .filter(tx => tx.status === 'Failed')
      .reduce((acc, tx) => {
        const reason = `${tx.responseCode} - ${tx.gatewayMessage}`;
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topFailureReasons = Object.entries(failureReasons)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([reason, count]) => ({ reason, count }));

    return { total, success, failed, topFailureReasons };
}
