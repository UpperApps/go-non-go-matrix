import { IsNotEmpty, Max, MaxLength, Min } from 'class-validator';
import ApiSchema from '../../../util/dto-name-decorator';

@ApiSchema({ name: 'in.Goal' })
export class GoalInDto {
  @IsNotEmpty()
  @MaxLength(50)
  private readonly name: string;

  @IsNotEmpty()
  @MaxLength(300)
  private readonly description: string;

  @Min(1)
  @Max(10)
  private readonly maxScore: number;

  constructor(name: string, description: string, maxScore: number) {
    this.name = name;
    this.description = description;
    this.maxScore = maxScore;
  }
}
