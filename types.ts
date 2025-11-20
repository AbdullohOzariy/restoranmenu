export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface MenuItemVariant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  branchIds: string[];
  isActive: boolean;
  sortOrder: number;
  variants: MenuItemVariant[];
}

export interface AppSettings {
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  headingColor: string;
  bodyTextColor: string;
  adminPassword?: string;
}
