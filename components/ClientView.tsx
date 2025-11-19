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
  const [settings, setSettings] = useState<AppSettings>(DataService.getSettings());

  useEffect(() => {
    const fetchedBranches = DataService.getBranches().filter(b => b.isActive);
    setBranches(fetchedBranches);
    setSettings(DataService.getSettings());
    const sortedCategories = DataService.getCategories().sort((a, b) => a.sortOrder - b.sortOrder);
    setCategories(sortedCategories);
    setItems(DataService.getItems().filter(i => i.isActive));

    if (fetchedBranches.length === 1) {
      handleBranchSelect(fetchedBranches[0]);
    }
  }, []);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setViewState('menu');
    if (categories.length > 0) {
        setActiveCategory(categories[0].id);
    }
  };

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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Xush kelibsiz!</h1>
          <p className="text-xl text-gray-600">Iltimos, filialni tanlang:</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {branches.map(branch => (
            <button
              key={branch.id}
              onClick={() => handleBranchSelect(branch)}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[color:var(--brand-color)] text-left group hover:scale-[1.03]"
              style={{'--brand-color': settings.primaryColor} as React.CSSProperties}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[color:var(--brand-color)] transition-colors">
                  {branch.name}
                </h3>
                <ChevronRight size={28} className="text-gray-300 group-hover:text-[color:var(--brand-color)] group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 text-lg">
                  <MapPin size={20} className="mr-3 flex-shrink-0" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center text-gray-600 text-lg">
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
      {/* Header */}
      <header className="flex-none bg-white shadow-sm z-20 border-b border-gray-100 h-20 flex items-center px-8 justify-between">
        <div className="flex items-center gap-6">
          <img src={settings.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
          <div className="h-8 w-px bg-gray-200"></div>
          <div>
             <h2 className="text-xl font-bold text-gray-800">{selectedBranch?.name}</h2>
             <p className="text-sm text-gray-500">{selectedBranch?.address}</p>
          </div>
        </div>
        {branches.length > 1 && (
            <button 
                onClick={() => setViewState('select-branch')} 
                className="text-gray-500 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
            >
                Filialni o'zgartirish
            </button>
        )}
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Horizontal Categories */}
        <aside className="flex-none bg-white border-b border-gray-200">
          <nav className="flex items-center space-x-2 p-4 overflow-x-auto no-scrollbar">
            {categories.map(category => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full text-base font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? 'bg-[color:var(--brand-color)] text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{'--brand-color': settings.primaryColor} as React.CSSProperties}
                >
                  {category.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Menu Grid */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
               {categories.find(c => c.id === activeCategory)?.name}
            </h2>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-xl">
                Ushbu kategoriyada hozircha taomlar yo'q.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
              {filteredItems.map(item => (
                <div key={item.id} className="flex bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-48 group">
                  <div className="w-2/5 h-full relative overflow-hidden">
                     <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        loading="lazy"
                     />
                  </div>
                  <div className="w-3/5 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-4">
                      <span className="text-2xl font-bold" style={{ color: settings.primaryColor }}>
                        {item.price.toLocaleString()} <span className="text-sm font-medium text-gray-400">so'm</span>
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
