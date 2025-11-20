import React, { useState, useEffect } from 'react';
import { Branch, Category, MenuItem, AppSettings } from '../types';
import { DataService } from '../services/dataService';
import { 
  LayoutDashboard, 
  Store, 
  UtensilsCrossed, 
  List, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminTab = 'branches' | 'categories' | 'items' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('branches');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    const [fetchedBranches, fetchedCategories, fetchedItems, fetchedSettings] = await Promise.all([
      DataService.getBranches(),
      DataService.getCategories(),
      DataService.getItems(),
      DataService.getSettings(),
    ]);
    setBranches(fetchedBranches);
    setCategories(fetchedCategories);
    setItems(fetchedItems);
    setSettings(fetchedSettings);
    setIsLoading(false);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    // ... (Save logic to be implemented with API)
    alert("Saqlash hozircha ishlamaydi.");
  };

  const handleDeleteBranch = (id: string) => {
    // ... (Delete logic to be implemented with API)
    alert("O'chirish hozircha ishlamaydi.");
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    // ... (Save logic to be implemented with API)
    alert("Saqlash hozircha ishlamaydi.");
  };

  const handleDeleteCategory = (id: string) => {
    // ... (Delete logic to be implemented with API)
    alert("O'chirish hozircha ishlamaydi.");
  };

  const handleSaveItem = (e: React.FormEvent) => {
    // ... (Save logic to be implemented with API)
    alert("Saqlash hozircha ishlamaydi.");
  };

  const handleToggleItemStatus = (id: string) => {
    // ... (Toggle logic to be implemented with API)
    alert("Status o'zgartirish hozircha ishlamaydi.");
  };

  const handleDeleteItem = (id: string) => {
    // ... (Delete logic to be implemented with API)
    alert("O'chirish hozircha ishlamaydi.");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    // ... (Save logic to be implemented with API)
    alert("Saqlash hozircha ishlamaydi.");
  };

  const openModal = (item: any = null) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  if (isLoading || !settings) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-xl">Admin Panel Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md z-10 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard size={24} className="text-blue-600" />
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('branches')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'branches' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Store size={20} />
            Filiallar
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <List size={20} />
            Kategoriyalar
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'items' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <UtensilsCrossed size={20} />
            Taomlar
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings size={20} />
            Sozlamalar
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* Branches View */}
        {activeTab === 'branches' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Filiallar Ro'yxati</h1>
              <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus size={20} /> Qo'shish
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map(branch => (
                <div key={branch.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{branch.name}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(branch)} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteBranch(branch.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{branch.address}</p>
                  <p className="text-gray-500 text-sm">{branch.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories View */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Kategoriyalar</h1>
              <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus size={20} /> Qo'shish
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600">Nomi</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <GripVertical size={16} className="text-gray-400 cursor-move" />
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => openModal(category)} className="text-blue-600 hover:underline">Tahrirlash</button>
                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:underline">O'chirish</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Items View */}
        {activeTab === 'items' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Taomlar</h1>
              <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus size={20} /> Qo'shish
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600">Rasm</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Nom & Kategoriya</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Narx</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map(item => {
                    const categoryName = categories.find(c => c.id === item.categoryId)?.name || 'Unknown';
                    return (
                      <tr key={item.id} className={!item.isActive ? 'bg-gray-50 opacity-60' : ''}>
                        <td className="px-6 py-4">
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{categoryName}</span>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {item.price.toLocaleString()} so'm
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleToggleItemStatus(item.id)} className="text-gray-500 hover:text-blue-600">
                            {item.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => openModal(item)} className="text-blue-600 hover:underline">Tahrirlash</button>
                          <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:underline">O'chirish</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
           <div className="max-w-2xl">
             <h1 className="text-2xl font-bold text-gray-800 mb-6">Tizim Sozlamalari</h1>
             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brend Nomi</label>
                    <input name="brandName" defaultValue={settings.brandName} className="w-full p-2 border border-gray-300 rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input name="logoUrl" defaultValue={settings.logoUrl} className="w-full p-2 border border-gray-300 rounded-lg" required />
                    <p className="text-xs text-gray-500 mt-1">Mijoz ekranida ko'rsatiladigan rasm havolasi.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asosiy Rang (Primary Color)</label>
                    <div className="flex gap-4 items-center">
                      <input type="color" name="primaryColor" defaultValue={settings.primaryColor} className="h-10 w-20" />
                      <span className="text-gray-600 text-sm">Brending uchun ishlatiladi.</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha Rangi</label>
                    <div className="flex gap-4 items-center">
                      <input type="color" name="headingColor" defaultValue={settings.headingColor} className="h-10 w-20" />
                      <span className="text-gray-600 text-sm">Taom nomlari, sarlavhalar uchun.</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Matn Rangi</label>
                    <div className="flex gap-4 items-center">
                      <input type="color" name="bodyTextColor" defaultValue={settings.bodyTextColor} className="h-10 w-20" />
                      <span className="text-gray-600 text-sm">Taom tavsifi va boshqa matnlar uchun.</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Saqlash</button>
                  </div>
                </form>
             </div>
           </div>
        )}
      </main>

      {/* Modal for Forms */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
            <h2 className="text-xl font-bold mb-4">
              {editItem ? 'Tahrirlash' : "Qo'shish"}
            </h2>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">✕</button>
            
            <form onSubmit={activeTab === 'branches' ? handleSaveBranch : activeTab === 'categories' ? handleSaveCategory : handleSaveItem}>
              
              {activeTab === 'branches' && (
                <div className="space-y-4">
                  <input name="name" defaultValue={editItem?.name} placeholder="Filial nomi" className="w-full p-2 border rounded" required />
                  <input name="address" defaultValue={editItem?.address} placeholder="Manzil" className="w-full p-2 border rounded" required />
                  <input name="phone" defaultValue={editItem?.phone} placeholder="Telefon" className="w-full p-2 border rounded" required />
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="space-y-4">
                  <input name="name" defaultValue={editItem?.name} placeholder="Kategoriya nomi" className="w-full p-2 border rounded" required />
                </div>
              )}

              {activeTab === 'items' && (
                <div className="space-y-4">
                  <input name="name" defaultValue={editItem?.name} placeholder="Taom nomi" className="w-full p-2 border rounded" required />
                  <textarea name="description" defaultValue={editItem?.description} placeholder="Tavsif" className="w-full p-2 border rounded h-24"></textarea>
                  <div className="flex gap-4">
                    <input type="number" name="price" defaultValue={editItem?.price} placeholder="Narx" className="w-full p-2 border rounded" required />
                    <select name="categoryId" defaultValue={editItem?.categoryId} className="w-full p-2 border rounded" required>
                      <option value="">Kategoriyani tanlang</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <input name="imageUrl" defaultValue={editItem?.imageUrl} placeholder="Rasm URL" className="w-full p-2 border rounded" required />
                    <p className="text-xs text-gray-500 mt-1">
                      Tavsiya etilgan rasm nisbati: <strong>16:9</strong> (masalan, 1280x720px).
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mavjud filiallar:</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded border">
                      {branches.map(b => (
                        <label key={b.id} className="flex items-center gap-2 text-sm">
                          <input 
                            type="checkbox" 
                            name={`branch_${b.id}`} 
                            defaultChecked={editItem ? editItem.branchIds.includes(b.id) : true} 
                          />
                          {b.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Bekor qilish</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
