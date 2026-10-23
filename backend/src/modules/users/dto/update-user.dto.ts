import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsIn(['CUSTOMER', 'STAFF', 'ADMIN'])
  role?: 'CUSTOMER' | 'STAFF' | 'ADMIN';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
