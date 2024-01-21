import { IsNotEmpty, Max, MaxLength, Min } from 'class-validator';
import ApiSchema from '../../../util/dto-name-decorator';

@ApiSchema({ name: 'in.Criteria' })
export class CriteriaInDto {
  @IsNotEmpty()
  @MaxLength(300)
  public readonly description: string;

  @Min(0)
  @Max(10)
  public readonly weight: number;
  constructor(description: string, weight?: number) {
    this.description = description;
    this.weight = weight || 0;
  }
}
