import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NewsService } from './news.service.js';
import { CreateNewsDto, QueryNewsDto, UpdateNewsDto } from './dto/news.dto.js';
import { JwtAuthGuard } from '../../common/guards/auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator.js';

@Controller('api/v1/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // 1. PUBLIC: Danh sách bài viết đã xuất bản
  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getAll(@Query() query: QueryNewsDto) {
    const result = await this.newsService.findAll(query);
    return {
      success: true,
      data: result,
      message: 'Lấy danh sách tin tức thành công',
    };
  }

  // 2. ADMIN/STAFF: Danh sách bài viết toàn hệ thống (bao gồm nháp)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Get('admin/all')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getAllForAdmin(@Query() query: QueryNewsDto) {
    const result = await this.newsService.findAllForAdmin(query);
    return {
      success: true,
      data: result,
      message: 'Lấy danh sách quản trị tin tức thành công',
    };
  }

  // 3. ADMIN/STAFF: Lấy bài viết theo ID phục vụ Form chỉnh sửa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Get('id/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const article = await this.newsService.findById(id);
    return {
      success: true,
      data: article,
      message: 'Lấy thông tin bài viết thành công',
    };
  }

  // 4. PUBLIC: Chi tiết bài viết theo Slug (Tự động tăng views)
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const article = await this.newsService.findBySlug(slug);
    return {
      success: true,
      data: article,
      message: 'Lấy chi tiết tin tức thành công',
    };
  }

  // 5. ADMIN/STAFF: Tạo bài viết mới
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  @Post()
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateNewsDto,
  ) {
    const authorId = user?.id ? Number(user.id) : undefined;
    const article = await this.newsService.create(dto, authorId);
    return {
      success: true,
      data: article,
      message: 'Tạo bài viết tin tức thành công',
    };
  }

  // 6. ADMIN/STAFF: Chỉnh sửa bài viết
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNewsDto,
  ) {
    const article = await this.newsService.update(id, dto);
    return {
      success: true,
      data: article,
      message: 'Cập nhật bài viết thành công',
    };
  }

  // 7. ADMIN: Xóa bài viết
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.newsService.delete(id);
    return {
      success: true,
      message: 'Xóa bài viết thành công',
    };
  }
}
