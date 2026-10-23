import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  phoneNumber!: string;

  @IsOptional()
  @IsIn(['CUSTOMER', 'STAFF', 'ADMIN'])
  role?: 'CUSTOMER' | 'STAFF' | 'ADMIN';
}
