import { TransactionEntity } from '../entities/transaction.entity';
import { parseJSON, add } from 'date-fns';
export const transactionEntityMock = new TransactionEntity({
  transactionId: 1,
  value: 150,
  description: 'Pipoca Doce',
  paymentMethod: 'credit_card',
  cardNumber: '1234',
  cardOwnerName: 'Vinicius',
  customerId: '1',
  cardExpirationDate: add(parseJSON(1663355754805), { years: 5 }),
  creationDate: parseJSON(1663355754805),
  cardVerificationCode: '027',
});
