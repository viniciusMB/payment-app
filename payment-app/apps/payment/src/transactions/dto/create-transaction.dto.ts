export class CreateTransactionDto {
  value: number;
  description: string;
  paymentMethod: string;
  cardNumber: string;
  cardOwnerName: string;
  cardExpirationDate: Date;
  creationDate: Date;
  cardVerificationCode: string;
}
