import React, { useState, useEffect, useCallback } from 'react';
import { AppSettings, Branch, Category, MenuItem } from './types';
import { DataService, AppData } from './services/dataService';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientView } from './components/ClientView';
import { Lock } from 'lucide-react';

type ViewMode = 'loading' | 'client' | 'admin-login' | 'admin-dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('loading');
  const [data, setData] = useState<AppData>({
    settings: null,
    branches: [],
    categories: [],
    items: [],
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const refreshData = useCallback(async () => {
    try {
      const appData = await DataService.getAllData();
      setData(appData);
      return appData;
    } catch (error) {
      console.error("Failed to load data:", error);
      // Optionally set an error state to show in the UI
    }
  }, []);

  useEffect(() => {
    refreshData().then((initialData) => {
      if (initialData) {
        setView('client');
      }
      // If data loading fails, it will remain in the 'loading' state
      // A more robust solution would show an error message.
    });
  }, [refreshData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.settings) return;

    if (passwordInput === (data.settings.adminPassword || 'admin')) {
      setView('admin-dashboard');
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError("Noto'g'ri parol");
    }
  };

  const handleLogout = () => {
    setView('client');
  };

  const ToggleButton = () => (
    <div className="fixed bottom-4 right-4 z-50 opacity-30 hover:opacity-100 transition-opacity">
      <button
        onClick={() => setView(prev => prev.startsWith('admin') ? 'client' : 'admin-login')}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg"
        title="Toggle Admin/Client Mode"
      >
        <Lock size={16} />
      </button>
    </div>
  );

  if (view === 'loading' || !data.settings) {
    return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;
  }

  if (view === 'admin-dashboard') {
    return (
      <>
        <AdminDashboard
          initialData={data}
          onDataChange={refreshData}
          onLogout={handleLogout}
        />
        <ToggleButton />
      </>
    );
  }

  if (view === 'admin-login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
               <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Kirish</h2>
            <p className="text-gray-500">Menyu tizimini boshqarish</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Parol (default: admin)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus
              />
              {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Kirish
            </button>
            <button type="button" onClick={() => setView('client')} className="w-full text-gray-500 text-sm hover:underline">
              Mijoz rejimiga qaytish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <ClientView
        settings={data.settings}
        branches={data.branches}
        categories={data.categories}
        items={data.items}
      />
      <ToggleButton />
    </>
  );
};

export default App;
