import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto, RefreshTokenDto } from './dto/login.dto.js';
import { JWT_CONFIG } from '../../config/jwt.config.js';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private generateTokens(user: {
    id: number;
    email: string;
    role: string;
    fullName: string;
  }) {
    const payload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const accessToken = jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.expiresIn as SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, JWT_CONFIG.refreshSecret, {
      expiresIn: JWT_CONFIG.refreshExpiresIn as SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException(
        'Email này đã được sử dụng. Vui lòng đăng nhập.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser = await this.usersService.create({
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash,
      role: 'CUSTOMER',
    });

    return {
      user: newUser,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch || !user.isActive) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    const tokens = this.generateTokens(safeUser);

    return {
      user: safeUser,
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    let userId: number;
    try {
      const decoded = jwt.verify(dto.refreshToken, JWT_CONFIG.refreshSecret);
      if (
        typeof decoded !== 'object' ||
        decoded === null ||
        (typeof decoded.sub !== 'string' && typeof decoded.sub !== 'number')
      ) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }
      userId = Number(decoded.sub);
      if (!Number.isSafeInteger(userId) || userId <= 0) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }

    const user = await this.usersService.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Tài khoản không tồn tại hoặc đã bị khóa',
      );
    }

    const tokens = this.generateTokens(user);
    return { user, ...tokens };
  }
}
