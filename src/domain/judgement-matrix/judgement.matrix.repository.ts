export interface JudgementMatrixRepository {
  save(): Promise<void>;
  findById(): Promise<void>;
  findAll(): Promise<void>;
  update(): Promise<void>;
  delete(): Promise<void>;
}

export const JudgementMatrixRepository = Symbol('JudgementMatrixRepository');
