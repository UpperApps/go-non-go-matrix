import { IsNotEmpty, MaxLength } from 'class-validator';
import ApiSchema from '../../../util/dto-name-decorator';

@ApiSchema({ name: 'in.Item' })
export class ItemInDto {
  @IsNotEmpty()
  @MaxLength(100)
  private readonly name: string;

  @MaxLength(300)
  private readonly description: string;

  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description;
  }
}
