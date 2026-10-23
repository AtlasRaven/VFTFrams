import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../../config/jwt.config.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: jwt.JwtPayload }>();
    const authHeader = request.headers.authorization;

    if (typeof authHeader !== 'string' || authHeader.trim() === '') {
      throw new UnauthorizedException(
        'Yêu cầu xác thực tài khoản (Thiếu Bearer Token)',
      );
    }

    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException(
        'Định dạng token không hợp lệ (Bearer token)',
      );
    }

    try {
      const decoded = jwt.verify(parts[1], JWT_CONFIG.secret);
      if (
        typeof decoded !== 'object' ||
        decoded === null ||
        (typeof decoded.sub !== 'string' && typeof decoded.sub !== 'number') ||
        typeof decoded.role !== 'string' ||
        !['ADMIN', 'CUSTOMER', 'STAFF'].includes(decoded.role)
      ) {
        throw new UnauthorizedException(
          'Token không hợp lệ hoặc đã bị chỉnh sửa.',
        );
      }
      request.user = decoded;
      return true;
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(
          'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        );
      }
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException(
        'Token không hợp lệ hoặc đã bị chỉnh sửa.',
      );
    }
  }
}
