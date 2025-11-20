import { Branch, Category, MenuItem, AppSettings } from '../types';

// This is a temporary in-memory cache.
// In a real app, you'd use a state management library like Redux or Zustand.
let cachedData: {
  branches: Branch[];
  categories: Category[];
  items: MenuItem[];
  settings: AppSettings;
} | null = null;

const API_URL = '/api';

async function fetchAllData() {
  if (cachedData) {
    return cachedData;
  }
  try {
    const response = await fetch(`${API_URL}/all-data`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    cachedData = data;
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // Return empty structure on failure to prevent app crash
    return { branches: [], categories: [], items: [], settings: {} as AppSettings };
  }
}

export const DataService = {
  getBranches: async () => (await fetchAllData()).branches,
  saveBranches: (data: Branch[]) => {
    console.log("Saving branches (not implemented yet):", data);
    // Here you would make a POST/PUT request to the server
    // For now, we just update the local cache for immediate UI feedback
    if(cachedData) cachedData.branches = data;
  },

  getCategories: async () => (await fetchAllData()).categories,
  saveCategories: (data: Category[]) => {
    console.log("Saving categories (not implemented yet):", data);
    if(cachedData) cachedData.categories = data;
  },

  getItems: async () => (await fetchAllData()).items,
  saveItems: (data: MenuItem[]) => {
    console.log("Saving items (not implemented yet):", data);
    if(cachedData) cachedData.items = data;
  },

  getSettings: async () => (await fetchAllData()).settings,
  saveSettings: (data: AppSettings) => {
    console.log("Saving settings (not implemented yet):", data);
    if(cachedData) cachedData.settings = data;
  },
};
