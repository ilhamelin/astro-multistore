import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Heart, ShoppingBag } from 'lucide-react';

export default function WishlistDrawer() {
  const { 
    currentTheme, 
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    isWishlistOpen, 
    setIsWishlistOpen, 
    formatPrice,
    translateCategory,
    t,
    language
  } = useStore();

  if (!isWishlistOpen) return null;

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md border-l flex flex-col justify-between shadow-2xl transition-all duration-300 ${currentTheme.colors.cardBg}`}>
          
          {/* Header */}
          <div className="p-6 border-b border-slate-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              <h2 className={`text-lg font-bold ${currentTheme.fontHeading}`}>{t('wishlist_title')}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 opacity-70">
                {favoriteProducts.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-full hover:bg-slate-500/15 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
            {favoriteProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="p-4 rounded-full bg-slate-500/5 border border-slate-500/10 text-slate-500">
                  <Heart className="h-10 w-10 opacity-40" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{t('wishlist_empty')}</h3>
                  <p className="text-xs opacity-60 mt-1 max-w-[240px]">{t('wishlist_empty_sub')}</p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className={`mt-2 py-2 px-5 text-xs font-semibold uppercase tracking-wider cursor-pointer ${currentTheme.colors.button}`}
                >
                  {t('view_catalog')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {favoriteProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex gap-4 p-3 rounded-xl bg-slate-500/5 border border-slate-500/10 hover:border-slate-500/20 transition-all"
                  >
                    {/* Image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-900/10 dark:bg-white/5">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-sm font-bold line-clamp-1">{product.name}</h4>
                          <button
                            onClick={() => toggleWishlist(product)}
                            className="text-red-500 p-1 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                            title={language === 'es' ? "Quitar de favoritos" : "Remove from favorites"}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] opacity-50 uppercase tracking-wide">{translateCategory(product.category)}</span>
                      </div>

                      <div className="flex justify-between items-center gap-2 mt-2">
                        <span className="text-sm font-extrabold">{formatPrice(product.price)}</span>
                        
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            // Optional: Close wishlist drawer when adding
                            setIsWishlistOpen(false);
                          }}
                          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${currentTheme.colors.button}`}
                        >
                          <ShoppingBag className="h-3 w-3" />
                          <span>{t('add_to_cart')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
