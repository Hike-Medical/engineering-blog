import { CreateUserParams } from '@demo/sdk';
import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto implements CreateUserParams {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minSymbols: 1
  })
  password: string;
}
