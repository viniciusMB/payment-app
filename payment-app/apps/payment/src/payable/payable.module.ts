import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { PayableController } from './payable.controller';
import { ApplyBusinessRules } from './helpers/payable.helper';
import { PayableEntity } from './entities/payable.entity';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PayableController],
  imports: [TypeOrmModule.forFeature([PayableEntity])],
  providers: [PayableService, ApplyBusinessRules],
  exports: [PayableService, ApplyBusinessRules],
})
export class PayableModule {}
