import { PaymentMethod, PaymentStatus } from './order';

export type { Payment as PaymentRecord } from './order';

export type PaymentReference = {
  method: PaymentMethod;
  transactionId: string;
  senderName: string;
  screenshotUrl?: string;
};

export type PaymentVerification = {
  paymentId: string;
  status: PaymentStatus;
  note?: string;
};

export type PaymentSettings = {
  bankTransfer: {
    enabled: boolean;
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    instructions: string;
  };
  easypaisa: {
    enabled: boolean;
    accountTitle: string;
    accountNumber: string;
    instructions: string;
  };
  jazzcash: {
    enabled: boolean;
    accountTitle: string;
    accountNumber: string;
    instructions: string;
  };
};
