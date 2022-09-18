import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  transactionId: number;

  @Column()
  value: number;

  @Column()
  description: string;

  @Column()
  paymentMethod: string;

  @Column()
  cardNumber: string;

  @Column()
  cardOwnerName: string;

  @Column()
  customerId: string;

  @Column()
  cardExpirationDate: Date;

  @CreateDateColumn()
  creationDate: Date;

  @Column()
  cardVerificationCode: string;

  constructor(transaction?: Partial<TransactionEntity>) {
    this.transactionId = transaction?.transactionId;
    this.value = transaction?.value;
    this.description = transaction?.description;
    this.paymentMethod = transaction?.paymentMethod;
    this.cardNumber = transaction?.cardNumber;
    this.cardOwnerName = transaction?.cardOwnerName;
    this.customerId = transaction?.customerId;
    this.cardExpirationDate = transaction?.cardExpirationDate;
    this.creationDate = transaction?.creationDate;
    this.cardVerificationCode = transaction?.cardVerificationCode;
  }
}
