import { ConflictException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from './users.service.js';

function createUserRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 10,
    full_name: 'Demo Customer',
    email: 'demo.user01@example.test',
    phone_number: '0900000001',
    password_hash: 'bcrypt-hash',
    role: 'CUSTOMER',
    avatar_url: null,
    is_active: true,
    created_at: new Date('2026-01-01T00:00:00.000Z'),
    updated_at: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('UsersService PostgreSQL persistence', () => {
  it('looks up accounts by case-insensitive email and returns password hashes only internally', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [createUserRow()] });
    const service = new UsersService({ query } as unknown as DatabaseService);

    const user = await service.findByEmail('DEMO.USER01@example.test');

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('lower(email) = lower($1)'),
      ['DEMO.USER01@example.test'],
    );
    expect(user).toMatchObject({ id: 10, role: 'CUSTOMER', isActive: true });
    expect(user?.passwordHash).toBe('bcrypt-hash');
  });

  it('never returns a password hash from profile lookups', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [createUserRow()] });
    const service = new UsersService({ query } as unknown as DatabaseService);

    const user = await service.findById(10);

    expect(user).toMatchObject({ id: 10, email: 'demo.user01@example.test' });
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('maps duplicate email or phone database errors to a conflict', async () => {
    const query = vi.fn().mockRejectedValue({ code: '23505' });
    const service = new UsersService({ query } as unknown as DatabaseService);

    await expect(
      service.create({
        fullName: 'Duplicate',
        email: 'duplicate@example.test',
        phoneNumber: '0900000010',
        passwordHash: 'hash',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
