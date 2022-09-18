import { CreatePayableDto } from '../dto/create-payable.dto';
import { parseJSON } from 'date-fns';

export const createPayableDtoMock: CreatePayableDto = {
  value: 1,
  status: 'paid',
  customerId: '1',
  paymentDate: parseJSON(1663355754805),
};
