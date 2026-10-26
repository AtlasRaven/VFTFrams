import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UsersService } from './users.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { JwtAuthGuard } from '../../common/guards/auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator.js';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    const profile = await this.usersService.findById(
      Number(user.sub || user.id),
    );
    if (!profile) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản');
    }
    return {
      success: true,
      data: profile,
      message: 'Lấy thông tin tài khoản thành công',
    };
  }

  // CUSTOMER / STAFF / ADMIN tự cập nhật thông tin cá nhân & mật khẩu
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Patch('me/profile')
  async updateMyProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = Number(user.sub || user.id);
    const updated = await this.usersService.updateProfile(userId, dto);
    return {
      success: true,
      data: updated,
      message: 'Cập nhật thông tin cá nhân thành công',
    };
  }

  // RBAC: Chỉ ADMIN mới được xem toàn bộ danh sách người dùng trong hệ thống
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.usersService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      role,
      search,
    });
    return {
      success: true,
      data: result.items,
      pagination: result.pagination,
      message: 'Lấy danh sách người dùng thành công (Admin)',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      role: dto.role,
      passwordHash,
    });
    return {
      success: true,
      data: user,
      message: 'Tạo tài khoản thành công',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    const currentAdminId = Number(currentUser.sub || currentUser.id);
    if (id === currentAdminId && dto.role !== undefined && dto.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Không thể tự hạ quyền vai trò Quản trị viên (ADMIN) của chính mình.',
      );
    }
    if (id === currentAdminId && dto.isActive === false) {
      throw new ForbiddenException(
        'Không thể tự khóa tài khoản Quản trị viên đang đăng nhập.',
      );
    }

    const user = await this.usersService.update(id, {
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      role: dto.role,
      isActive: dto.isActive,
      ...(dto.password
        ? { passwordHash: await bcrypt.hash(dto.password, 10) }
        : {}),
    });
    return {
      success: true,
      data: user,
      message: 'Cập nhật tài khoản thành công',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    const userId = id;
    if (userId === Number(currentUser.sub || currentUser.id)) {
      throw new ForbiddenException('Không thể xóa tài khoản đang đăng nhập.');
    }
    await this.usersService.delete(userId);
    return {
      success: true,
      data: null,
      message: 'Xóa tài khoản thành công',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  async getMyAddresses(@CurrentUser() user: CurrentUserPayload) {
    const userId = Number(user.sub || user.id);
    const addresses = await this.usersService.getAddresses(userId);
    return {
      success: true,
      data: addresses,
      message: 'Lấy danh sách địa chỉ nhận hàng thành công',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  async addAddress(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateAddressDto,
  ) {
    const userId = Number(user.sub || user.id);
    const address = await this.usersService.addAddress(userId, dto);
    return {
      success: true,
      data: address,
      message: 'Thêm địa chỉ giao hàng thành công',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    if (
      currentUser.role !== 'ADMIN' &&
      Number(currentUser.sub || currentUser.id) !== id
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền xem thông tin tài khoản này',
      );
    }
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} không tồn tại`);
    }
    return {
      success: true,
      data: user,
      message: 'Lấy thông tin người dùng thành công',
    };
  }
}
