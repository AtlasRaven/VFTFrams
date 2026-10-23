export class AddCartItemDto {
  productId!: number;
  quantity!: number;
  selectedUnit?: string;
}

export class UpdateCartItemDto {
  quantity!: number;
}
