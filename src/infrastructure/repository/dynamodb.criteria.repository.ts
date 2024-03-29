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

  async delete(criteriaId: string, goalId: string): Promise<void> {
    try {
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.CRITERIA_PK(goalId),
          sk: this.CRITERIA_SK(criteriaId)
        }
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
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': this.CRITERIA_PK(goalId),
          ':sk': 'CRITERIA#'
        },
        ConsistentRead: false
      };

      const data = await this.dynamoDBDocument.query(params);
      const items = data.Items;

      if (items !== undefined && items.length > 0) {
        criteria = items.map((item) => {
          return {
            id: item.criteriaId,
            goalId: item.goalId,
            description: item.description,
            weight: item.weight,
            createdAt: new Date(item.createdAt),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
          };
        });
      }
    } catch (error) {
      this.logger.error(`Error finding criteria: ${error}`);
    }

    return criteria;
  }

  async findById(criteriaId: string, goalId: string): Promise<Criteria | undefined> {
    let criteria: Criteria | undefined;

    try {
      const params = {
        TableName: this.TABLE_NAME,
        IndexName: 'GSI_GOAL_CRITERIA',
        Key: {
          pk: this.CRITERIA_PK(goalId),
          sk: this.CRITERIA_SK(criteriaId)
        }
      };

      const data = await this.dynamoDBDocument.get(params);
      const item = data.Item;

      if (item !== undefined) {
        criteria = {
          id: item.criteriaId,
          goalId: item.goalId,
          description: item.description,
          weight: item.weight,
          createdAt: new Date(item.createdAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
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
          criteriaId: criteria.id,
          goalId: criteria.goalId,
          description: criteria.description,
          weight: criteria.weight,
          createdAt: criteria.createdAt.toISOString()
        }
      };

      await this.dynamoDBDocument.put(params);
    } catch (error) {
      this.logger.error(`Error saving the criteria: ${error}`);
    }
  }

  async update(criteria: Criteria): Promise<void> {
    try {
      const params = new UpdateCommand({
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.CRITERIA_PK(criteria.goalId),
          sk: this.CRITERIA_SK(criteria.id)
        },
        UpdateExpression: 'SET #d = :description, #w = :weight, #u = :updatedAt',
        ExpressionAttributeNames: {
          '#d': 'description',
          '#w': 'weight',
          '#u': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':description': criteria.description,
          ':weight': criteria.weight,
          ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      });

      await this.dynamoDBDocument.send(params);
    } catch (error) {
      this.logger.error(`Error updating the criteria: ${error}`);
    }
  }
}
