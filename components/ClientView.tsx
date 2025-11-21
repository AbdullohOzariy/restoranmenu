import React, { useState, useEffect, useMemo } from 'react';
import { Branch, Category, MenuItem, AppSettings } from '../types';
import { MapPin, Phone, ChevronRight } from 'lucide-react';

interface ClientViewProps {
  settings: AppSettings | null;
  branches: Branch[];
  categories: Category[];
  items: MenuItem[];
}

export const ClientView: React.FC<ClientViewProps> = ({ settings, branches: allBranches, categories: allCategories, items: allItems }) => {
  const [viewState, setViewState] = useState<'select-branch' | 'menu'>('select-branch');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');

  const activeBranches = useMemo(() => allBranches.filter(b => b.isActive), [allBranches]);
  const sortedCategories = useMemo(() => [...allCategories].sort((a, b) => a.sortOrder - b.sortOrder), [allCategories]);
  const activeItems = useMemo(() => allItems.filter(i => i.isActive), [allItems]);

  useEffect(() => {
    if (activeBranches.length === 1) {
      handleBranchSelect(activeBranches[0]);
    } else {
      setViewState('select-branch');
    }
  }, [activeBranches]);

  useEffect(() => {
    if (settings) {
      document.documentElement.style.setProperty('--brand-color', settings.primaryColor);
      document.documentElement.style.setProperty('--heading-color', settings.headingColor);
      document.documentElement.style.setProperty('--body-text-color', settings.bodyTextColor);
    }
  }, [settings]);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setViewState('menu');
    if (sortedCategories.length > 0) {
      setActiveCategory(sortedCategories[0].id);
    }
  };

  const getDisplayPrice = (item: MenuItem) => {
    if (!item || !Array.isArray(item.variants) || item.variants.length === 0) {
      return 'Narxi belgilanmagan';
    }
  
    const validPrices = item.variants
      .map(v => v?.price)
      .filter(price => typeof price === 'number' && isFinite(price)) as number[];
  
    if (validPrices.length === 0) {
      return 'Narxi belgilanmagan';
    }
  
    if (validPrices.length === 1) {
      return `${validPrices[0].toLocaleString()} so'm`;
    }
  
    const minPrice = Math.min(...validPrices);
    return `dan ${minPrice.toLocaleString()} so'm`;
  };

  const filteredItems = useMemo(() => {
    if (!selectedBranch) return [];
    return activeItems
      .filter(item => item.branchIds.includes(selectedBranch.id) && item.categoryId === activeCategory)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [activeItems, selectedBranch, activeCategory]);

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Yuklanmoqda...</div>
      </div>
    );
  }

  if (viewState === 'select-branch') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt={settings.brandName} className="h-24 w-auto mx-auto mb-6 object-contain" />
          )}
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--heading-color)' }}>Xush kelibsiz!</h1>
          <p className="text-xl" style={{ color: 'var(--body-text-color)' }}>Iltimos, filialni tanlang:</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {activeBranches.map(branch => (
            <button
              key={branch.id}
              onClick={() => handleBranchSelect(branch)}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[color:var(--brand-color)] text-left group hover:scale-[1.03]"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold group-hover:text-[color:var(--brand-color)] transition-colors" style={{ color: 'var(--heading-color)' }}>
                  {branch.name}
                </h3>
                <ChevronRight size={28} className="text-gray-300 group-hover:text-[color:var(--brand-color)] group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-lg" style={{ color: 'var(--body-text-color)' }}>
                  <MapPin size={20} className="mr-3 flex-shrink-0" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center text-lg" style={{ color: 'var(--body-text-color)' }}>
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

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <header className="flex-none bg-white shadow-sm z-20 border-b border-gray-100 h-20 flex items-center px-8 justify-between">
        <div className="flex items-center gap-6">
          {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />}
          <div className="h-8 w-px bg-gray-200"></div>
          <div>
             <h2 className="text-xl font-bold" style={{ color: 'var(--heading-color)' }}>{selectedBranch?.name}</h2>
             <p className="text-sm" style={{ color: 'var(--body-text-color)' }}>{selectedBranch?.address}</p>
          </div>
        </div>
        {activeBranches.length > 1 && (
            <button 
                onClick={() => setViewState('select-branch')} 
                className="font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: 'var(--body-text-color)' }}
            >
                Filialni o'zgartirish
            </button>
        )}
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <aside className="flex-none bg-white border-b border-gray-200">
          <nav className="flex items-center space-x-2 p-4 overflow-x-auto no-scrollbar">
            {sortedCategories.map(category => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full text-base font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive ? 'text-white shadow-sm' : 'hover:bg-gray-100'
                  }`}
                  style={{ backgroundColor: isActive ? 'var(--brand-color)' : 'transparent', color: isActive ? '#FFFFFF' : 'var(--body-text-color)' }}
                >
                  {category.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--heading-color)' }}>
               {sortedCategories.find(c => c.id === activeCategory)?.name}
            </h2>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 text-xl" style={{ color: 'var(--body-text-color)' }}>
                Ushbu kategoriyada hozircha taomlar yo'q.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-5 flex flex-col">
                    <h3 className="text-xl font-bold truncate mb-2" style={{ color: 'var(--heading-color)' }}>{item.name}</h3>
                    <p className="text-sm line-clamp-2 flex-grow mb-4" style={{ minHeight: '40px', color: 'var(--body-text-color)' }}>
                      {item.description}
                    </p>
                    <div className="mt-auto">
                      <span className="text-2xl font-bold" style={{ color: 'var(--brand-color)' }}>
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
