import React, { useState, useEffect } from 'react';
import { ViewMode, AppSettings } from './types';
import { DataService } from './services/dataService';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientView } from './components/ClientView';
import { Lock } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('client-branch-select');
  const [settings, setSettings] = useState<AppSettings>(DataService.getSettings());
  
  // Simple Auth State for Demo
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
     // Ensure settings are loaded on mount
     setSettings(DataService.getSettings());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, use a secure auth service
    const storedSettings = DataService.getSettings();
    if (passwordInput === (storedSettings.adminPassword || 'admin')) {
      setCurrentView('admin-dashboard');
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError("Noto'g'ri parol");
    }
  };

  const handleLogout = () => {
    setCurrentView('client-branch-select');
  };

  // Navigation Helper (Hidden on Client View usually, but visible here to toggle for demo purposes)
  const ToggleButton = () => (
    <div className="fixed bottom-4 right-4 z-50 opacity-30 hover:opacity-100 transition-opacity">
      <button 
        onClick={() => setCurrentView(prev => prev.startsWith('admin') ? 'client-branch-select' : 'admin-login')}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg"
        title="Toggle Admin/Client Mode"
      >
        <Lock size={16} />
      </button>
    </div>
  );

  if (currentView === 'admin-dashboard') {
    return (
      <>
        <AdminDashboard onLogout={handleLogout} />
        <ToggleButton />
      </>
    );
  }

  if (currentView === 'admin-login') {
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
            <button type="button" onClick={() => setCurrentView('client-branch-select')} className="w-full text-gray-500 text-sm hover:underline">
              Mijoz rejimiga qaytish
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Default: Client View (Wrapper handles internal states like branch select vs menu)
  return (
    <>
      <ClientView />
      <ToggleButton />
    </>
  );
};

export default App;
