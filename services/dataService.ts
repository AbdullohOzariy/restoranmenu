import { Branch, Category, MenuItem, AppSettings } from '../types';

export interface AppData {
  settings: AppSettings | null;
  branches: Branch[];
  categories: Category[];
  items: MenuItem[];
}

const API_URL = '/api';

const apiRequest = async (url: string, method: string, body?: any) => {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred' }));
    throw new Error(errorData.error || 'API request failed');
  }
  // For DELETE or other methods that might not return a body
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return null;
  }
  return response.json();
};

export const DataService = {
  // General
  getAllData: async (): Promise<AppData> => {
    try {
      const data = await apiRequest(`${API_URL}/all-data`, 'GET');
      // The server now guarantees a settings object, so no default is needed client-side.
      return data;
    } catch (error) {
      console.error("Failed to fetch all data:", error);
      // Propagate error to be handled by the component
      throw error;
    }
  },

  // Branches
  addBranch: (branch: { name: string; address: string; phone: string }) => {
    const newBranch = { id: crypto.randomUUID(), ...branch };
    return apiRequest(`${API_URL}/branches`, 'POST', newBranch);
  },
  updateBranch: (id: string, branch: { name: string; address: string; phone: string }) => {
    return apiRequest(`${API_URL}/branches/${id}`, 'PUT', branch);
  },
  deleteBranch: (id: string) => {
    return apiRequest(`${API_URL}/branches/${id}`, 'DELETE');
  },

  // Categories
  addCategory: (category: { name: string }, sortOrder: number) => {
    const newCategory = { id: crypto.randomUUID(), ...category, sortOrder };
    return apiRequest(`${API_URL}/categories`, 'POST', newCategory);
  },
  updateCategory: (id: string, category: { name: string }) => {
    return apiRequest(`${API_URL}/categories/${id}`, 'PUT', category);
  },
  deleteCategory: (id: string) => {
    return apiRequest(`${API_URL}/categories/${id}`, 'DELETE');
  },

  // Menu Items
  addMenuItem: (item: Omit<MenuItem, 'id' | 'isActive' | 'sortOrder'>, sortOrder: number) => {
    const newItem = { id: crypto.randomUUID(), ...item, isActive: true, sortOrder };
    return apiRequest(`${API_URL}/menu-items`, 'POST', newItem);
  },
  updateMenuItem: (id: string, item: Omit<MenuItem, 'id' | 'isActive' | 'sortOrder'>) => {
    return apiRequest(`${API_URL}/menu-items/${id}`, 'PUT', item);
  },
  updateMenuItemStatus: (id: string, isActive: boolean) => {
    return apiRequest(`${API_URL}/menu-items/${id}/status`, 'PUT', { isActive });
  },
  deleteMenuItem: (id: string) => {
    return apiRequest(`${API_URL}/menu-items/${id}`, 'DELETE');
  },

  // Settings
  saveSettings: (data: AppSettings) => {
    return apiRequest(`${API_URL}/settings`, 'PUT', data);
  },
};
