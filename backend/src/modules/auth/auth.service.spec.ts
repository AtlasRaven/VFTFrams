import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { UsersService, type UserEntity } from '../users/users.service.js';

describe('AuthService PostgreSQL-backed account behavior', () => {
  let authService: AuthService;
  let users: UserEntity[];

  beforeEach(async () => {
    const passwordHash = await bcrypt.hash('ValidPass123!', 4);
    users = [
      {
        id: 1,
        fullName: 'VFT Administrator',
        email: 'admin@vftfarms.com',
        phoneNumber: '02432029199',
        passwordHash,
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        fullName: 'VFT Customer',
        email: 'customer@example.com',
        phoneNumber: '0912345678',
        passwordHash,
        role: 'CUSTOMER',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        fullName: 'Admin01',
        email: 'Admin01@gmail.com',
        phoneNumber: '0910000009',
        passwordHash:
          '$2b$10$bKFzgH9KAtbMoyBQt9.Cve.XaI98eZMsRbQoxjNz4/bO3QpaZrJFO',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const usersService = {
      findByEmail: vi.fn(async (email: string) =>
        users.find(
          (user) => user.email.toLowerCase() === email.toLowerCase(),
        ) ?? null,
      ),
      findById: vi.fn(async (id: number) => {
        const user = users.find((entry) => entry.id === id);
        if (!user) return null;
        const { passwordHash: _passwordHash, ...safeUser } = user;
        return safeUser;
      }),
      create: vi.fn(async () => ({})),
    } as unknown as UsersService;

    authService = new AuthService(usersService);
  });

  it('authenticates an administrator and returns role-bearing session tokens', async () => {
    const result = await authService.login({
      email: 'ADMIN@VFTFARMS.COM',
      password: 'ValidPass123!',
    });
    expect(result.user).toMatchObject({ id: 1, role: 'ADMIN' });
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('authenticates customer accounts as well as administrators', async () => {
    const result = await authService.login({
      email: 'customer@example.com',
      password: 'ValidPass123!',
    });
    expect(result.user).toMatchObject({ id: 2, role: 'CUSTOMER' });
    expect(result).toHaveProperty('accessToken');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('authenticates the Admin01 account using the password documented for seed accounts', async () => {
    const result = await authService.login({
      email: 'admin01@gmail.com',
      password: 'VftDemo@2026',
    });

    expect(result.user).toMatchObject({
      id: 3,
      email: 'Admin01@gmail.com',
      role: 'ADMIN',
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('registers customers without granting a token or admin access', async () => {
    const create = vi.fn().mockResolvedValue({
      id: 3,
      fullName: 'New Customer',
      email: 'new@example.com',
      phoneNumber: '0987654321',
      role: 'CUSTOMER',
    });
    const usersService = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create,
    } as unknown as UsersService;
    const registerService = new AuthService(usersService);

    const result = await registerService.register({
      fullName: 'New Customer',
      email: 'new@example.com',
      phoneNumber: '0987654321',
      password: 'ValidPass123!',
    });

    expect(result.user.role).toBe('CUSTOMER');
    expect(result).not.toHaveProperty('accessToken');
    expect(result).not.toHaveProperty('refreshToken');
  });
});
