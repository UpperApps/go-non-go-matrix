import { CriteriaRepository } from '../../domain/criteria/criteria.repository';
import { Criteria } from '../../domain/criteria/criteria';
import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBDocument, UpdateCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamodbCriteriaRepository implements CriteriaRepository {
  private readonly logger = new Logger(DynamodbCriteriaRepository.name);

  private CRITERIA_PK = (goalId: string): string => {
    return `GOAL#${goalId}`;
  };
  private CRITERIA_SK = (criteriaId: string): string => {
    return `CRITERIA#${criteriaId}`;
  };
  private readonly TABLE_NAME = 'go-non-go-matrix';
  constructor(private readonly dynamoDBDocument: DynamoDBDocument) {}

  async delete(id: string, goalId: string): Promise<void> {
    try {
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.CRITERIA_PK(goalId),
          sk: this.CRITERIA_SK(id),
        },
      };

      await this.dynamoDBDocument.delete(params);
    } catch (error) {
      this.logger.error(`Error deleting the criteria: ${error}`);
    }
  }

  async findAll(goalId: string): Promise<Criteria[]> {
    let criteria: Criteria[] = [];

    try {
      const params = {
        TableName: this.TABLE_NAME,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': this.CRITERIA_PK(goalId),
        },
        ConsistentRead: true,
      };

      const data = await this.dynamoDBDocument.query(params);
      const items = data.Items;

      if (items !== undefined && items.length > 0) {
        criteria = items.map((item) => {
          return {
            id: item.id,
            goalId: item.goalId,
            description: item.description,
            weight: item.weight,
            createdAt: new Date(item.createdAt),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
          };
        });
      }
    } catch (error) {
      this.logger.error(`Error finding criteria: ${error}`);
    }

    return criteria;
  }

  async findById(id: string, goalId: string): Promise<Criteria | undefined> {
    let criteria: Criteria | undefined;

    try {
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.CRITERIA_PK(goalId),
          sk: this.CRITERIA_SK(id),
        },
      };

      const data = await this.dynamoDBDocument.get(params);
      const item = data.Item;

      if (item !== undefined) {
        criteria = {
          id: item.id,
          goalId: item.goalId,
          description: item.description,
          weight: item.weight,
          createdAt: new Date(item.createdAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
        };
      }
    } catch (error) {
      this.logger.error(`Error finding the criteria: ${error}`);
    }

    return criteria;
  }

  async save(criteria: Criteria): Promise<void> {
    try {
      const params = {
        TableName: this.TABLE_NAME,
        Item: {
          pk: this.CRITERIA_PK(criteria.goalId),
          sk: this.CRITERIA_SK(criteria.id),
          id: criteria.id,
          goalId: criteria.goalId,
          description: criteria.description,
          weight: criteria.weight,
          createdAt: criteria.createdAt.toISOString(),
        },
      };

      await this.dynamoDBDocument.put(params);
    } catch (error) {
      this.logger.error(`Error saving the criteria: ${error}`);
    }
  }

  async update(id: string, goalId: string, criteria: Criteria): Promise<void> {
    try {
      const params = new UpdateCommand({
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.CRITERIA_PK(goalId),
          sk: this.CRITERIA_SK(id),
        },
        UpdateExpression:
          'SET #d = :description, #w = :weight, #u = :updatedAt',
        ExpressionAttributeNames: {
          '#d': 'description',
          '#w': 'weight',
          '#u': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':description': criteria.description,
          ':weight': criteria.weight,
          ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      });

      await this.dynamoDBDocument.send(params);
    } catch (error) {
      this.logger.error(`Error updating the criteria: ${error}`);
    }
  }
}
