import { Test, TestingModule } from '@nestjs/testing';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { transactionEntityMock } from './mocks/transactions.entity.mock';
import { createTransactionDtoMock } from './mocks/transactions.create.dto.mock';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';

const transactionsEntityList: TransactionEntity[] = [
  transactionEntityMock,
  transactionEntityMock,
  transactionEntityMock,
];

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  let transactionsRepository: Repository<TransactionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsService],
      imports: [Repository],
      providers: [
        TransactionsService,
        {
          provide: CACHE_MANAGER,
          useFactory: jest.fn(),
        },
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockResolvedValue(transactionsEntityList),
            delete: jest.fn(),
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
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
  });

  it('should be defined', () => {
    expect(transactionsService).toBeDefined();
    expect(transactionsRepository).toBeDefined();
  });

  describe('create', () => {
    it('Should create a trasanction and return it', async () => {
      const result = await transactionsService.create(createTransactionDtoMock);

      expect(transactionsRepository.create).toHaveBeenCalledTimes(1);
      expect(transactionsRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.objectContaining(createTransactionDtoMock));
    });

    it('Should throw an exception', () => {
      jest
        .spyOn(transactionsRepository, 'save')
        .mockRejectedValueOnce(new Error());

      expect(
        transactionsService.create(createTransactionDtoMock),
      ).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('Should return all transactions', async () => {
      const result = await transactionsService.findAll();

      expect(transactionsRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(transactionsEntityList);
    });

    it('Should throw an exception', () => {
      jest
        .spyOn(transactionsRepository, 'find')
        .mockRejectedValueOnce(new Error());

      expect(transactionsService.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('Should return a transaction with same Id', async () => {
      const transactionId = 1;
      const result = await transactionsService.findOne(transactionId);
      expect(result.transactionId).toEqual(transactionId);
      expect(transactionsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(transactionsRepository.findOne).toHaveBeenCalledWith({
        where: { transactionId },
      });
    });

    it('Should throw an exception', () => {
      const transactionId = 1;

      jest
        .spyOn(transactionsRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(transactionsService.findOne(transactionId)).rejects.toThrowError();
    });
  });

  describe('findByCustomerId', () => {
    it(`Should return all customer's transactions`, async () => {
      const customerId = '1';
      const result = await transactionsService.findByCustomerId(customerId);
      expect(
        result.filter((transaction) => transaction.customerId !== customerId),
      ).toHaveLength(0);

      expect(transactionsRepository.find).toHaveBeenCalledTimes(1);
      expect(transactionsRepository.find).toHaveBeenCalledWith({
        where: { customerId },
      });
    });

    it('Should throw an exception', () => {
      const customerId = '1';

      jest
        .spyOn(transactionsRepository, 'find')
        .mockRejectedValueOnce(new Error());

      expect(
        transactionsService.findByCustomerId(customerId),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('Should return transactionId', async () => {
      const transactionId = 1;
      const result = await transactionsService.remove(transactionId);
      expect(result).toEqual(transactionId);
      expect(transactionsRepository.delete).toHaveBeenCalledTimes(1);
      expect(transactionsRepository.delete).toHaveBeenCalledWith({
        transactionId,
      });
    });

    it('Should throw an exception', () => {
      const transactionId = '1';
      jest
        .spyOn(transactionsService, 'remove')
        .mockRejectedValueOnce(new Error());

      expect(transactionsService.remove(+transactionId)).rejects.toThrowError();
    });
  });
});
