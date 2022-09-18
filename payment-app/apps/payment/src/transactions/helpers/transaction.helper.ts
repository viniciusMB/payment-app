import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { parseJSON } from 'date-fns';
export function TransformTransaction(transaction: CreateTransactionDto) {
  try {
    const transactionFormated: CreateTransactionDto = transaction;
    const { cardNumber, cardExpirationDate, creationDate } = transaction;

    transactionFormated.cardNumber = cardNumber.substring(
      cardNumber.length - 4,
    );
    transactionFormated.cardExpirationDate = parseJSON(cardExpirationDate);
    transactionFormated.creationDate = parseJSON(creationDate);
    return transactionFormated;
  } catch (error) {
    return error.message;
  }
}
