import React, { useState, useEffect } from 'react';
import { Branch, Category, MenuItem, AppSettings } from '../types';
import { DataService } from '../services/dataService';
import { MapPin, Phone, ChevronRight } from 'lucide-react';

interface ClientViewProps {}

export const ClientView: React.FC<ClientViewProps> = () => {
  const [viewState, setViewState] = useState<'select-branch' | 'menu'>('select-branch');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await DataService.refreshData();

      const activeBranches = data.branches.filter(b => b.isActive);
      const sortedCategories = data.categories.sort((a, b) => a.sortOrder - b.sortOrder);

      setBranches(activeBranches);
      setCategories(sortedCategories);
      setItems(data.items.filter(i => i.isActive));
      setSettings(data.settings);

      if (activeBranches.length === 1) {
        handleBranchSelect(activeBranches[0], sortedCategories);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleBranchSelect = (branch: Branch, categoryList: Category[]) => {
    setSelectedBranch(branch);
    setViewState('menu');
    if (categoryList.length > 0) {
        setActiveCategory(categoryList[0].id);
    }
  };

  const getDisplayPrice = (item: MenuItem) => {
    if (!item.variants || item.variants.length === 0) {
      return 'Narxi belgilanmagan';
    }
    if (item.variants.length === 1) {
      return `${(item.variants[0].price || 0).toLocaleString()} so'm`;
    }
    const minPrice = Math.min(...item.variants.map(v => v.price || 0));
    return `dan ${minPrice.toLocaleString()} so'm`;
  };

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Yuklanmoqda...</div>
      </div>
    );
  }

  const filteredItems = items.filter(item => 
    item.branchIds.includes(selectedBranch?.id || '') && 
    item.categoryId === activeCategory
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  // --- RENDER: BRANCH SELECTION ---
  if (viewState === 'select-branch') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <img 
            src={settings.logoUrl} 
            alt={settings.brandName} 
            className="h-24 w-auto mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold mb-2" style={{ color: settings.headingColor }}>Xush kelibsiz!</h1>
          <p className="text-xl" style={{ color: settings.bodyTextColor }}>Iltimos, filialni tanlang:</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {branches.map(branch => (
            <button
              key={branch.id}
              onClick={() => handleBranchSelect(branch, categories)}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[color:var(--brand-color)] text-left group hover:scale-[1.03]"
              style={{'--brand-color': settings.primaryColor} as React.CSSProperties}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold group-hover:text-[color:var(--brand-color)] transition-colors" style={{ color: settings.headingColor }}>
                  {branch.name}
                </h3>
                <ChevronRight size={28} className="text-gray-300 group-hover:text-[color:var(--brand-color)] group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-lg" style={{ color: settings.bodyTextColor }}>
                  <MapPin size={20} className="mr-3 flex-shrink-0" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center text-lg" style={{ color: settings.bodyTextColor }}>
                  <Phone size={20} className="mr-3 flex-shrink-0" />
                  <span>{branch.phone}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDER: MENU DISPLAY ---
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <header className="flex-none bg-white shadow-sm z-20 border-b border-gray-100 h-20 flex items-center px-8 justify-between">
        <div className="flex items-center gap-6">
          <img src={settings.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
          <div className="h-8 w-px bg-gray-200"></div>
          <div>
             <h2 className="text-xl font-bold" style={{ color: settings.headingColor }}>{selectedBranch?.name}</h2>
             <p className="text-sm" style={{ color: settings.bodyTextColor }}>{selectedBranch?.address}</p>
          </div>
        </div>
        {branches.length > 1 && (
            <button 
                onClick={() => setViewState('select-branch')} 
                className="font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: settings.bodyTextColor }}
            >
                Filialni o'zgartirish
            </button>
        )}
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <aside className="flex-none bg-white border-b border-gray-200">
          <nav className="flex items-center space-x-2 p-4 overflow-x-auto no-scrollbar">
            {categories.map(category => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full text-base font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive ? 'text-white shadow-sm' : 'hover:bg-gray-100'
                  }`}
                  style={{ backgroundColor: isActive ? settings.primaryColor : 'transparent', color: isActive ? '#FFFFFF' : settings.bodyTextColor }}
                >
                  {category.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold" style={{ color: settings.headingColor }}>
               {categories.find(c => c.id === activeCategory)?.name}
            </h2>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 text-xl" style={{ color: settings.bodyTextColor }}>
                Ushbu kategoriyada hozircha taomlar yo'q.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 flex flex-col">
                    <h3 className="text-xl font-bold truncate mb-2" style={{ color: settings.headingColor }}>{item.name}</h3>
                    <p className="text-sm line-clamp-2 flex-grow mb-4" style={{ minHeight: '40px', color: settings.bodyTextColor }}>
                      {item.description}
                    </p>
                    <div className="mt-auto">
                      <span className="text-2xl font-bold" style={{ color: settings.primaryColor }}>
                        {getDisplayPrice(item)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
