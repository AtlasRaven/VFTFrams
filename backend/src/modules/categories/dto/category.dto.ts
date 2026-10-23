import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  parentId?: number | null;

  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @MinLength(2, { message: 'Tên danh mục tối thiểu 2 ký tự' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug không được để trống' })
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  parentId?: number | null;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
