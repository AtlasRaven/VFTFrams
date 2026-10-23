import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        // If handler already returned custom format
        if (res && typeof res === 'object' && 'success' in res) {
          return {
            success: res.success ?? true,
            data: res.data !== undefined ? res.data : null,
            message: res.message || 'Thao tác thành công',
          };
        }
        return {
          success: true,
          data: res !== undefined ? res : null,
          message: 'Thao tác thành công',
        };
      }),
    );
  }
}
