import { parseJSON, add } from 'date-fns';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

export const createTransactionDtoMock: CreateTransactionDto = {
  value: 150,
  description: 'Pipoca Doce',
  paymentMethod: 'credit_card',
  cardNumber: '1234',
  cardOwnerName: 'Vinicius',
  cardExpirationDate: add(parseJSON(1663355754805), { years: 5 }),
  creationDate: parseJSON(1663355754805),
  cardVerificationCode: '027',
};
