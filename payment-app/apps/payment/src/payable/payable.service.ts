import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { CreatePayableDto } from './dto/create-payable.dto';
import { PayableEntity } from './entities/payable.entity';

@Injectable()
export class PayableService {
  constructor(
    @InjectRepository(PayableEntity)
    private PayableRepository: Repository<PayableEntity>,
  ) {}

  async create(createPayableDto: CreatePayableDto) {
    const payable = this.PayableRepository.create(createPayableDto);
    await this.PayableRepository.save(payable);

    return payable;
  }

  async findAll() {
    return this.PayableRepository.find();
  }

  async findOne(payableId: number) {
    return this.PayableRepository.findOne({ where: { payableId } });
  }

  async findByCustomerId(customerId: string) {
    return this.PayableRepository.find({ where: { customerId } });
  }

  async getPayableByStatus(checkBalance: CheckBalanceDto) {
    const { status, customerId } = checkBalance;
    return this.PayableRepository.find({ where: { status, customerId } });
  }

  async remove(payableId: number) {
    await this.PayableRepository.delete({ payableId });
    return payableId;
  }
}
