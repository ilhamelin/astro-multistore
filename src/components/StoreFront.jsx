import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StoreHeader from './store/StoreHeader';

gsap.registerPlugin(ScrollTrigger);
import ProductCard from './store/ProductCard';
import ProductDetailModal from './store/ProductDetailModal';
import CartDrawer from './store/CartDrawer';
import WishlistDrawer from './store/WishlistDrawer';
import CheckoutModal from './store/CheckoutModal';
import AuthModal from './store/AuthModal';
import UserProfileModal from './store/UserProfileModal';
import { Mail, ShoppingBag, ArrowRight, ShieldCheck, Heart, Sparkles, Sliders, RotateCcw } from 'lucide-react';

export default function StoreFront() {
  const { 
    activeThemeId,
    currentTheme, 
    storeName, 
    storeSlogan, 
    products, 
    currency,
    contactEmail,
    addView,
    formatPrice,
    convertPrice,
    translateCategory,
    t,
    language,
    customHeroImage,
    customHeroDescription,
    promoBarEnabled,
    promoBarText,
    promoBarColor
  } = useStore();

  const mainContainer = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filtering and sorting state variables
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);

  // Simular carga al cambiar filtros de búsqueda o categoría
  useEffect(() => {
    setIsCatalogLoading(true);
    const timer = setTimeout(() => {
      setIsCatalogLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, activeThemeId, minPrice, maxPrice, sortBy]);

  // Calculate the maximum price in the current active theme products
  const themeProducts = products.filter((p) => p.theme === activeThemeId);
  const maxCatalogPrice = Math.ceil(
    themeProducts.reduce((max, p) => (p.price > max ? p.price : max), 0)
  ) || 500;

  // Sync maxPrice and reset minPrice when theme changes
  useEffect(() => {
    setMaxPrice(maxCatalogPrice);
    setMinPrice(0);
  }, [activeThemeId, maxCatalogPrice]);

  // Check if any filtering parameter is actively modified
  const isFilterActive = minPrice > 0 || maxPrice < maxCatalogPrice || sortBy !== 'default';

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(maxCatalogPrice);
    setSortBy('default');
  };

  // Filter products by active theme, search text, category, price range, and sort
  const filteredProducts = themeProducts
    .filter((prod) => {
      const matchesCategory = selectedCategory === 'Todos' || prod.category === selectedCategory;
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const price = prod.price;
      const matchesMin = minPrice === '' || price >= parseFloat(minPrice);
      const matchesMax = maxPrice === '' || price <= parseFloat(maxPrice);
      
      return matchesCategory && matchesSearch && matchesMin && matchesMax;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0; // default
    });

  // Increment views once on mount
  useEffect(() => {
    addView();
  }, [activeThemeId]);

  // GSAP Animations: mount, theme, and catalog transitions
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animate Hero elements
      gsap.fromTo(".hero-animate:not(p)", 
        { opacity: 0, y: 35 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }
      );
      gsap.fromTo("p.hero-animate", 
        { opacity: 0, y: 35 }, 
        { opacity: 0.8, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
      );

      // 2. Animate Trust Badges on Scroll
      gsap.fromTo(".trust-badge-animate",
        { opacity: 0, y: 25 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.7, 
          stagger: 0.1, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".trust-badges-section-trigger",
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );

      // 3. Animate Newsletter signup on Scroll
      gsap.fromTo(".newsletter-animate",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".newsletter-section-trigger",
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }, mainContainer);

    return () => ctx.revert();
  }, [activeThemeId]);

  // Animate product cards when catalog loading finishes and there are results
  useEffect(() => {
    if (!isCatalogLoading && filteredProducts.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".product-card-animate",
          { opacity: 0, scale: 0.95, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" }
        );
      }, mainContainer);
      return () => ctx.revert();
    }
  }, [isCatalogLoading, filteredProducts.length, activeThemeId]);



  return (
    <div ref={mainContainer} className={`min-h-screen transition-colors duration-500 ${currentTheme.colors.bg} ${currentTheme.fontBody}`}>
      {/* Top Announcement Bar (Ribbon) */}
      {promoBarEnabled && (
        <div className={`w-full py-2 text-center text-[10px] sm:text-xs font-bold tracking-wider flex items-center justify-center gap-2 uppercase transition-all duration-300 ${promoBarColor}`}>
          <span>{promoBarText || (language === 'es' ? '🚀 ¡Envío gratis inmediato para compras superiores a 100.00!' : '🚀 Free immediate shipping for purchases over 100.00!')}</span>
        </div>
      )}

      {/* Dynamic Header */}
      <StoreHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden border-b border-inherit">
        {/* Background Image with theme overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={customHeroImage || currentTheme.heroImage} 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-30 select-none scale-105"
          />
          <div className={`absolute inset-0 ${currentTheme.colors.heroOverlay}`} />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-start justify-center gap-6">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider hero-animate opacity-0 ${currentTheme.colors.accent}`}>
            <Sparkles className="h-3 w-3" />
            <span>{t('new_collection')}</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black max-w-2xl leading-tight hero-animate opacity-0 ${currentTheme.fontHeading}`}>
            {storeSlogan}
          </h1>

          <p className="text-sm md:text-base max-w-lg opacity-0 leading-relaxed hero-animate">
            {customHeroDescription || t('hero_description', { theme: currentTheme.name })}
          </p>

          <a 
            href="#catalog"
            className={`py-3.5 px-7 text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all hero-animate opacity-0 ${currentTheme.colors.button}`}
          >
            <span>{t('view_catalog')}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-10">
        
        {/* Catalog Subheader */}
        <div className="flex flex-col gap-1.5">
          <h2 className={`text-2xl font-bold ${currentTheme.fontHeading}`}>{t('our_products')}</h2>
          <p className="text-xs opacity-60">{t('showing_products', { count: filteredProducts.length, category: translateCategory(selectedCategory) })}</p>
        </div>

        {/* Filters & Sorting Toolbar */}
        <div className="flex flex-col gap-5 border-t border-b border-slate-500/10 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center flex-wrap gap-3">
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isFilterPanelOpen 
                    ? 'bg-slate-500/20 border-slate-500/40 text-inherit' 
                    : 'hover:bg-slate-500/10 border-slate-500/10'
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span>{t('price_filter', { active: minPrice > 0 || maxPrice < maxCatalogPrice ? (language === 'es' ? "(Activo)" : "(Active)") : "" })}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs opacity-60 font-semibold">{t('order_by')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold outline-none bg-slate-950 text-slate-100 cursor-pointer ${currentTheme.colors.input}`}
                >
                  <option value="default">{t('order_recommended')}</option>
                  <option value="price-low">{t('order_price_low')}</option>
                  <option value="price-high">{t('order_price_high')}</option>
                  <option value="rating">{t('order_rating')}</option>
                </select>
              </div>
            </div>

            {/* Right Controls - Reset button */}
            {isFilterActive && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-500 hover:text-red-400 cursor-pointer flex items-center gap-1.5 py-2 px-4 rounded-full border border-red-500/20 hover:bg-red-500/5 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t('clear_filters')}</span>
              </button>
            )}
          </div>

          {/* Collapsible Price Range Panel */}
          {isFilterPanelOpen && (
            <div className="p-6 border border-slate-500/10 rounded-2xl bg-slate-500/5 flex flex-col md:flex-row items-center gap-8 animate-slide-in">
              {/* Slider */}
              <div className="flex-1 w-full flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold tracking-wide">
                  <span>{t('max_price_range')}</span>
                  <span className="opacity-80">{formatPrice(0)} - {formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxCatalogPrice}
                  value={maxPrice === '' ? maxCatalogPrice : maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-500/20 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Number Inputs */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-50 font-bold">Mín:</span>
                  <input
                    type="number"
                    min="0"
                    max={maxPrice || maxCatalogPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    className={`w-24 px-3 py-2 border rounded-xl text-xs outline-none text-center bg-slate-950 border-slate-500/20`}
                    placeholder="0"
                  />
                </div>
                <span className="text-slate-500">-</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-50 font-bold">Máx:</span>
                  <input
                    type="number"
                    min={minPrice || 0}
                    max={maxCatalogPrice}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    className={`w-24 px-3 py-2 border rounded-xl text-xs outline-none text-center bg-slate-950 border-slate-500/20`}
                    placeholder={maxCatalogPrice}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isCatalogLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4 border border-slate-500/10 rounded-2xl bg-slate-500/5">
            <div className="p-4 rounded-full bg-slate-500/5 border border-slate-500/10 opacity-55">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{language === 'es' ? 'No se encontraron productos' : 'No products found'}</h3>
              <p className="text-xs opacity-50 mt-1">{language === 'es' ? 'Prueba a buscar otro término o cambia la categoría activa.' : 'Try searching for another term or change the active category.'}</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card-animate opacity-0">
                <ProductCard 
                  product={product}
                  onViewDetails={setSelectedProduct}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Trust & Badges Banner */}
      <section className="border-t border-b border-slate-500/10 py-12 bg-slate-500/5 trust-badges-section-trigger">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 trust-badge-animate opacity-0">
            <div className={`p-3 rounded-full border ${currentTheme.colors.accent}`}>
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">{language === 'es' ? 'Pago 100% Seguro' : '100% Secure Payment'}</h4>
              <p className="text-xs opacity-60 mt-1 leading-relaxed">{language === 'es' ? 'Simulación de pasarela segura. No te cobraremos dinero real en ningún momento.' : 'Simulated secure gateway. No real money will be charged.'}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 trust-badge-animate opacity-0">
            <div className={`p-3 rounded-full border ${currentTheme.colors.accent}`}>
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">{language === 'es' ? 'Envío Gratis' : 'Free Shipping'}</h4>
              <p className="text-xs opacity-60 mt-1 leading-relaxed">{language === 'es' ? `Envío gratuito inmediato para todas las compras superiores a ${formatPrice(100)}.` : `Free immediate shipping for all orders over ${formatPrice(100)}.`}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 trust-badge-animate opacity-0">
            <div className={`p-3 rounded-full border ${currentTheme.colors.accent}`}>
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">{language === 'es' ? 'Servicio al Cliente' : 'Customer Service'}</h4>
              <p className="text-xs opacity-60 mt-1 leading-relaxed">{language === 'es' ? 'Soporte técnico y devoluciones gratuitas escribiendo al email oficial de la tienda.' : 'Technical support and free returns by writing to the official store email.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter signup container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 newsletter-section-trigger">
        <div className={`p-8 md:p-12 border rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 ${currentTheme.colors.cardBg}`}>
          <div className="max-w-md flex flex-col gap-2 newsletter-animate opacity-0">
            <h3 className={`text-xl md:text-2xl font-bold ${currentTheme.fontHeading}`}>{language === 'es' ? '¡Suscríbete a nuestro Newsletter!' : 'Subscribe to our Newsletter!'}</h3>
            <p className="text-xs opacity-70 leading-relaxed">{language === 'es' ? 'Recibe descuentos exclusivos, actualizaciones de catálogo y promociones de temporada directo en tu bandeja.' : 'Receive exclusive discounts, catalog updates, and seasonal promotions directly in your inbox.'}</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 shrink-0 newsletter-animate opacity-0">
            <input 
              type="email" 
              placeholder={language === 'es' ? 'Tu correo electrónico...' : 'Your email address...'}
              className={`px-5 py-3 border text-xs outline-none w-full sm:w-64 ${currentTheme.colors.input}`}
            />
            <button className={`py-3 px-6 text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer ${currentTheme.colors.button}`}>
              {language === 'es' ? 'Suscribirme' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>

      {/* Store Footer */}
      <footer className={`py-12 ${currentTheme.colors.footerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs opacity-60">
          <div>
            © {new Date().getFullYear()} <strong>{storeName}</strong>. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </div>
          <div className="flex gap-4">
            <span>{language === 'es' ? 'Contacto:' : 'Contact:'} <strong>{contactEmail}</strong></span>
            <span>{language === 'es' ? 'Nicho:' : 'Niche:'} <strong>{currentTheme.name}</strong></span>
          </div>
        </div>
      </footer>

      {/* Interactivity Modals */}
      <ProductDetailModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      
      <CartDrawer 
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <WishlistDrawer />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <AuthModal />

      <UserProfileModal />
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-500/10 overflow-hidden bg-slate-900/30 flex flex-col h-full animate-pulse">
      {/* Image skeleton with shimmer */}
      <div className="w-full aspect-[4/3] bg-slate-800/20 relative overflow-hidden animate-shimmer" />
      
      {/* Body skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* Category */}
          <div className="h-3 w-16 bg-slate-800/40 rounded animate-shimmer" />
          {/* Name */}
          <div className="h-4 w-4/5 bg-slate-800/60 rounded animate-shimmer" />
          {/* Description */}
          <div className="h-3 w-full bg-slate-800/30 rounded animate-shimmer" />
          <div className="h-3 w-2/3 bg-slate-800/30 rounded animate-shimmer" />
        </div>

        <div className="flex flex-col gap-3">
          {/* Rating */}
          <div className="h-3.5 w-20 bg-slate-800/40 rounded animate-shimmer" />
          
          {/* Price & button */}
          <div className="flex justify-between items-center border-t border-slate-500/10 pt-4">
            <div className="h-5 w-14 bg-slate-800/50 rounded animate-shimmer" />
            <div className="h-8 w-24 bg-slate-800/50 rounded-xl animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
