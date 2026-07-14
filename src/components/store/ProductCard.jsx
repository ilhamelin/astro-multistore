import React, { useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Star, Plus, Heart } from 'lucide-react';
import gsap from 'gsap';

export default function ProductCard({ product, onViewDetails }) {
  const { currentTheme, addToCart, formatPrice, translateCategory, wishlist, toggleWishlist, t, language } = useStore();
  const isOutOfStock = product.stock <= 0;
  const isFavorite = wishlist.includes(product.id);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates: -0.5 to 0.5
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;
    
    gsap.to(card, {
      rotateY: xc * 16,
      rotateX: -yc * 16,
      x: xc * 5,
      y: yc * 5,
      scale: 1.02,
      ease: "power3.out",
      duration: 0.45,
      transformPerspective: 800,
      overwrite: "auto"
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      x: 0,
      y: 0,
      scale: 1,
      ease: "elastic.out(1.1, 0.65)",
      duration: 0.85,
      overwrite: "auto"
    });
  };

  return (
    <div 
      ref={cardRef}
      className={`group flex flex-col h-full border overflow-hidden cursor-pointer transition-colors duration-300 ${currentTheme.colors.cardBg}`}
      onClick={() => onViewDetails(product)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-900/10 dark:bg-white/5 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category Tag */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider ${currentTheme.colors.accent}`}>
          {translateCategory(product.category)}
        </span>

        {/* Favorite (Wishlist) Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Avoid opening details modal
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${
            isFavorite 
              ? 'bg-red-500/20 border-red-500/50 text-red-500' 
              : 'bg-slate-950/40 border-slate-500/20 text-slate-300 hover:text-white'
          }`}
          title={isFavorite ? (language === 'es' ? "Quitar de favoritos" : "Remove from favorites") : (language === 'es' ? "Añadir a favoritos" : "Add to favorites")}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-wider uppercase px-4 py-2 border border-red-500 rounded bg-red-950/30">
              {t('out_of_stock')}
            </span>
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-30'}`} 
                />
              ))}
            </div>
            <span className="text-[11px] font-bold opacity-60">
              {product.rating?.toFixed(1) || "5.0"}
            </span>
          </div>

          {/* Name */}
          <h3 className={`text-base font-bold line-clamp-1 group-hover:text-cyan-400 transition-colors ${currentTheme.fontHeading}`}>
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-500/10">
          <div className="flex flex-col">
            <span className="text-xs opacity-55 font-semibold uppercase tracking-wider">{t('price_label')}</span>
            <span className={`text-lg font-black ${currentTheme.fontHeading}`}>
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Avoid opening the detail modal
              if (!isOutOfStock) addToCart(product);
            }}
            disabled={isOutOfStock}
            className={`p-3 rounded-full border cursor-pointer hover:scale-110 active:scale-95 transition-all ${
              isOutOfStock 
                ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500 border-slate-700' 
                : `${currentTheme.colors.button}`
            }`}
            title="Añadir al carrito"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
