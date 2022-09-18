import { Test, TestingModule } from '@nestjs/testing';
import { PayableEntity } from './entities/payable.entity';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { payableEntityMock } from './mocks/payable.entity.mock';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { CACHE_MANAGER } from '@nestjs/common';

const payableEntityList: PayableEntity[] = [
  payableEntityMock,
  payableEntityMock,
  payableEntityMock,
];

describe('PayableController', () => {
  let payableController: PayableController;
  let payableService: PayableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [
        {
          provide: CACHE_MANAGER,
          useFactory: jest.fn(),
        },
        {
          provide: PayableService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(payableEntityList),
            findOne: jest.fn().mockResolvedValue(payableEntityMock),
            findByCustomerId: jest.fn().mockResolvedValue(payableEntityList),
            getPayableByStatus: jest.fn().mockResolvedValue(payableEntityList),
            remove: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    payableController = module.get<PayableController>(PayableController);
    payableService = module.get<PayableService>(PayableService);
  });

  it('should be defined', () => {
    expect(payableController).toBeDefined();
    expect(payableService).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all payables', async () => {
      const result = await payableController.findAll();
      expect(payableService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(payableEntityList);
    });

    it('Shoul throw an exception', () => {
      jest.spyOn(payableService, 'findAll').mockRejectedValueOnce(new Error());
      expect(payableController.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('Should return a payble with same Id', async () => {
      const payableId = '1';
      const result = await payableController.findOne(payableId);

      expect(result).toEqual(payableEntityMock);
      expect(result.payableId).toEqual(+payableId);
      expect(payableService.findOne).toHaveBeenCalledTimes(1);
      expect(payableService.findOne).toHaveBeenCalledWith(+payableId);
    });

    it('Should throw an exception', () => {
      const payableId = '1';
      jest.spyOn(payableService, 'findOne').mockRejectedValueOnce(new Error());

      expect(payableController.findOne(payableId)).rejects.toThrowError();
    });
  });

  describe('findByCustomerId', () => {
    it(`Should return all customer's payables`, async () => {
      const customerId = '1';
      const result = await payableController.findByCustomerId(customerId);

      expect(result).toEqual(payableEntityList);

      expect(
        result.filter((payable) => payable.customerId !== customerId),
      ).toHaveLength(0);

      expect(payableService.findByCustomerId).toHaveBeenCalledTimes(1);
      expect(payableService.findByCustomerId).toBeCalledWith(customerId);
    });

    it('Should throw an exception', () => {
      const customerId = '1';

      jest
        .spyOn(payableService, 'findByCustomerId')
        .mockRejectedValueOnce(new Error());

      expect(
        payableController.findByCustomerId(customerId),
      ).rejects.toThrowError();
    });
  });

  describe('getBalanceByStatus', () => {
    it('Should return the sum of all payable with the queried status', async () => {
      const checkBalance: CheckBalanceDto = { status: 'paid', customerId: '1' };
      const result = await payableController.getBalanceByStatus(checkBalance);

      const allPayables = await payableController.findByCustomerId(
        checkBalance.customerId,
      );
      const sum = allPayables.reduce((prev, next) => {
        return prev + next.value;
      }, 0);

      expect(payableService.getPayableByStatus).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sum);
    });

    it('Should return an exception', () => {
      const checkBalance: CheckBalanceDto = { status: 'paid', customerId: '1' };

      jest
        .spyOn(payableService, 'getPayableByStatus')
        .mockRejectedValueOnce(new Error());

      expect(
        payableController.getBalanceByStatus(checkBalance),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('Should return payableId', async () => {
      const payableId = '1';
      const result = await payableController.remove(payableId);

      expect(result).toEqual(Number(payableId));
      expect(payableService.remove).toHaveBeenCalledTimes(1);
      expect(payableService.remove).toHaveBeenCalledWith(+payableId);
    });

    it('Should throw an exception', () => {
      const payableId = '1';
      jest.spyOn(payableService, 'remove').mockRejectedValueOnce(new Error());

      expect(payableController.remove(payableId)).rejects.toThrowError();
    });
  });
});
