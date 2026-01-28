export type CardType = 'Visa' | 'Mastercard' | 'Amex' | 'Other';

export type TransactionStatus = 'Success' | 'Failed';

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  cardNumber: string;
  cardType: CardType;
  expiryDate: string;
  status: TransactionStatus;
  responseCode: string;
  gatewayMessage: string;
  transactionId: string;
};
