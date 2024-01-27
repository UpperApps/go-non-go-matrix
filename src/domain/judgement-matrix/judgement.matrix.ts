import { Criteria } from '../criteria/criteria';

export class JudgementMatrix {
  constructor(
    public readonly id: string,
    public readonly criteriaToBeRated: Map<Criteria, Criteria>,
    public readonly criteriaWithPriority: string,
    public readonly score: number,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date
  ) {}
}
