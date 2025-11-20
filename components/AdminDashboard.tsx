import React, { useState, useEffect } from 'react';
import { Branch, Category, MenuItem, AppSettings, MenuItemVariant } from '../types';
import { DataService } from '../services/dataService';
import { 
  LayoutDashboard, Store, UtensilsCrossed, List, Settings, Plus, Edit2, Trash2, LogOut, Eye, EyeOff, GripVertical, AlertCircle, X
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminTab = 'items' | 'categories' | 'branches' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('items');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [itemVariants, setItemVariants] = useState<MenuItemVariant[]>([{ name: 'Standard', price: 0 }]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await DataService.refreshData();
      setBranches(data.branches);
      setCategories(data.categories.sort((a, b) => a.sortOrder - b.sortOrder));
      setItems(data.items.sort((a, b) => a.sortOrder - b.sortOrder));
      setSettings(data.settings);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const branchData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
    };
    try {
      if (editItem) { await DataService.updateBranch(editItem.id, branchData); } 
      else { await DataService.addBranch(branchData); }
      await refreshData();
    } catch (error) { alert("Filialni saqlashda xatolik."); } 
    finally { setIsModalOpen(false); setEditItem(null); }
  };

  const handleDeleteBranch = async (id: string) => {
    if (window.confirm("Haqiqatan ham bu filialni o'chirmoqchimisiz?")) {
      try { await DataService.deleteBranch(id); await refreshData(); } 
      catch (error) { alert("Filialni o'chirishda xatolik."); }
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    try {
      if (editItem) { await DataService.updateCategory(editItem.id, { name }); } 
      else { await DataService.addCategory({ name }); }
      await refreshData();
    } catch (error) { alert("Kategoriyani saqlashda xatolik."); } 
    finally { setIsModalOpen(false); setEditItem(null); }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Haqiqatan ham bu kategoriyani o'chirmoqchimisiz?")) {
      try { await DataService.deleteCategory(id); await refreshData(); } 
      catch (error) { alert("Kategoriyani o'chirishda xatolik."); }
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const branchIds = branches.map(b => (form.elements.namedItem(`branch_${b.id}`) as HTMLInputElement)?.checked ? b.id : null).filter(Boolean) as string[];

    const itemData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      categoryId: formData.get('categoryId') as string,
      branchIds: branchIds,
      variants: itemVariants.filter(v => v.name && v.price > 0),
    };

    if (itemData.variants.length === 0) {
        alert("Iltimos, kamida bitta to'g'ri variant (nomi va narxi) kiriting.");
        return;
    }

    try {
      if (editItem) { await DataService.updateMenuItem(editItem.id, itemData); } 
      else { await DataService.addMenuItem(itemData); }
      await refreshData();
    } catch (error) { alert("Taomni saqlashda xatolik."); } 
    finally { setIsModalOpen(false); setEditItem(null); }
  };

  const handleToggleItemStatus = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    try { await DataService.updateMenuItemStatus(id, !item.isActive); await refreshData(); } 
    catch (error) { alert("Statusni o'zgartirishda xatolik."); }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Haqiqatan ham bu taomni o'chirmoqchimisiz?")) {
      try { await DataService.deleteMenuItem(id); await refreshData(); } 
      catch (error) { alert("Taomni o'chirishda xatolik."); }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newSettings: AppSettings = {
      ...settings,
      brandName: formData.get('brandName') as string,
      primaryColor: formData.get('primaryColor') as string,
      headingColor: formData.get('headingColor') as string,
      bodyTextColor: formData.get('bodyTextColor') as string,
      logoUrl: formData.get('logoUrl') as string,
    };
    try { await DataService.saveSettings(newSettings); setSettings(newSettings); alert("Sozlamalar saqlandi!"); } 
    catch (error) { alert("Sozlamalarni saqlashda xatolik."); }
  };

  const openModal = (tab: AdminTab, item: any = null) => {
    setActiveTab(tab);
    setEditItem(item);
    if (tab === 'items' && item && item.variants && item.variants.length > 0) {
      setItemVariants(item.variants);
    } else if (tab === 'items') {
      setItemVariants([{ name: 'Standard', price: 0 }]);
    }
    setIsModalOpen(true);
  };

  const handleVariantChange = (index: number, field: 'name' | 'price', value: string) => {
    const newVariants = [...itemVariants];
    newVariants[index] = { ...newVariants[index], [field]: field === 'price' ? Number(value) : value };
    setItemVariants(newVariants);
  };

  const addVariant = () => setItemVariants([...itemVariants, { name: '', price: 0 }]);
  const removeVariant = (index: number) => {
    if (itemVariants.length > 1) {
      setItemVariants(itemVariants.filter((_, i) => i !== index));
    }
  };

  const formatVariants = (variants: MenuItemVariant[] | undefined) => {
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return "Narxi yo'q";
    }
    return variants
      .map(v => `${v.name}: ${(v.price || 0).toLocaleString()}`)
      .join('; ');
  };

  if (isLoading || !settings) {
    return <div className="flex h-screen bg-gray-100 items-center justify-center"><div className="text-xl">Admin Panel Yuklanmoqda...</div></div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md z-10 flex flex-col">
        <div className="p-6 border-b"><h2 className="text-xl font-bold flex items-center gap-2"><LayoutDashboard size={24} className="text-blue-600" />Admin Panel</h2></div>
        <nav className="flex-1 p-4 space-y-2">
          {['items', 'categories', 'branches', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as AdminTab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              {tab === 'items' && <UtensilsCrossed size={20} />}
              {tab === 'categories' && <List size={20} />}
              {tab === 'branches' && <Store size={20} />}
              {tab === 'settings' && <Settings size={20} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t"><button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><LogOut size={20} />Chiqish</button></div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'branches' && (
          <div>
            <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Filiallar</h1><button onClick={() => openModal('branches')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={20} /> Qo'shish</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map(branch => (
                <div key={branch.id} className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex justify-between items-start mb-4"><h3 className="text-lg font-semibold">{branch.name}</h3><div className="flex gap-2"><button onClick={() => openModal('branches', branch)} className="p-1 rounded text-blue-500 hover:bg-blue-50"><Edit2 size={18} /></button><button onClick={() => handleDeleteBranch(branch.id)} className="p-1 rounded text-red-500 hover:bg-red-50"><Trash2 size={18} /></button></div></div>
                  <p className="text-gray-500 text-sm mb-2">{branch.address}</p><p className="text-gray-500 text-sm">{branch.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Kategoriyalar</h1><button onClick={() => openModal('categories')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={20} /> Qo'shish</button></div>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-4 font-semibold">Nomi</th><th className="px-6 py-4 font-semibold text-right">Amallar</th></tr></thead>
                <tbody className="divide-y">
                  {categories.map(category => (<tr key={category.id}><td className="px-6 py-4 flex items-center gap-3"><GripVertical size={16} className="text-gray-400 cursor-move" />{category.name}</td><td className="px-6 py-4 text-right space-x-2"><button onClick={() => openModal('categories', category)} className="hover:underline text-blue-600">Tahrirlash</button><button onClick={() => handleDeleteCategory(category.id)} className="hover:underline text-red-600">O'chirish</button></td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'items' && (
          <div>
            <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Taomlar</h1><div className="flex items-center gap-4">{categories.length === 0 && (<div className="flex items-center gap-2 text-yellow-600"><AlertCircle size={20} /><span>Avval kategoriya yarating!</span></div>)}<button onClick={() => openModal('items')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400" disabled={categories.length === 0}><Plus size={20} /> Qo'shish</button></div></div>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-4 font-semibold">Rasm</th><th className="px-6 py-4 font-semibold">Nom & Kategoriya</th><th className="px-6 py-4 font-semibold">Narxlar</th><th className="px-6 py-4 font-semibold text-center">Status</th><th className="px-6 py-4 font-semibold text-right">Amallar</th></tr></thead>
                <tbody className="divide-y">
                  {items.map(item => (<tr key={item.id} className={!item.isActive ? 'bg-gray-50 opacity-60' : ''}>
                    <td className="px-6 py-4"><img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-200" /></td>
                    <td className="px-6 py-4"><p className="font-medium">{item.name}</p><span className="text-xs px-2 py-1 bg-gray-100 rounded">{categories.find(c => c.id === item.categoryId)?.name || 'Noma\'lum'}</span></td>
                    <td className="px-6 py-4 text-sm">{formatVariants(item.variants)}</td>
                    <td className="px-6 py-4 text-center"><button onClick={() => handleToggleItemStatus(item.id)} className="text-gray-500 hover:text-blue-600">{item.isActive ? <Eye size={20} /> : <EyeOff size={20} />}</button></td>
                    <td className="px-6 py-4 text-right space-x-2"><button onClick={() => openModal('items', item)} className="hover:underline text-blue-600">Tahrirlash</button><button onClick={() => handleDeleteItem(item.id)} className="hover:underline text-red-600">O'chirish</button></td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
           <div className="max-w-2xl"><h1 className="text-2xl font-bold mb-6">Sozlamalar</h1><div className="bg-white p-8 rounded-xl shadow-sm border"><form onSubmit={handleSaveSettings} className="space-y-6">
            <div><label className="block text-sm font-medium mb-1">Brend Nomi</label><input name="brandName" defaultValue={settings.brandName} className="w-full p-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-1">Logo URL</label><input name="logoUrl" defaultValue={settings.logoUrl} className="w-full p-2 border rounded-lg" required /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-1">Asosiy Rang</label><input type="color" name="primaryColor" defaultValue={settings.primaryColor} className="h-10 w-full" /></div>
              <div><label className="block text-sm font-medium mb-1">Sarlavha Rangi</label><input type="color" name="headingColor" defaultValue={settings.headingColor} className="h-10 w-full" /></div>
              <div><label className="block text-sm font-medium mb-1">Matn Rangi</label><input type="color" name="bodyTextColor" defaultValue={settings.bodyTextColor} className="h-10 w-full" /></div>
            </div>
            <div className="pt-4"><button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Saqlash</button></div>
           </form></div></div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <h2 className="text-xl font-bold mb-6">{editItem ? `Tahrirlash` : `Yangi qo'shish`}</h2>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">✕</button>
            <form onSubmit={activeTab === 'branches' ? handleSaveBranch : activeTab === 'categories' ? handleSaveCategory : handleSaveItem}>
              {activeTab === 'branches' && (<div className="space-y-4"><input name="name" defaultValue={editItem?.name} placeholder="Filial nomi" className="w-full p-2 border rounded" required /><input name="address" defaultValue={editItem?.address} placeholder="Manzil" className="w-full p-2 border rounded" required /><input name="phone" defaultValue={editItem?.phone} placeholder="Telefon" className="w-full p-2 border rounded" required /></div>)}
              {activeTab === 'categories' && (<div className="space-y-4"><input name="name" defaultValue={editItem?.name} placeholder="Kategoriya nomi" className="w-full p-2 border rounded" required /></div>)}
              {activeTab === 'items' && (
                <div className="space-y-6">
                  <input name="name" defaultValue={editItem?.name} placeholder="Taom nomi" className="w-full p-3 border rounded-lg" required />
                  <textarea name="description" defaultValue={editItem?.description} placeholder="Tavsif" className="w-full p-3 border rounded-lg h-24"></textarea>
                  <div><input name="imageUrl" defaultValue={editItem?.imageUrl} placeholder="Rasm URL" className="w-full p-3 border rounded-lg" required /><p className="text-xs text-gray-500 mt-1">Tavsiya: <strong>16:9</strong> nisbatdagi rasm.</p></div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Variantlar</label>
                    <div className="space-y-3">
                      {itemVariants.map((variant, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} placeholder="Nomi (masalan, Katta)" className="w-full p-2 border rounded-lg" />
                          <input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} placeholder="Narxi" className="w-1/2 p-2 border rounded-lg" />
                          <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={addVariant} className="mt-3 text-sm text-blue-600 hover:underline">Yana variant qo'shish</button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium mb-2">Kategoriya</label><select name="categoryId" defaultValue={editItem?.categoryId} className="w-full p-3 border rounded-lg" required><option value="">Tanlang...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium mb-2">Filiallar</label><div className="p-3 border rounded-lg max-h-32 overflow-y-auto space-y-1">{branches.map(b => (<label key={b.id} className="flex items-center gap-2"><input type="checkbox" name={`branch_${b.id}`} defaultChecked={editItem ? editItem.branchIds.includes(b.id) : true} />{b.name}</label>))}</div></div>
                  </div>
                </div>
              )}
              <div className="mt-8 flex justify-end gap-3"><button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Bekor qilish</button><button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Saqlash</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
