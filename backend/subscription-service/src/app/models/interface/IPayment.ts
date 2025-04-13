export interface IPayment {
  sessionId: string;
  customerId?: string;
  amount: number;
  status: string;
  metaData?: Record<string, string> | undefined;
  createdAt: Date;
  updatedAt?: Date;
}
