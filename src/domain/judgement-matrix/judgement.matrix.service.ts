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

  async getJudgementMatrix(goalId: string): Promise<Criteria[][]> {
    const criteriaMatrix: Criteria[][] = [];

    const criteria = await this.criteriaRepository.findAll(goalId);

    // Create a matrix of criteria to be evaluated from the list of criteria from db
    for (let i = 0; i < criteria.length; i++) {
      for (let j = 0; j < criteria.length; j++) {
        if (criteria[i].id !== criteria[j].id) {
          criteriaMatrix.push([criteria[i], criteria[j]]);
        }
      }
    }

    // Get the list of criteria already evaluated from db and compare it with the matrix of criteria to be evaluated
    // If there is a pair of criteria that is not yet evaluated, insert it to the matrix of criteria to be evaluated

    console.log(criteriaMatrix);

    return criteriaMatrix;
  }

  updateJudgementMatrix() {
    return 'Judgement Matrix Updated';
  }

  deleteJudgementMatrix() {
    return 'Judgement Matrix Deleted';
  }
}
