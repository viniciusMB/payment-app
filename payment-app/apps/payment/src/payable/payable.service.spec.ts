import { Test, TestingModule } from '@nestjs/testing';
import { PayableEntity } from './entities/payable.entity';
import { PayableService } from './payable.service';
import { payableEntityMock } from './mocks/payable.entity.mock';
import { createPayableDtoMock } from './mocks/payable.create.dto.mock';
import { CreatePayableDto } from './dto/create-payable.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';

const payableEntityList: PayableEntity[] = [
  payableEntityMock,
  payableEntityMock,
  payableEntityMock,
];

describe('PayableService', () => {
  let payableService: PayableService;
  let payableRepository: Repository<PayableEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableService],
      imports: [Repository],
      providers: [
        PayableService,
        {
          provide: CACHE_MANAGER,
          useFactory: jest.fn(),
        },
        {
          provide: getRepositoryToken(PayableEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockResolvedValue(payableEntityList),
            delete: jest.fn(),
            findAll: jest.fn().mockResolvedValue(payableEntityList),
            create: jest.fn().mockResolvedValue(payableEntityMock),
            findOne: jest.fn().mockResolvedValue(payableEntityMock),
            findByCustomerId: jest.fn().mockResolvedValue(payableEntityMock),
            getPayableByStatus: jest.fn().mockResolvedValue(payableEntityMock),
            remove: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    payableService = module.get<PayableService>(PayableService);
    payableRepository = module.get<Repository<PayableEntity>>(
      getRepositoryToken(PayableEntity),
    );
  });

  it('should be defined', () => {
    expect(payableService).toBeDefined();
    expect(payableRepository).toBeDefined();
  });

  describe('create', () => {
    it('Should create a payable and return it', async () => {
      const result = await payableService.create(createPayableDtoMock);

      expect(payableRepository.create).toHaveBeenCalledTimes(1);
      expect(payableRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.objectContaining(createPayableDtoMock));
    });

    it('Should throw an exception', () => {
      jest.spyOn(payableRepository, 'save').mockRejectedValueOnce(new Error());

      expect(
        payableService.create(createPayableDtoMock),
      ).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('Should return all payables', async () => {
      const result = await payableService.findAll();

      expect(payableRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(payableEntityList);
    });

    it('Shoul throw an exception', () => {
      jest.spyOn(payableRepository, 'find').mockRejectedValueOnce(new Error());
      expect(payableService.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('Should return a payble with same Id', async () => {
      const payableId = 1;
      const result = await payableService.findOne(payableId);

      expect(result).toEqual(payableEntityMock);
      expect(result.payableId).toEqual(payableId);
      expect(payableRepository.findOne).toHaveBeenCalledTimes(1);
      expect(payableRepository.findOne).toHaveBeenCalledWith({
        where: { payableId },
      });
    });

    it('Should throw an exception', () => {
      const payableId = '1';
      jest
        .spyOn(payableRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(payableService.findOne(+payableId)).rejects.toThrowError();
    });
  });

  describe('findByCustomerId', () => {
    it(`Should return all customer's payables`, async () => {
      const customerId = '1';
      const result = await payableService.findByCustomerId(customerId);

      expect(result).toEqual(payableEntityList);

      expect(
        result.filter((payable) => payable.customerId !== customerId),
      ).toHaveLength(0);

      expect(payableRepository.find).toHaveBeenCalledTimes(1);
      expect(payableRepository.find).toBeCalledWith({ where: { customerId } });
    });

    it('Should throw an exception', () => {
      const customerId = '1';

      jest.spyOn(payableRepository, 'find').mockRejectedValueOnce(new Error());

      expect(
        payableService.findByCustomerId(customerId),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('Should return payableId', async () => {
      const payableId = 1;
      const result = await payableService.remove(payableId);

      expect(result).toEqual(payableId);
      expect(payableRepository.delete).toHaveBeenCalledTimes(1);
      expect(payableRepository.delete).toHaveBeenCalledWith({ payableId });
    });

    it('Should throw an exception', () => {
      const payableId = '1';
      jest.spyOn(payableService, 'remove').mockRejectedValueOnce(new Error());

      expect(payableService.remove(+payableId)).rejects.toThrowError();
    });
  });
});
