import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

interface AuthenticatedRequest {
  user?: {
    role?: string;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền truy cập khu vực quản trị.');
    }
    return true;
  }
}
