import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PoliciesService } from './policies.service.js';

@Controller('api/v1/policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  getAll() {
    return {
      success: true,
      data: this.policiesService.findAll(),
      message: 'Lấy danh sách chính sách VFT Farms thành công',
    };
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    const policy = this.policiesService.findBySlug(slug);
    if (!policy) {
      throw new NotFoundException(`Chính sách '${slug}' không tồn tại`);
    }
    return {
      success: true,
      data: policy,
      message: 'Lấy chi tiết chính sách thành công',
    };
  }
}
