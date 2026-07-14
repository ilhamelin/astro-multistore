import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import CustomizeTab from './admin/CustomizeTab';
import CatalogTab from './admin/CatalogTab';
import ReviewsTab from './admin/ReviewsTab';
import OrdersTab from './admin/OrdersTab';
import AnalyticsTab from './admin/AnalyticsTab';
import SettingsTab from './admin/SettingsTab';
import { Palette, Package, MessageSquare, Receipt, TrendingUp, Settings, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminPanel() {
  const { currentTheme, setIsAdminMode, currentUser, language } = useStore();
  const [activeTab, setActiveTab] = useState('customize'); // 'customize', 'catalog', 'reviews', 'analytics', 'settings'

  // Safety check: redirect out of AdminMode if the user is not an admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsAdminMode(false);
    }
  }, [currentUser, setIsAdminMode]);

  const menuItems = [
    { id: 'customize', label: language === 'es' ? 'Personalización' : 'Customization', icon: Palette },
    { id: 'catalog', label: language === 'es' ? 'Inventario' : 'Inventory', icon: Package },
    { id: 'orders', label: language === 'es' ? 'Pedidos' : 'Orders', icon: Receipt },
    { id: 'reviews', label: language === 'es' ? 'Reseñas' : 'Reviews', icon: MessageSquare },
    { id: 'analytics', label: language === 'es' ? 'Métricas' : 'Analytics', icon: TrendingUp },
    { id: 'settings', label: language === 'es' ? 'Ajustes' : 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-900 bg-slate-950 flex flex-col justify-between shrink-0">
        <div className="flex flex-col">
          {/* Admin Header */}
          <div className="p-6 border-b border-slate-900 flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg text-slate-950">
              <ShieldAlert className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider text-slate-200">Consola Admin</h1>
              <span className="text-[9px] opacity-40 font-mono">v1.0.0 • FlexCommerce</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible scrollbar-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-slate-900 border border-slate-800 text-cyan-400' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-cyan-400' : 'opacity-65'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back to Store Action */}
        <div className="p-4 border-t border-slate-900 hidden md:block">
          <button
            onClick={() => setIsAdminMode(false)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-850 hover:bg-slate-900 text-slate-350 hover:text-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-98"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la Tienda</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="bg-slate-900/20 border border-slate-900/60 p-6 md:p-8 rounded-3xl backdrop-blur-md">
          {activeTab === 'customize' && <CustomizeTab />}
          {activeTab === 'catalog' && <CatalogTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>

      {/* Mobile Back Button Floating */}
      <div className="p-4 border-t border-slate-900 md:hidden bg-slate-950 w-full mt-auto">
        <button
          onClick={() => setIsAdminMode(false)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-850 bg-slate-900 text-slate-350 hover:text-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a la Tienda</span>
        </button>
      </div>
    </div>
  );
}
