import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import type { QueryResultRow } from 'pg';
import type { PoolClient } from 'pg';
import { DatabaseService } from '../../database/database.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'STAFF';

export interface UserEntity {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressEntity {
  id: number;
  userId: number;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault: boolean;
  createdAt: string;
}

interface UserRow extends QueryResultRow {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  password_hash: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

interface AddressRow extends QueryResultRow {
  id: number;
  user_id: number;
  recipient_name: string;
  phone_number: string;
  province: string;
  district: string;
  ward: string;
  street_address: string;
  is_default: boolean;
  created_at: Date | string;
}

const USER_COLUMNS = `
  id, full_name, email, phone_number, password_hash, role, avatar_url,
  is_active, created_at, updated_at
`;

function toUser(row: UserRow): UserEntity {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phoneNumber: row.phone_number,
    passwordHash: row.password_hash,
    role: row.role,
    ...(row.avatar_url ? { avatarUrl: row.avatar_url } : {}),
    isActive: row.is_active,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function toAddress(row: AddressRow): AddressEntity {
  return {
    id: row.id,
    userId: row.user_id,
    recipientName: row.recipient_name,
    phoneNumber: row.phone_number,
    province: row.province,
    district: row.district,
    ward: row.ward,
    streetAddress: row.street_address,
    isDefault: row.is_default,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function withoutPassword(user: UserEntity): Omit<UserEntity, 'passwordHash'> {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  );
}

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<{
    items: Omit<UserEntity, 'passwordHash'>[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 10));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const queryParams: (number | string)[] = [];

    if (params?.role && params.role !== 'ALL') {
      queryParams.push(params.role);
      conditions.push(`role = $${queryParams.length}`);
    }

    if (params?.search && params.search.trim()) {
      queryParams.push(`%${params.search.trim().toLowerCase()}%`);
      const pIdx = queryParams.length;
      conditions.push(
        `(lower(full_name) LIKE $${pIdx} OR lower(email) LIKE $${pIdx} OR phone_number LIKE $${pIdx})`,
      );
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await this.database.query<{ count: string | number }>(
      `SELECT COUNT(*)::int as count FROM users ${whereClause}`,
      queryParams,
    );
    const total = Number(countRes.rows[0]?.count || 0);
    const totalPages = Math.ceil(total / limit) || 1;

    const dataParams = [...queryParams, limit, offset];
    const dataQuery = `SELECT ${USER_COLUMNS} FROM users ${whereClause} ORDER BY id ASC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

    const result = await this.database.query<UserRow>(dataQuery, dataParams);
    return {
      items: result.rows.map((row) => withoutPassword(toUser(row))),
      pagination: { total, page, limit, totalPages },
    };
  }

  async findById(id: number): Promise<Omit<UserEntity, 'passwordHash'> | null> {
    const result = await this.database.query<UserRow>(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
      [id],
    );
    const row = result.rows[0];
    return row ? withoutPassword(toUser(row)) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await this.database.query<UserRow>(
      `SELECT ${USER_COLUMNS} FROM users WHERE lower(email) = lower($1)`,
      [email.trim()],
    );
    return result.rows[0] ? toUser(result.rows[0]) : null;
  }

  async create(userDto: {
    fullName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
    role?: UserRole;
  }): Promise<Omit<UserEntity, 'passwordHash'>> {
    try {
      const result = await this.database.query<UserRow>(
        `INSERT INTO users (full_name, email, phone_number, password_hash, role)
         VALUES ($1, lower($2), $3, $4, $5)
         RETURNING ${USER_COLUMNS}`,
        [
          userDto.fullName.trim(),
          userDto.email.trim(),
          userDto.phoneNumber.trim(),
          userDto.passwordHash,
          userDto.role ?? 'CUSTOMER',
        ],
      );
      return withoutPassword(toUser(result.rows[0]));
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Email hoặc số điện thoại này đã được sử dụng.',
        );
      }
      throw error;
    }
  }

  async update(
    id: number,
    userDto: {
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      passwordHash?: string;
      role?: UserRole;
      isActive?: boolean;
    },
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    try {
      const result = await this.database.query<UserRow>(
        `UPDATE users SET
           full_name = COALESCE($2, full_name),
           email = COALESCE(lower($3), email),
           phone_number = COALESCE($4, phone_number),
           password_hash = COALESCE($5, password_hash),
           role = COALESCE($6, role),
           is_active = COALESCE($7, is_active),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING ${USER_COLUMNS}`,
        [
          id,
          userDto.fullName?.trim() ?? null,
          userDto.email?.trim() ?? null,
          userDto.phoneNumber?.trim() ?? null,
          userDto.passwordHash ?? null,
          userDto.role ?? null,
          userDto.isActive ?? null,
        ],
      );
      if (!result.rows[0]) {
        throw new NotFoundException(`Tài khoản #${id} không tồn tại.`);
      }
      return withoutPassword(toUser(result.rows[0]));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Email hoặc số điện thoại này đã được sử dụng.',
        );
      }
      throw error;
    }
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    const userResult = await this.database.query<UserRow>(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
      [userId],
    );
    const existing = userResult.rows[0];
    if (!existing) {
      throw new NotFoundException(`Tài khoản #${userId} không tồn tại.`);
    }

