import ApiSchema from '../../../util/dto-name-decorator';

@ApiSchema({ name: 'out.User' })
export class UserOutDto {
  private readonly id: string;
  private readonly firstName: string;
  private readonly lastName: string;
  private readonly email: string;
  private readonly createdAt: Date;
  private readonly updatedAt?: Date;

  constructor(id: string, firstName: string, lastName: string, email: string, createdAt: Date, updatedAt?: Date) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
