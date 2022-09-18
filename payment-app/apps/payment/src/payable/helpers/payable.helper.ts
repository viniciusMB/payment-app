import { CreatePayableDto } from '../dto/create-payable.dto';
import { parseJSON, add } from 'date-fns';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

@Injectable()
export class ApplyBusinessRules {
  async feeAndPaymentDate(transactionData: TransactionEntity) {
    const { paymentMethod, creationDate, value, customerId } = transactionData;
    const payable = new CreatePayableDto();
    if (paymentMethod === 'credit_card') {
      payable.status = 'waiting_funds';
      payable.paymentDate = add(parseJSON(creationDate), { days: 30 });
      payable.value = Math.trunc(value * 95) / 100;
      payable.customerId = customerId;
    }
    if (paymentMethod === 'debit_card') {
      payable.status = 'paid';
      payable.paymentDate = parseJSON(creationDate);
      payable.value = Math.trunc(value * 97) / 100;
      payable.customerId = customerId;
    }
    if (paymentMethod !== 'debit_card' && paymentMethod !== 'credit_card') {
      throw new HttpException('Invalid Payment Method', HttpStatus.BAD_REQUEST);
    }

    return payable;
  }
}
