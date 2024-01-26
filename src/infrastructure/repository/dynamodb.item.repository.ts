import { ItemRepository } from '../../domain/item/item.repository';
import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBDocument, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Item } from '../../domain/item/item';

@Injectable()
export class DynamodbItemRepository implements ItemRepository {
  private readonly logger = new Logger(DynamodbItemRepository.name);

  private ITEM_PK = (goalId: string): string => {
    return `GOAL#${goalId}`;
  };

  private ITEM_SK = (itemId: string): string => {
    return `ITEM#${itemId}`;
  };

  private readonly TABLE_NAME = 'go-non-go-matrix';

  constructor(private readonly dynamoDBDocument: DynamoDBDocument) {}

  async save(item: Item): Promise<void> {
    try {
      const params = {
        TableName: this.TABLE_NAME,
        Item: {
          pk: this.ITEM_PK(item.goalId),
          sk: this.ITEM_SK(item.id),
          itemId: item.id,
          goalId: item.goalId,
          name: item.name,
          description: item.description,
          createdAt: item.createdAt.toISOString()
        }
      };

      await this.dynamoDBDocument.put(params);
    } catch (error) {
      this.logger.error(`Error saving the item: ${error}`);
    }
  }
  async findById(id: string, goalId: string): Promise<Item | undefined> {
    let item: Item | undefined;

    try {
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.ITEM_PK(goalId),
          sk: this.ITEM_SK(id)
        }
      };

      const data = await this.dynamoDBDocument.get(params);
      const itemFromDB = data.Item;

      if (itemFromDB !== undefined) {
        item = {
          id: itemFromDB.itemId,
          goalId: itemFromDB.goalId,
          name: itemFromDB.name,
          description: itemFromDB.description,
          createdAt: new Date(itemFromDB.createdAt),
          updatedAt: itemFromDB.updatedAt ? new Date(itemFromDB.updatedAt) : undefined
        };
      }
    } catch (error) {
      this.logger.error(`Error finding the item: ${error}`);
    }

    return item;
  }
  async findAll(goalId: string): Promise<Item[]> {
    let item: Item[] = [];

    try {
      const params = {
        TableName: this.TABLE_NAME,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': this.ITEM_PK(goalId),
          ':sk': 'ITEM#'
        },
        ConsistentRead: false
      };

      const data = await this.dynamoDBDocument.query(params);
      const items = data.Items;

      if (items !== undefined && items.length > 0) {
        item = items.map((item) => {
          return {
            id: item.itemId,
            goalId: item.goalId,
            name: item.name,
            description: item.description,
            createdAt: new Date(item.createdAt),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
          };
        });
      }
    } catch (error) {
      this.logger.error(`Error finding item: ${error}`);
    }

    return item;
  }
  async update(item: Item): Promise<void> {
    try {
      const params = new UpdateCommand({
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.ITEM_PK(item.goalId),
          sk: this.ITEM_SK(item.id)
        },
        UpdateExpression: 'SET #n = :name, #d = :description, #u = :updatedAt',
        ExpressionAttributeNames: {
          '#n': 'name',
          '#d': 'description',
          '#u': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':name': item.name,
          ':description': item.description,
          ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      });

      await this.dynamoDBDocument.send(params);
    } catch (error) {
      this.logger.error(`Error updating the item: ${error}`);
    }
  }
  async delete(itemId: string, goalId: string): Promise<void> {
    try {
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.ITEM_PK(goalId),
          sk: this.ITEM_SK(itemId)
        }
      };

      await this.dynamoDBDocument.delete(params);
    } catch (error) {
      this.logger.error(`Error deleting the item: ${error}`);
    }
  }
}
