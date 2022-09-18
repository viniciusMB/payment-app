import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Model, Connection, FilterQuery } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);

    return newUser.save();
  }

  async findOne(filterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(filterQuery);
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<User>,
    update: Partial<User>,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(filterQuery, update);
  }

  async find(filterQuery: FilterQuery<User>) {
    return this.userModel.find(filterQuery);
  }
}
