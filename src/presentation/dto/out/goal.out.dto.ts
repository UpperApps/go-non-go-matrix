export class GoalOutDto {
  private readonly id: string;
  private readonly userId: string;
  private readonly name: string;
  private readonly description: string;
  private readonly maxScore: number;
  private readonly createdAt: Date;
  private readonly updatedAt?: Date;

  constructor(
    id: string,
    userId: string,
    name: string,
    description: string,
    maxScore: number,
    createdAt: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.maxScore = maxScore;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
