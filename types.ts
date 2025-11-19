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

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  branchIds: string[]; // Item can belong to multiple branches or specific ones
  isActive: boolean;
  sortOrder: number;
}

export interface AppSettings {
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  adminPassword?: string; // In real app, this would be handled securely on backend
}

export type ViewMode = 'client-branch-select' | 'client-menu' | 'admin-login' | 'admin-dashboard';
