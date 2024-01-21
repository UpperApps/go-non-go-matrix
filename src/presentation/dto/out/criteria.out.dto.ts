import ApiSchema from '../../../util/dto-name-decorator';

@ApiSchema({ name: 'out.Criteria' })
export class CriteriaOutDto {
  public readonly id: string;
  public readonly goalId: string;
  public readonly description: string;
  public readonly weight: number;
  public readonly createdAt: Date;
  public readonly updatedAt?: Date;

  constructor(id: string, goalId: string, description: string, weight: number, createdAt: Date, updatedAt?: Date) {
    this.id = id;
    this.goalId = goalId;
    this.description = description;
    this.weight = weight;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
