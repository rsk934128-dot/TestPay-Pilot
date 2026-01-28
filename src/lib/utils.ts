import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CardType } from './definitions';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getCardType(cardNumber: string): CardType {
  if (/^4/.test(cardNumber)) {
    return 'Visa';
  }
  if (/^5[1-5]/.test(cardNumber)) {
    return 'Mastercard';
  }
  if (/^3[47]/.test(cardNumber)) {
    return 'Amex';
  }
  return 'Other';
}
