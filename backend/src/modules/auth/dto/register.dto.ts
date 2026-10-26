import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @MinLength(2, { message: 'Họ và tên phải có tối thiểu 2 ký tự' })
  fullName!: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email!: string;

  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @Matches(/^(0|\+84)[0-9]{9,10}$/, {
    message: 'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0 hoặc +84)',
  })
  phoneNumber!: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(8, { message: 'Mật khẩu phải có tối thiểu 8 ký tự' })
  password!: string;
}
