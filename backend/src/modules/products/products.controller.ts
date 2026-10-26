import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ProductsService } from './products.service.js';
import { JwtAuthGuard } from '../../common/guards/auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

export class CreateProductDto {
  @IsInt()
  @Min(1)
  categoryId!: number;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(1)
  slug!: string;

  @IsString()
  @MinLength(1)
  imageUrl!: string;

  @IsString()
  @MinLength(1)
  unit!: string;

  @IsString()
  @MinLength(1)
  specification!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsNumber()
  @Min(0)
  stockQuantity!: number;

  @IsOptional()
  @IsIn(['VietGAP', 'VfSC', 'Organic', 'HACCP'])
  certification?: 'VietGAP' | 'VfSC' | 'Organic' | 'HACCP';

  @IsString()
  origin!: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @IsString()
  description!: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  unit?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  specification?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsIn(['VietGAP', 'VfSC', 'Organic', 'HACCP'])
  certification?: 'VietGAP' | 'VfSC' | 'Organic' | 'HACCP';

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll(
    @Query('category_id') categoryId?: string,
    @Query('categoryId') categoryIdAlt?: string,
    @Query('search') search?: string,
    @Query('is_featured') isFeatured?: string,
    @Query('isFeatured') isFeaturedAlt?: string,
    @Query('is_best_seller') isBestSeller?: string,
    @Query('isBestSeller') isBestSellerAlt?: string,
    @Query('certification') certification?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const catId = categoryId
      ? Number(categoryId)
      : categoryIdAlt
        ? Number(categoryIdAlt)
        : undefined;
    const featuredFlag =
      isFeatured !== undefined
        ? isFeatured === 'true'
        : isFeaturedAlt !== undefined
          ? isFeaturedAlt === 'true'
          : undefined;
    const bestSellerFlag =
      isBestSeller !== undefined
        ? isBestSeller === 'true'
        : isBestSellerAlt !== undefined
          ? isBestSellerAlt === 'true'
          : undefined;

    const data = await this.productsService.findAll({
      categoryId: catId,
      search,
      isFeatured: featuredFlag,
      isBestSeller: bestSellerFlag,
      certification,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return {
      success: true,
      data: data.items,
      pagination: data.pagination,
      message: 'Lấy danh sách nông sản thành công',
    };
  }

  @Get('featured')
  async getFeatured() {
    return {
      success: true,
      data: await this.productsService.findFeatured(),
      message: 'Lấy danh sách nông sản bán chạy thành công',
    };
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const product = isNaN(Number(slug))
      ? await this.productsService.findBySlug(slug)
      : await this.productsService.findById(Number(slug));

    if (!product) {
      throw new NotFoundException(
        `Sản phẩm '${slug}' không tồn tại hoặc đã hết hàng`,
      );
    }

    return {
      success: true,
      data: product,
      message: 'Lấy chi tiết nông sản thành công',
    };
  }

  @Get(':id/traceability')
  async getTraceability(@Param('id', ParseIntPipe) id: number) {
    const trace = await this.productsService.getTraceability(id);
    return {
      success: true,
      data: trace,
      message: 'Tra cứu mã xác thực nguồn gốc SHA-256 thành công',
    };
  }

  // RBAC: Chỉ ADMIN và STAFF mới được thêm sản phẩm mới
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createProduct(@Body() dto: CreateProductDto) {
    const productInput = Object.assign({}, dto, {
      isFeatured: dto.isFeatured ?? false,
      isBestSeller: dto.isBestSeller ?? false,
    });
    const newProduct = await this.productsService.create(productInput);
    return {
      success: true,
      data: newProduct,
      message: 'Thêm nông sản mới thành công (Admin/Staff)',
    };
  }

  // RBAC: Chỉ ADMIN và STAFF mới được cập nhật sản phẩm & số lượng tồn kho
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    const updated = await this.productsService.update(id, dto);
    return {
      success: true,
      data: updated,
      message: 'Cập nhật nông sản thành công (Admin/Staff)',
    };
  }

  // RBAC: Chỉ ADMIN cấp cao mới được xóa sản phẩm
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.delete(id);
    return {
      success: true,
      data: { id },
      message: 'Đã xóa sản phẩm thành công (Admin)',
    };
  }
}
