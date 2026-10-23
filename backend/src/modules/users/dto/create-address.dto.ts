export class CreateAddressDto {
  recipientName!: string;
  phoneNumber!: string;
  province!: string;
  district!: string;
  ward!: string;
  streetAddress!: string;
  isDefault?: boolean;
}
