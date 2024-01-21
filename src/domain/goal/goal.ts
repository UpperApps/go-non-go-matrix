export class Goal {
  constructor(
    public id: string,
    public userId: string,
    public name: string,
    public description: string,
    public maxScore: number,
    public createdAt: Date,
    public updatedAt?: Date
  ) {}
}
