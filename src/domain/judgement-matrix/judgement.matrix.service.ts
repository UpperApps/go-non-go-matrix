import { Inject, Injectable } from '@nestjs/common';
import { JudgementMatrixRepository } from './judgement.matrix.repository';
import { CriteriaRepository } from '../criteria/criteria.repository';
import { Criteria } from '../criteria/criteria';

@Injectable()
export class JudgementMatrixService {
  constructor(
    @Inject(JudgementMatrixRepository) private readonly judgementMatrixRepository: JudgementMatrixRepository,
    @Inject(CriteriaRepository) private readonly criteriaRepository: CriteriaRepository
  ) {}

  saveJudgementMatrix() {
    return 'Judgement Matrix Created';
  }

  async getCriteriaCartesianProduct(goalId: string): Promise<Criteria[][]> {
    const criteria = await this.criteriaRepository.findAll(goalId);

    const criteriaMatrix = criteria.reduce((acc, cur, currentIndex, originalArray) => {
      originalArray.reduce((acc2, cur2) => {
        acc.push([cur, cur2]);
        return acc2;
      }, []);

      return acc;
    }, [] as Criteria[][]);

    return criteriaMatrix;
  }

  updateJudgementMatrix() {
    return 'Judgement Matrix Updated';
  }

  deleteJudgementMatrix() {
    return 'Judgement Matrix Deleted';
  }
}
