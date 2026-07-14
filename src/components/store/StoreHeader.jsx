import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Settings, Eye, Search, Sparkles, LogIn, LogOut, User, Heart } from 'lucide-react';

export default function StoreHeader({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  const { 
    currentTheme, 
    storeName, 
    cart, 
    setIsCartOpen, 
    isAdminMode, 
    setIsAdminMode,
    currentUser,
    setIsAuthOpen,
    logout,
    wishlist,
    setIsWishlistOpen,
    setIsProfileOpen,
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    translateCategory
  } = useStore();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const categories = ["Todos", ...currentTheme.categories];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${currentTheme.colors.navBg} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={`p-2 rounded-lg bg-gradient-to-tr ${currentTheme.colors.primary} text-white shadow-md animate-pulse`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <span className={`text-2xl font-bold bg-gradient-to-r ${currentTheme.colors.primary} bg-clip-text text-transparent ${currentTheme.fontHeading}`}>
              {storeName}
            </span>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 opacity-50" />
            </div>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-full text-sm outline-none transition-all ${currentTheme.colors.input}`}
            />
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1 border border-slate-500/20 rounded-full px-2 py-0.5 bg-slate-950/10 shrink-0 select-none">
              <button
                onClick={() => setLanguage('es')}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-all ${language === 'es' ? 'bg-cyan-500 text-slate-950' : 'opacity-65 text-inherit'}`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-all ${language === 'en' ? 'bg-cyan-500 text-slate-950' : 'opacity-65 text-inherit'}`}
              >
                EN
              </button>
            </div>

            {/* Currency Selector */}
            {!isAdminMode && (
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`px-2 py-1 rounded-full border text-[9px] font-bold outline-none cursor-pointer bg-slate-950 text-slate-100 ${currentTheme.colors.input}`}
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="MXN$">MXN (MXN$)</option>
                <option value="CLP$">CLP (CLP$)</option>
              </select>
            )}
            
            {/* User Session Status */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* User avatar/name chip */}
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-500/10 bg-slate-500/5 text-xs text-inherit cursor-pointer hover:bg-slate-500/10 active:scale-95 transition-all select-none"
                  title="Gestionar mi Cuenta"
                >
                  <User className="h-3.5 w-3.5 opacity-70" />
                  <span className="font-semibold max-w-[100px] truncate">{currentUser.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                    currentUser.role === 'admin' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {currentUser.role === 'admin' ? 'Admin' : t('profile')}
                  </span>
                </button>
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className={`p-2.5 rounded-full border cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all ${currentTheme.colors.buttonSecondary}`}
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${currentTheme.colors.buttonSecondary}`}
              >
                <LogIn className="h-4 w-4" />
                <span>{t('enter')}</span>
              </button>
            )}

            {/* View Admin Mode Toggle (Only visible if logged-in user is admin) */}
            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isAdminMode 
                    ? 'bg-gradient-to-r from-red-500 to-amber-600 text-white border-transparent shadow-lg shadow-red-950/20' 
                    : `${currentTheme.colors.buttonSecondary}`
                }`}
              >
                {isAdminMode ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>{t('view_store')}</span>
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4" />
                    <span>{t('admin_mode')}</span>
                  </>
                )}
              </button>
            )}

            {/* Wishlist Icon Button */}
            {!isAdminMode && (
              <button
                onClick={() => setIsWishlistOpen(true)}
                className={`relative p-3 rounded-full border cursor-pointer hover:scale-105 active:scale-95 transition-all ${currentTheme.colors.buttonSecondary}`}
                title={t('view_wishlist')}
              >
                <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-950">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart Icon Button */}
            {!isAdminMode && (
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-3 rounded-full border cursor-pointer hover:scale-105 active:scale-95 transition-all ${currentTheme.colors.buttonSecondary}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-bounce">
                    {totalCartItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search and Categories Bar */}
        {!isAdminMode && (
          <div className="py-3 border-t border-inherit flex flex-col gap-3 md:hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 opacity-50" />
              </div>
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 border rounded-full text-xs outline-none transition-all ${currentTheme.colors.input}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Categories Horizontal Scroller (Only on storefront) */}
      {!isAdminMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === category
                  ? `bg-gradient-to-r ${currentTheme.colors.primary} text-white border-transparent shadow-sm`
                  : `hover:bg-slate-800/10 dark:hover:bg-white/10 ${currentTheme.colors.buttonSecondary}`
              }`}
            >
              {translateCategory(category)}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
