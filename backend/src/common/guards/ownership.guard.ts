import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

interface AuthenticatedUser {
  id?: number;
  sub?: number;
  role?: string;
}

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Không xác định được danh tính người dùng');
    }

    // ADMIN và STAFF luôn có quyền vượt qua kiểm tra quyền sở hữu cá nhân
    if (user.role === 'ADMIN' || user.role === 'STAFF') {
      return true;
    }

    const currentUserId = Number(user.id || user.sub);
    const paramId = Number(request.params.userId || request.params.id);

    if (Number.isInteger(paramId) && paramId !== currentUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập hoặc chỉnh sửa tài nguyên của người dùng khác.',
      );
    }

    return true;
  }
}
