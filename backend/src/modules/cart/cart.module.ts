import { Module } from '@nestjs/common';
import { CartController } from './cart.controller.js';
import { CartService } from './cart.service.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [ProductsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
