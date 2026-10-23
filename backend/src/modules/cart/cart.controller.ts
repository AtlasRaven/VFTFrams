import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import type { IncomingHttpHeaders } from 'node:http';
import { CartService } from './cart.service.js';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto.js';

@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getCartId(headers: IncomingHttpHeaders): string {
    const cartId = headers['x-cart-id'];
    if (typeof cartId !== 'string' || cartId.trim() === '') {
      throw new BadRequestException('A unique X-Cart-ID header is required.');
    }
    return cartId.trim();
  }

  @Get()
  async getCart(@Headers() headers: IncomingHttpHeaders) {
    const cartId = this.getCartId(headers);
    return {
      success: true,
      data: await this.cartService.getCart(cartId),
      message: 'Lấy thông tin giỏ hàng thành công',
    };
  }

  @Post('items')
  async addItem(
    @Headers() headers: IncomingHttpHeaders,
    @Body() dto: AddCartItemDto,
  ) {
    const cartId = this.getCartId(headers);
    return {
      success: true,
      data: await this.cartService.addItem(cartId, dto),
      message: 'Thêm sản phẩm vào giỏ hàng thành công',
    };
  }

  @Put('items/:productId')
  async updateItem(
    @Headers() headers: IncomingHttpHeaders,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const cartId = this.getCartId(headers);
    return {
      success: true,
      data: await this.cartService.updateQuantity(
        cartId,
        Number(productId),
        dto,
      ),
      message: 'Cập nhật số lượng thành công',
    };
  }

  @Delete('items/:productId')
  async removeItem(
    @Headers() headers: IncomingHttpHeaders,
    @Param('productId') productId: string,
  ) {
    const cartId = this.getCartId(headers);
    return {
      success: true,
      data: await this.cartService.removeItem(cartId, Number(productId)),
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
    };
  }

  @Delete()
  async clearCart(@Headers() headers: IncomingHttpHeaders) {
    const cartId = this.getCartId(headers);
    return {
      success: true,
      data: await this.cartService.clearCart(cartId),
      message: 'Đã xóa toàn bộ giỏ hàng',
    };
  }
}
