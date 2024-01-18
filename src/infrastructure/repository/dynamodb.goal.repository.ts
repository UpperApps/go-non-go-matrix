import { GoalRepository } from '../../domain/goal/goal.repository';
import { Goal } from '../../domain/goal/goal';
import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBDocument, UpdateCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamodbGoalRepository implements GoalRepository {
  private readonly logger = new Logger(DynamodbGoalRepository.name);

  private GOAL_PK = (userId: string): string => {
    return `USER#${userId}`;
  };
  private GOAL_SK = (goalId: string): string => {
    return `GOAL#${goalId}`;
  };
  private readonly TABLE_NAME = 'go-non-go-matrix';
  constructor(private readonly dynamoDBDocument: DynamoDBDocument) {}
  async findAll(userId: string): Promise<Goal[]> {
    let goals: Goal[] = [];

    try {
      const params = {
        TableName: this.TABLE_NAME,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': this.GOAL_PK(userId),
        },
        ConsistentRead: true,
      };

      const data = await this.dynamoDBDocument.query(params);
      const items = data.Items;

      if (items !== undefined && items.length > 0) {
        goals = items.map((item) => {
          return {
            id: item.id,
            userId: item.userId,
            name: item.name,
            description: item.description,
            maxScore: item.maxScore,
            createdAt: new Date(item.createdAt),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
          };
        });
      }
    } catch (error) {
      this.logger.error(`Error finding goals: ${error}`);
    }

    return goals;
  }
  async findById(id: string, userId: string): Promise<Goal | undefined> {
    let goal: Goal | undefined;

    try {
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.GOAL_PK(userId),
          sk: this.GOAL_SK(id),
        },
      };

      const data = await this.dynamoDBDocument.get(params);
      const item = data.Item;

      if (item !== undefined) {
        goal = {
          id: item.id,
          userId: item.userId,
          name: item.name,
          description: item.description,
          maxScore: item.maxScore,
          createdAt: new Date(item.createdAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
        };
      }
    } catch (error) {
      this.logger.error(`Error finding the goal: ${error}`);
    }

    return goal;
  }
  async save(goal: Goal): Promise<void> {
    try {
      const params = {
        TableName: this.TABLE_NAME,
        Item: {
          pk: this.GOAL_PK(goal.userId),
          sk: this.GOAL_SK(goal.id),
          id: goal.id,
          userId: goal.userId,
          name: goal.name,
          description: goal.description,
          maxScore: goal.maxScore,
          createdAt: goal.createdAt.toISOString(),
        },
      };

      await this.dynamoDBDocument.put(params);
    } catch (error) {
      this.logger.error(`Error saving goal: ${error}`);
    }
  }
  async delete(id: string, userId: string): Promise<void> {
    try {
      const params = {
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.GOAL_PK(userId),
          sk: this.GOAL_SK(id),
        },
      };

      await this.dynamoDBDocument.delete(params);
    } catch (error) {
      this.logger.error(`Error deleting the goal: ${error}`);
    }
  }

  async update(id: string, userId: string, goal: Goal): Promise<void> {
    try {
      const params = new UpdateCommand({
        TableName: this.TABLE_NAME,
        Key: {
          pk: this.GOAL_PK(userId),
          sk: this.GOAL_SK(id),
        },
        UpdateExpression:
          'SET #n = :name, #d = :description, #ms = :maxScore, #u = :updatedAt',
        ExpressionAttributeNames: {
          '#n': 'name',
          '#d': 'description',
          '#ms': 'maxScore',
          '#u': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':name': goal.name,
          ':description': goal.description,
          ':maxScore': goal.maxScore,
          ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      });

      await this.dynamoDBDocument.send(params);
    } catch (error) {
      this.logger.error(`Error updating the goal: ${error}`);
    }
  }
}
