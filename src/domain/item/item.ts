export class Item {
  constructor(
    public id: string,
    public goalId: string,
    public name: string,
    public description: string,
    public createdAt: Date,
    public updatedAt?: Date
  ) {}
}
