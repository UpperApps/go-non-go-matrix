import ApiSchema from '../../../util/dto-name-decorator';

@ApiSchema({ name: 'out.Item' })
export class ItemOutDto {
  public readonly id: string;
  public readonly goalId: string;
  public readonly name: string;
  public readonly description: string;
  public readonly createdAt: Date;
  public readonly updatedAt?: Date;

  constructor(id: string, goalId: string, name: string, description: string, createdAt: Date, updatedAt?: Date) {
    this.id = id;
    this.goalId = goalId;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
