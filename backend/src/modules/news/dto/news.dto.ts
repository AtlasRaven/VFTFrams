import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export type NewsCategoryType = 'TIN_TRANG_TRAI' | 'KIEN_THUC' | 'THONG_BAO';

export class CreateNewsDto {
  @IsString({ message: 'Tiêu đề bài viết phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề bài viết không được để trống' })
  @MinLength(3, { message: 'Tiêu đề bài viết phải có ít nhất 3 ký tự' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Slug bài viết phải là chuỗi ký tự' })
  @MaxLength(280, { message: 'Slug không được vượt quá 280 ký tự' })
  slug?: string;

  @IsString({ message: 'Đoạn tóm tắt phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Đoạn tóm tắt không được để trống' })
  @MinLength(5, { message: 'Đoạn tóm tắt phải có ít nhất 5 ký tự' })
  summary: string;

  @IsString({ message: 'Nội dung bài viết phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nội dung bài viết không được để trống' })
  @MinLength(10, { message: 'Nội dung bài viết phải có ít nhất 10 ký tự' })
  content: string;

  @IsString({ message: 'Đường dẫn ảnh thumbnail phải là chuỗi' })
  @IsNotEmpty({ message: 'Đường dẫn ảnh thumbnail không được để trống' })
  thumbnailUrl: string;

  @IsIn(['TIN_TRANG_TRAI', 'KIEN_THUC', 'THONG_BAO'], {
    message: 'Danh mục phải là TIN_TRANG_TRAI, KIEN_THUC hoặc THONG_BAO',
  })
  category: NewsCategoryType;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái xuất bản phải là boolean' })
  isPublished?: boolean;
}

export class UpdateNewsDto {
  @IsOptional()
  @IsString({ message: 'Tiêu đề bài viết phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tiêu đề bài viết phải có ít nhất 3 ký tự' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Slug bài viết phải là chuỗi ký tự' })
  @MaxLength(280, { message: 'Slug không được vượt quá 280 ký tự' })
  slug?: string;

  @IsOptional()
  @IsString({ message: 'Đoạn tóm tắt phải là chuỗi ký tự' })
  @MinLength(5, { message: 'Đoạn tóm tắt phải có ít nhất 5 ký tự' })
  summary?: string;

  @IsOptional()
  @IsString({ message: 'Nội dung bài viết phải là chuỗi ký tự' })
  @MinLength(10, { message: 'Nội dung bài viết phải có ít nhất 10 ký tự' })
  content?: string;

  @IsOptional()
  @IsString({ message: 'Đường dẫn ảnh thumbnail phải là chuỗi' })
  thumbnailUrl?: string;

  @IsOptional()
  @IsIn(['TIN_TRANG_TRAI', 'KIEN_THUC', 'THONG_BAO'], {
    message: 'Danh mục phải là TIN_TRANG_TRAI, KIEN_THUC hoặc THONG_BAO',
  })
  category?: NewsCategoryType;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái xuất bản phải là boolean' })
  isPublished?: boolean;
}

export class QueryNewsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Trang phải là số nguyên' })
  @Min(1, { message: 'Trang phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Giới hạn phải là số nguyên' })
  @Min(1, { message: 'Giới hạn phải lớn hơn hoặc bằng 1' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
