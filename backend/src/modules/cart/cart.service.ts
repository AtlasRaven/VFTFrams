import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService, ProductItem } from '../products/products.service.js';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto.js';

export interface CartItemModel {
  product: ProductItem;
  quantity: number;
  totalPrice: number;
}

@Injectable()
export class CartService {
  // The client-provided cart ID is an opaque cart capability.
  private carts = new Map<string, CartItemModel[]>();

  constructor(private readonly productsService: ProductsService) {}

  async getCart(cartId: string) {
    const items = this.carts.get(cartId) || [];
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      totalItems,
      subtotal,
    };
  }

  async addItem(cartId: string, dto: AddCartItemDto) {
    if (
      !Number.isSafeInteger(dto.productId) ||
      !Number.isFinite(dto.quantity) ||
      dto.quantity <= 0
    ) {
      throw new BadRequestException(
        'Sản phẩm hoặc số lượng đặt hàng không hợp lệ',
      );
    }

    const product = await this.productsService.findById(dto.productId);
    if (!product) {
      throw new NotFoundException(`Sản phẩm #${dto.productId} không tồn tại`);
    }

    const items = this.carts.get(cartId) || [];
    const existingIndex = items.findIndex(
      (i) => i.product.id === dto.productId,
    );
    const existingQuantity =
      existingIndex > -1 ? items[existingIndex].quantity : 0;
    if (product.stockQuantity < existingQuantity + dto.quantity) {
      throw new BadRequestException(
        `Số lượng yêu cầu (${existingQuantity + dto.quantity}) vượt quá tồn kho hiện tại (${product.stockQuantity})`,
      );
    }

    const unitPrice = product.salePrice ?? product.price;

    if (existingIndex > -1) {
      items[existingIndex].quantity += dto.quantity;
      items[existingIndex].totalPrice =
        items[existingIndex].quantity * unitPrice;
    } else {
      items.push({
        product,
        quantity: dto.quantity,
        totalPrice: dto.quantity * unitPrice,
      });
    }

    this.carts.set(cartId, items);
    return this.getCart(cartId);
  }

  async updateQuantity(
    cartId: string,
    productId: number,
    dto: UpdateCartItemDto,
  ) {
    if (!Number.isFinite(dto.quantity)) {
      throw new BadRequestException('Số lượng đặt hàng không hợp lệ');
    }
    if (dto.quantity <= 0) {
      return this.removeItem(cartId, productId);
    }

    const product = await this.productsService.findById(productId);
    if (!product) {
      throw new NotFoundException(`Sản phẩm #${productId} không tồn tại`);
    }

    if (product.stockQuantity < dto.quantity) {
      throw new BadRequestException(
        `Số lượng yêu cầu (${dto.quantity}) vượt quá tồn kho hiện tại (${product.stockQuantity})`,
      );
    }

    const items = this.carts.get(cartId) || [];
    const index = items.findIndex((i) => i.product.id === productId);
    if (index === -1) {
      throw new NotFoundException(
        `Sản phẩm #${productId} không có trong giỏ hàng`,
      );
    }

    const unitPrice = product.salePrice ?? product.price;
    items[index].quantity = dto.quantity;
    items[index].totalPrice = dto.quantity * unitPrice;

    this.carts.set(cartId, items);
    return this.getCart(cartId);
  }

  async removeItem(cartId: string, productId: number) {
    const items = this.carts.get(cartId) || [];
    const filtered = items.filter((i) => i.product.id !== productId);
    this.carts.set(cartId, filtered);
    return this.getCart(cartId);
  }

  async clearCart(cartId: string) {
    this.carts.set(cartId, []);
    return this.getCart(cartId);
  }
}
