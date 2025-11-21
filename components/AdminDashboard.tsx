import React, { useState, useMemo, useEffect } from 'react';
import { Branch, Category, MenuItem, AppSettings, MenuItemVariant } from '../types';
import { DataService, AppData } from '../services/dataService';
import { 
  LayoutDashboard, Store, UtensilsCrossed, List, Settings, Plus, Edit2, Trash2, LogOut, Eye, EyeOff, GripVertical, AlertCircle, X
} from 'lucide-react';

interface AdminDashboardProps {
  initialData: AppData;
  onDataChange: () => void;
  onLogout: () => void;
}

type AdminTab = 'items' | 'categories' | 'branches' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialData, onDataChange, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('items');
  
  const branches = useMemo(() => [...initialData.branches].sort((a, b) => a.name.localeCompare(b.name)), [initialData.branches]);
  const categories = useMemo(() => [...initialData.categories].sort((a, b) => a.sort_order - b.sort_order), [initialData.categories]);
  const items = useMemo(() => [...initialData.items].sort((a, b) => a.sort_order - b.sort_order), [initialData.items]);
  
  const [settings, setSettings] = useState<AppSettings | null>(initialData.settings);

  // Sync state with props
  useEffect(() => {
    setSettings(initialData.settings);
  }, [initialData.settings]);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<AdminTab | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [itemVariants, setItemVariants] = useState<MenuItemVariant[]>([{ name: 'Standard', price: 0 }]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (message: string, error?: unknown) => {
    console.error(message, error);
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const performAction = async (action: Promise<any>, successMessage: string) => {
    try {
      await action;
      onDataChange();
      setIsModalOpen(false);
      setEditItem(null);
    } catch (error) {
      handleError(successMessage, error);
    }
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const branchData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      address: (form.elements.namedItem('address') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
    };
    const action = editItem
      ? DataService.updateBranch(editItem.id, branchData)
      : DataService.addBranch(branchData);
    performAction(action, "Filialni saqlashda xatolik.");
  };

  const handleDeleteBranch = (id: string) => {
    if (window.confirm("Haqiqatan ham bu filialni o'chirmoqchimisiz?")) {
      performAction(DataService.deleteBranch(id), "Filialni o'chirishda xatolik.");
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = ((e.target as HTMLFormElement).elements.namedItem('name') as HTMLInputElement).value;
    const action = editItem
      ? DataService.updateCategory(editItem.id, { name })
      : DataService.addCategory({ name }, categories.length);
    performAction(action, "Kategoriyani saqlashda xatolik.");
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Haqiqatan ham bu kategoriyani o'chirmoqchimisiz?")) {
      performAction(DataService.deleteCategory(id), "Kategoriyani o'chirishda xatolik.");
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
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

    const action = editItem
      ? DataService.updateMenuItem(editItem.id, itemData)
      : DataService.addMenuItem(itemData, items.length);
    performAction(action, "Taomni saqlashda xatolik.");
  };

  const handleToggleItemStatus = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    performAction(DataService.updateMenuItemStatus(id, !item.isActive), "Statusni o'zgartirishda xatolik.");
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Haqiqatan ham bu taomni o'chirmoqchimisiz?")) {
      performAction(DataService.deleteMenuItem(id), "Taomni o'chirishda xatolik.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return; // Guard against null settings
    const form = e.target as HTMLFormElement;
    const newSettings: AppSettings = {
      ...settings,
      brandName: (form.elements.namedItem('brandName') as HTMLInputElement).value,
      logoUrl: (form.elements.namedItem('logoUrl') as HTMLInputElement).value,
      primaryColor: (form.elements.namedItem('primaryColor') as HTMLInputElement).value,
      headingColor: (form.elements.namedItem('headingColor') as HTMLInputElement).value,
      bodyTextColor: (form.elements.namedItem('bodyTextColor') as HTMLInputElement).value,
      adminPassword: (form.elements.namedItem('adminPassword') as HTMLInputElement).value || settings.adminPassword,
    };
    try {
      await DataService.saveSettings(newSettings);
      setSettings(newSettings);
      onDataChange();
    } catch (error) {
      handleError("Sozlamalarni saqlashda xatolik.", error);
    }
  };

  const openModal = (type: AdminTab, item: any = null) => {
    setModalType(type);
    setEditItem(item);
    if (type === 'items') {
      setItemVariants(item?.variants?.length > 0 ? item.variants : [{ name: 'Standard', price: 0 }]);
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
    setModalType(null);
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

  const formatVariantsForAdmin = (variants: MenuItemVariant[] | undefined) => {
    if (!variants || variants.length === 0) return "Narxi yo'q";
    return variants.map(v => `${v.name}: ${v.price.toLocaleString()}`).join('; ');
  };

  if (!settings) {
    return <div className="flex h-screen bg-gray-100 items-center justify-center"><div className="text-xl">Admin Panel Yuklanmoqda...</div></div>;
  }

  return (
    <>
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="ml-2 hover:bg-red-600 p-1 rounded"><X size={16} /></button>
        </div>
      )}
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md z-10 flex flex-col">
          <div className="p-6 border-b"><h2 className="text-xl font-bold flex items-center gap-2"><LayoutDashboard size={24} className="text-blue-600" />Admin Panel</h2></div>
          <nav className="flex-1 p-4 space-y-2">
            {(['items', 'categories', 'branches', 'settings'] as AdminTab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
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
                      <td className="px-6 py-4 text-sm">{formatVariantsForAdmin(item.variants)}</td>
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
              <div><label className="block text-sm font-medium mb-1">Logo URL</label><input name="logoUrl" defaultValue={settings.logoUrl} className="w-full p-2 border rounded-lg" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Asosiy Rang</label><input type="color" name="primaryColor" defaultValue={settings.primaryColor} className="h-10 w-full" /></div>
                <div><label className="block text-sm font-medium mb-1">Sarlavha Rangi</label><input type="color" name="headingColor" defaultValue={settings.headingColor} className="h-10 w-full" /></div>
                <div><label className="block text-sm font-medium mb-1">Matn Rangi</label><input type="color" name="bodyTextColor" defaultValue={settings.bodyTextColor} className="h-10 w-full" /></div>
              </div>
               <div><label className="block text-sm font-medium mb-1">Admin Paroli</label><input type="password" name="adminPassword" placeholder="Yangi parol (o'zgartirish uchun)" className="w-full p-2 border rounded-lg" /></div>
              <div className="pt-4"><button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Saqlash</button></div>
             </form></div></div>
          )}
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
              <h2 className="text-xl font-bold mb-6">{editItem ? `Tahrirlash: ${modalType}` : `Yangi ${modalType} qo'shish`}</h2>
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-2 rounded-full"><X size={20}/></button>
              <form onSubmit={modalType === 'branches' ? handleSaveBranch : modalType === 'categories' ? handleSaveCategory : handleSaveItem}>
                {modalType === 'branches' && (<div className="space-y-4"><input name="name" defaultValue={editItem?.name} placeholder="Filial nomi" className="w-full p-2 border rounded" required autoFocus/><input name="address" defaultValue={editItem?.address} placeholder="Manzil" className="w-full p-2 border rounded" required /><input name="phone" defaultValue={editItem?.phone} placeholder="Telefon" className="w-full p-2 border rounded" required /></div>)}
                {modalType === 'categories' && (<div className="space-y-4"><input name="name" defaultValue={editItem?.name} placeholder="Kategoriya nomi" className="w-full p-2 border rounded" required autoFocus/></div>)}
                {modalType === 'items' && (
                  <div className="space-y-6">
                    <input name="name" defaultValue={editItem?.name} placeholder="Taom nomi" className="w-full p-3 border rounded-lg" required autoFocus/>
                    <textarea name="description" defaultValue={editItem?.description} placeholder="Tavsif" className="w-full p-3 border rounded-lg h-24"></textarea>
                    <div><input name="imageUrl" defaultValue={editItem?.imageUrl} placeholder="Rasm URL" className="w-full p-3 border rounded-lg" /><p className="text-xs text-gray-500 mt-1">Tavsiya: <strong>16:9</strong> nisbatdagi rasm.</p></div>
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
                <div className="mt-8 flex justify-end gap-3"><button type="button" onClick={closeModal} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Bekor qilish</button><button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Saqlash</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
