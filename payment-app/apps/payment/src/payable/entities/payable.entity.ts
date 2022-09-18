import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payable')
export class PayableEntity {
  @PrimaryGeneratedColumn()
  payableId: number;

  @Column()
  value: number;

  @Column()
  status: string;

  @Column()
  customerId: string;

  @Column()
  paymentDate: Date;

  constructor(payable?: Partial<PayableEntity>) {
    this.customerId = payable?.customerId;
    this.payableId = payable?.payableId;
    this.paymentDate = payable?.paymentDate;
    this.status = payable?.status;
    this.value = payable?.value;
  }
}