    let passwordHash = existing.password_hash;
    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException(
          'Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới.',
        );
      }
      const isMatch = await bcrypt.compare(
        dto.currentPassword,
        existing.password_hash,
      );
      if (!isMatch) {
        throw new BadRequestException('Mật khẩu hiện tại không chính xác.');
      }
      passwordHash = await bcrypt.hash(dto.newPassword, 10);
    }

    const newFullName =
      dto.fullName !== undefined ? dto.fullName.trim() : existing.full_name;
    const newPhone =
      dto.phoneNumber !== undefined
        ? dto.phoneNumber.trim()
        : existing.phone_number;
    const newAvatar =
      dto.avatarUrl !== undefined
        ? dto.avatarUrl.trim() || null
        : existing.avatar_url;

    try {
      const result = await this.database.query<UserRow>(
        `UPDATE users SET
           full_name = $2,
           phone_number = $3,
           avatar_url = $4,
           password_hash = $5,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING ${USER_COLUMNS}`,
        [userId, newFullName, newPhone, newAvatar, passwordHash],
      );
      return withoutPassword(toUser(result.rows[0]));
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Số điện thoại này đã được sử dụng.');
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.database.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id],
    );
    if (!result.rowCount) {
      throw new NotFoundException(`Tài khoản #${id} không tồn tại.`);
    }
  }

  async getAddresses(userId: number): Promise<AddressEntity[]> {
    const result = await this.database.query<AddressRow>(
      `SELECT id, user_id, recipient_name, phone_number, province, district,
              ward, street_address, is_default, created_at
       FROM addresses WHERE user_id = $1 ORDER BY id`,
      [userId],
    );
    return result.rows.map(toAddress);
  }

  async addAddress(
    userId: number,
    dto: CreateAddressDto,
  ): Promise<AddressEntity> {
    return this.database.withTransaction(async (client: PoolClient) => {
      const user = await client.query('SELECT id FROM users WHERE id = $1', [
        userId,
      ]);
      if (!user.rowCount) {
        throw new NotFoundException(`Người dùng ID ${userId} không tồn tại`);
      }

      const existing = await client.query<{ count: string }>(
        'SELECT count(*)::text AS count FROM addresses WHERE user_id = $1',
        [userId],
      );
      const isDefault = dto.isDefault ?? existing.rows[0].count === '0';

      if (isDefault) {
        await client.query(
          'UPDATE addresses SET is_default = false WHERE user_id = $1',
          [userId],
        );
      }

      const result = await client.query<AddressRow>(
        `INSERT INTO addresses (
           user_id, recipient_name, phone_number, province, district, ward,
           street_address, is_default
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, user_id, recipient_name, phone_number, province,
                   district, ward, street_address, is_default, created_at`,
        [
          userId,
          dto.recipientName,
          dto.phoneNumber,
          dto.province,
          dto.district,
          dto.ward,
          dto.streetAddress,
          isDefault,
        ],
      );
      return toAddress(result.rows[0]);
    });
  }
}
