import {
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0|\+84)[0-9]{9,10}$/, {
    message: 'Số điện thoại không hợp lệ (10 chữ số)',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có tối thiểu 8 ký tự' })
  newPassword?: string;
}
