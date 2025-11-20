import { Branch, Category, MenuItem, AppSettings } from '../types';

const API_URL = '/api';

const defaultSettings: AppSettings = {
  brandName: 'Menyu',
  logoUrl: '',
  primaryColor: '#000000',
  headingColor: '#1f2937',
  bodyTextColor: '#4b5563',
};

const apiRequest = async (url: string, method: string, body?: any) => {
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${method} ${url}`, error);
    throw error;
  }
};

export const DataService = {
  // General
  refreshData: async () => {
    try {
      const response = await fetch(`${API_URL}/all-data`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // Ensure settings are never null
      if (!data.settings) {
        data.settings = defaultSettings;
      }
      return data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return { branches: [], categories: [], items: [], settings: defaultSettings };
    }
  },

  // Branches
  addBranch: async (branch: { name: string; address: string; phone: string }) => {
    const newBranch = { id: Date.now().toString(), ...branch };
    return apiRequest(`${API_URL}/branches`, 'POST', newBranch);
  },
  updateBranch: async (id: string, branch: { name: string; address: string; phone: string }) => {
    return apiRequest(`${API_URL}/branches/${id}`, 'PUT', branch);
  },
  deleteBranch: async (id: string) => {
    return apiRequest(`${API_URL}/branches/${id}`, 'DELETE');
  },

  // Categories
  addCategory: async (category: { name: string }) => {
    const newCategory = {
      id: Date.now().toString(),
      name: category.name,
      sortOrder: 0, // Server will handle sort order
    };
    return apiRequest(`${API_URL}/categories`, 'POST', newCategory);
  },
  updateCategory: async (id: string, category: { name: string }) => {
    return apiRequest(`${API_URL}/categories/${id}`, 'PUT', category);
  },
  deleteCategory: async (id: string) => {
    return apiRequest(`${API_URL}/categories/${id}`, 'DELETE');
  },

  // Menu Items
  addMenuItem: async (item: Omit<MenuItem, 'id' | 'isActive' | 'sortOrder'>) => {
    const newItem = { 
      id: Date.now().toString(), 
      ...item,
      isActive: true,
      sortOrder: 0, // Server will handle sort order
    };
    return apiRequest(`${API_URL}/menu-items`, 'POST', newItem);
  },
  updateMenuItem: async (id: string, item: Omit<MenuItem, 'id' | 'isActive' | 'sortOrder'>) => {
    return apiRequest(`${API_URL}/menu-items/${id}`, 'PUT', item);
  },
  updateMenuItemStatus: async (id: string, isActive: boolean) => {
    return apiRequest(`${API_URL}/menu-items/${id}/status`, 'PUT', { isActive });
  },
  deleteMenuItem: async (id: string) => {
    return apiRequest(`${API_URL}/menu-items/${id}`, 'DELETE');
  },

  // Settings
  saveSettings: async (data: AppSettings) => {
    return apiRequest(`${API_URL}/settings`, 'PUT', data);
  },
};
