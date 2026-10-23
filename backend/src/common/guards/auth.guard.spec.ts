import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { JwtAuthGuard } from './auth.guard.js';

function createExecutionContext(authorization?: string): ExecutionContext {
  const request = { headers: { authorization } };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  const guard = new JwtAuthGuard();

  it('rejects a missing authorization header with 401', () => {
    expect(() => guard.canActivate(createExecutionContext())).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects malformed and invalid bearer tokens with 401', () => {
    expect(() =>
      guard.canActivate(createExecutionContext('Basic invalid')),
    ).toThrow(UnauthorizedException);
    expect(() =>
      guard.canActivate(createExecutionContext('Bearer invalid')),
    ).toThrow(UnauthorizedException);
  });
});
