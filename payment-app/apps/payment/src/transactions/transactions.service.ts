import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private TransactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transactionData =
      this.TransactionRepository.create(createTransactionDto);

    await this.TransactionRepository.save(transactionData);

    return transactionData;
  }

  async findAll() {
    return this.TransactionRepository.find();
  }

  async findByCustomerId(customerId: string) {
    return this.TransactionRepository.find({ where: { customerId } });
  }

  async findOne(transactionId: number) {
    return this.TransactionRepository.findOne({ where: { transactionId } });
  }

  async remove(transactionId: number) {
    await this.TransactionRepository.delete({ transactionId });
    return transactionId;
  }
}
