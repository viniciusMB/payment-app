import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { transactionEntityMock } from './mocks/transactions.entity.mock';
import { createTransactionDtoMock } from './mocks/transactions.create.dto.mock';
import { TransformTransaction } from './helpers/transaction.helper';
import { CACHE_MANAGER, CanActivate } from '@nestjs/common';
import { PayableService } from '../payable/payable.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PayableEntity } from '../payable/entities/payable.entity';
import { ApplyBusinessRules } from '../payable/helpers/payable.helper';
import { payableEntityMock } from '../payable/mocks/payable.entity.mock';
import { JwtAuthGuard } from '@app/common';

const transactionsEntityList: TransactionEntity[] = [
  transactionEntityMock,
  transactionEntityMock,
  transactionEntityMock,
];

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const mockJwtAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      imports: [Repository],
      providers: [
        PayableService,
        ApplyBusinessRules,
        {
          provide: getRepositoryToken(PayableEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(payableEntityMock),
            save: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useFactory: jest.fn(),
        },
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(transactionEntityMock),
            findAll: jest.fn().mockResolvedValue(transactionsEntityList),
            findByCustomerId: jest
              .fn()
              .mockResolvedValue(transactionsEntityList),
            findOne: jest.fn().mockResolvedValue(transactionEntityMock),
            remove: jest.fn().mockResolvedValue('1'),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    transactionsController = module.get<TransactionsController>(
      TransactionsController,
    );
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(transactionsController).toBeDefined();
    expect(transactionsService).toBeDefined();
  });

  describe('createPayable', () => {
    it('Should return a payable entity', async () => {
      const result = await transactionsController.createPayable(
        createTransactionDtoMock,
      );

      expect(transactionsService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(payableEntityMock);
    });

    it('Should throw an exception', () => {
      const transaction = TransformTransaction(createTransactionDtoMock);

      jest
        .spyOn(transactionsService, 'create')
        .mockRejectedValueOnce(new Error());

      expect(
        transactionsController.createPayable(transaction),
      ).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('Should return all transactions', async () => {
      const result = await transactionsController.findAll();

      expect(transactionsService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(transactionsEntityList);
    });

    it('Should throw an exception', () => {
      jest
        .spyOn(transactionsService, 'findAll')
        .mockRejectedValueOnce(new Error());

      expect(transactionsController.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('Should return a transaction with same Id', async () => {
      const transactionId = '1';
      const result = await transactionsController.findOne(transactionId);

      expect(result).toEqual(transactionEntityMock);
      expect(result.transactionId).toEqual(+transactionId);
      expect(transactionsService.findOne).toHaveBeenCalledTimes(1);
      expect(transactionsService.findOne).toHaveBeenCalledWith(+transactionId);
    });

    it('Should throw an exception', () => {
      const transactionId = '1';

      jest
        .spyOn(transactionsService, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(
        transactionsController.findOne(transactionId),
      ).rejects.toThrowError();
    });
  });

  describe('findByCustomerId', () => {
    it(`Should return all customer's transactions`, async () => {
      const customerId = '1';
      const result = await transactionsController.findByCustomerId(customerId);

      expect(result).toEqual(transactionsEntityList);

      expect(
        result.filter((transaction) => transaction.customerId !== customerId),
      ).toHaveLength(0);

      expect(transactionsService.findByCustomerId).toHaveBeenCalledTimes(1);
      expect(transactionsService.findByCustomerId).toHaveBeenCalledWith(
        customerId,
      );
    });

    it('Should throw an exception', () => {
      const customerId = '1';

      jest
        .spyOn(transactionsService, 'findByCustomerId')
        .mockRejectedValueOnce(new Error());

      expect(
        transactionsController.findByCustomerId(customerId),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('Should return transactionId', async () => {
      const transactionId = '1';
      const result = await transactionsController.remove(transactionId);
      expect(result).toEqual(transactionId);
      expect(transactionsService.remove).toHaveBeenCalledTimes(1);
      expect(transactionsService.remove).toHaveBeenCalledWith(+transactionId);
    });

    it('Should throw an exception', () => {
      const transactionId = '1';
      jest
        .spyOn(transactionsService, 'remove')
        .mockRejectedValueOnce(new Error());

      expect(
        transactionsController.remove(transactionId),
      ).rejects.toThrowError();
    });
  });
});
