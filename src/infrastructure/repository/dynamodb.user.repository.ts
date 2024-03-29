import 'reflect-metadata';
import { DynamoDBDocument, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import type { User } from '../../domain/user/user';
import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../domain/user/user.repository';

@Injectable()
class DynamodbUserRepository implements UserRepository {
  private readonly logger = new Logger(DynamodbUserRepository.name);

  private readonly USER_PK = 'USER';
  private readonly TABLE_NAME = 'go-non-go-matrix';
  constructor(private readonly dynamoDBDocument: DynamoDBDocument) {}

  async delete(id: string): Promise<void> {
    try {
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.USER_PK,
          sk: id
        }
      };

      await this.dynamoDBDocument.delete(params);
    } catch (error) {
      this.logger.error(`Error saving user: ${error}`);
    }
  }

  async findAll(): Promise<User[]> {
    let users: User[] = [];

    try {
      const params = {
        TableName: this.TABLE_NAME,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': this.USER_PK
        },
        ConsistentRead: true
      };

      const data = await this.dynamoDBDocument.query(params);
      const items = data.Items;

      if (items !== undefined && items.length > 0) {
        users = items.map((item) => {
          return {
            id: item.sk,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            password: item.password,
            createdAt: new Date(item.createdAt),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
          };
        });
      }
    } catch (error) {
      this.logger.error(`Error finding users: ${error}`);
    }

    return users;
  }

  async findById(id: string): Promise<User | undefined> {
    let user: User | undefined;

    try {
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.USER_PK,
          sk: id
        }
      };

      const data = await this.dynamoDBDocument.get(params);
      const item = data.Item;

      if (item !== undefined) {
        user = {
          id: item.sk,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          password: item.password,
          createdAt: new Date(item.createdAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
        };
      }
    } catch (error) {
      this.logger.error(`Error finding user: ${error}`);
    }

    return user;
  }

  async save(user: User): Promise<void> {
    try {
      const params = {
        TableName: this.TABLE_NAME,
        Item: {
          pk: this.USER_PK,
          sk: user.id,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt.toISOString()
        }
      };

      await this.dynamoDBDocument.put(params);
    } catch (error) {
      this.logger.error(`Error saving user: ${error}`);
    }
  }

  async update(id: string, user: User): Promise<void> {
    try {
      const params = new UpdateCommand({
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.USER_PK,
          sk: id
        },
        UpdateExpression:
          'SET firstName = :firstName, lastName = :lastName, email = :email, password = :password, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':firstName': user.firstName,
          ':lastName': user.lastName,
          ':email': user.email,
          ':password': user.password,
          ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      });

      await this.dynamoDBDocument.send(params);
    } catch (error) {
      this.logger.error(`Error saving user: ${error}`);
    }
  }
}

export default DynamodbUserRepository;
