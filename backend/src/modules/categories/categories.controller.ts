import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
import { JwtAuthGuard } from '../../common/guards/auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll() {
    return {
      success: true,
      data: await this.categoriesService.findAll(),
      message: 'Lấy danh sách danh mục thành công',
    };
  }

  @Get('tree')
  async getTree() {
    return {
      success: true,
      data: await this.categoriesService.findTree(),
      message: 'Lấy cây danh mục đa cấp thành công',
    };
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const category = await this.categoriesService.findBySlug(slug);
    if (!category) {
      throw new NotFoundException(`Danh mục '${slug}' không tồn tại`);
    }
    return {
      success: true,
      data: category,
      message: 'Lấy chi tiết danh mục thành công',
    };
  }

  // RBAC: Chỉ ADMIN và STAFF mới được tạo danh mục nông sản
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    return {
      success: true,
      data: category,
      message: 'Tạo danh mục mới thành công (Admin/Staff)',
    };
  }

  // RBAC: Chỉ ADMIN và STAFF mới được sửa danh mục
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    const updated = await this.categoriesService.update(id, dto);
    return {
      success: true,
      data: updated,
      message: 'Cập nhật danh mục thành công (Admin/Staff)',
    };
  }

  // RBAC: Chỉ ADMIN mới được xóa danh mục
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.delete(id);
    return {
      success: true,
      data: { id },
      message: 'Đã xóa danh mục thành công (Admin)',
    };
  }
}
