import { Controller, Get } from '@nestjs/common';
import { AppService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
