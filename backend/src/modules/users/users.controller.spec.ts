import { ForbiddenException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController access control', () => {
  const users = [
    { id: 1, fullName: 'Admin', email: 'admin@example.com', phoneNumber: '1', role: 'ADMIN' },
    { id: 2, fullName: 'Customer', email: 'customer@example.com', phoneNumber: '2', role: 'CUSTOMER' },
  ];
  const usersService = {
    findById: async (id: number) => users.find((user) => user.id === id) ?? null,
    delete: async () => undefined,
  } as unknown as UsersService;
  const controller = new UsersController(usersService);

  it('does not expose another user profile to a customer', async () => {
    await expect(
      controller.getById(1, { sub: 2, role: 'CUSTOMER' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows a customer to retrieve their own profile', async () => {
    const result = await controller.getById(2, {
      sub: 2,
      role: 'CUSTOMER',
    });
    expect(result.data).toMatchObject({ id: 2, role: 'CUSTOMER' });
  });

  it('allows an administrator to retrieve another profile', async () => {
    const result = await controller.getById(2, { sub: 1, role: 'ADMIN' });
    expect(result.data).toMatchObject({ id: 2, role: 'CUSTOMER' });
  });

  it('prevents an administrator from deleting their own account', async () => {
    await expect(
      controller.deleteUser(1, { sub: 1, role: 'ADMIN' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
