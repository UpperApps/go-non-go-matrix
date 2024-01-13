export class Criteria {
  constructor(
    public readonly id: string,
    public readonly goalId: string,
    public readonly description: string,
    public readonly weight: number,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
  ) {}
}
