import {
  Controller,
  Get,
  Param,
  Body,
  Delete,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { PayableEntity } from './entities/payable.entity';
import { PayableService } from './payable.service';

@UseInterceptors(CacheInterceptor)
@Controller('payable')
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  @Get()
  async findAll(): Promise<PayableEntity[]> {
    return this.payableService.findAll();
  }

  @Get(':payableId')
  async findOne(@Param('payableId') payableId: string): Promise<PayableEntity> {
    return this.payableService.findOne(+payableId);
  }

  @Get('customerId/:customerId')
  async findByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<PayableEntity[]> {
    return this.payableService.findByCustomerId(customerId);
  }

  @Get('balance/:status')
  async getBalanceByStatus(
    @Body() checkBalance: CheckBalanceDto,
  ): Promise<number> {
    const payables = await this.payableService.getPayableByStatus(checkBalance);

    let totalValue = 0;
    for (const payable of payables) {
      totalValue += payable.value;
    }

    return totalValue;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<number> {
    return this.payableService.remove(+id);
  }
}
