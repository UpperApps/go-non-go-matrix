import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from 'class-validator';
import ApiSchema from '../../../util/dto-name-decorator';

@ApiSchema({ name: 'in.User' })
export class UserInDto {
  @IsNotEmpty()
  private readonly firstName: string;

  @IsNotEmpty()
  private readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  private readonly email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(8)
  private readonly password: string;

  constructor(firstName: string, lastName: string, email: string, password: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}
