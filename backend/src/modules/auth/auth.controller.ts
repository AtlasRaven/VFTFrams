import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto, RefreshTokenDto } from './dto/login.dto.js';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return {
      success: true,
      data,
      message: 'Đăng ký tài khoản VFT Farms thành công!',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return {
      success: true,
      data,
      message: 'Đăng nhập thành công!',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    const data = await this.authService.refreshToken(dto);
    return {
      success: true,
      data,
      message: 'Làm mới Access Token thành công!',
    };
  }
}
