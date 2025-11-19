import { Branch, Category, MenuItem, AppSettings } from '../types';

const STORAGE_KEYS = {
  BRANCHES: 'menu_app_branches',
  CATEGORIES: 'menu_app_categories',
  ITEMS: 'menu_app_items',
  SETTINGS: 'menu_app_settings',
};

// Initial Mock Data
const initialBranches: Branch[] = [
  { id: '1', name: 'Markaziy Filial', address: 'Amir Temur ko\'chasi, 15', phone: '+998 90 123 45 67', isActive: true },
  { id: '2', name: 'Chilonzor Filiali', address: 'Bunyodkor shoh ko\'chasi, 5', phone: '+998 90 987 65 43', isActive: true },
];

const initialCategories: Category[] = [
  { id: '1', name: 'Pitsalar', sortOrder: 1 },
  { id: '2', name: 'Lavashlar', sortOrder: 2 },
  { id: '3', name: 'Ichimliklar', sortOrder: 3 },
  { id: '4', name: 'Shirinliklar', sortOrder: 4 },
];

const initialItems: MenuItem[] = [
  {
    id: '101',
    name: 'Pepperoni Pitsa',
    description: 'Mol go\'shti, motsarella pishlog\'i, maxsus sous, pepperoni.',
    price: 85000,
    imageUrl: 'https://picsum.photos/400/300?random=1',
    categoryId: '1',
    branchIds: ['1', '2'],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '102',
    name: 'Margarita Pitsa',
    description: 'Pomidor, motsarella pishlog\'i, oregano.',
    price: 70000,
    imageUrl: 'https://picsum.photos/400/300?random=2',
    categoryId: '1',
    branchIds: ['1', '2'],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: '201',
    name: 'Tovuqli Lavash',
    description: 'Tovuq go\'shti, bodring, pomidor, chips, sous.',
    price: 35000,
    imageUrl: 'https://picsum.photos/400/300?random=3',
    categoryId: '2',
    branchIds: ['1', '2'],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '301',
    name: 'Coca Cola 0.5L',
    description: 'Yaxna ichimlik.',
    price: 12000,
    imageUrl: 'https://picsum.photos/400/300?random=4',
    categoryId: '3',
    branchIds: ['1', '2'],
    isActive: true,
    sortOrder: 1,
  },
];

const initialSettings: AppSettings = {
  brandName: 'Lazzat Food',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
  primaryColor: '#e11d48', // Rose-600
  adminPassword: 'admin',
};

// Helpers
const get = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const set = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const DataService = {
  getBranches: () => get<Branch[]>(STORAGE_KEYS.BRANCHES, initialBranches),
  saveBranches: (data: Branch[]) => set(STORAGE_KEYS.BRANCHES, data),

  getCategories: () => get<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories),
  saveCategories: (data: Category[]) => set(STORAGE_KEYS.CATEGORIES, data),

  getItems: () => get<MenuItem[]>(STORAGE_KEYS.ITEMS, initialItems),
  saveItems: (data: MenuItem[]) => set(STORAGE_KEYS.ITEMS, data),

  getSettings: () => get<AppSettings>(STORAGE_KEYS.SETTINGS, initialSettings),
  saveSettings: (data: AppSettings) => set(STORAGE_KEYS.SETTINGS, data),
};
