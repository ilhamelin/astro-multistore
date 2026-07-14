import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Minus, Plus, ShoppingBag, Check, Star } from 'lucide-react';

const getMockGallery = (prod) => {
  if (!prod) return [];
  const defaults = [prod.image];
  // Add 2 high-quality related mock images depending on theme
  if (prod.theme === 'bakery') {
    defaults.push(
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600'
    );
  } else if (prod.theme === 'luxury') {
    defaults.push(
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600'
    );
  } else if (prod.theme === 'tech') {
    defaults.push(
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600'
    );
  } else {
    // Generic fallbacks
    defaults.push(
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600'
    );
  }
  return defaults;
};

export default function ProductDetailModal({ product, onClose }) {
  const { currentTheme, addToCart, formatPrice, translateCategory, t, reviews, addReview, language, showToast } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Reviews States
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [activeModalTab, setActiveModalTab] = useState('details');

  const productReviews = product ? reviews.filter(r => r.productId === product.id) : [];

  const handleReviewSubmit = () => {
    if (!newComment.trim()) {
      showToast(t('review_required_fields'), 'error');
      return;
    }
    addReview(product.id, newRating, newComment);
    setNewComment('');
    setNewRating(5);
  };

  // Gallery and Zoom States
  const galleryImages = getMockGallery(product);
  const [activeImage, setActiveImage] = useState(product?.image);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(1);
      setZoomPos({ x: 50, y: 50 });
      setIsZooming(false);
      setActiveModalTab('details');
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative w-full max-w-3xl overflow-hidden border shadow-2xl transition-all duration-300 md:grid md:grid-cols-2 rounded-3xl ${currentTheme.colors.cardBg}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/80 transition-colors border border-slate-700 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image & Gallery Section */}
        <div className="relative h-[380px] md:h-full min-h-[380px] bg-slate-950/20 p-4 flex flex-col justify-between border-r border-slate-500/10">
          
          {/* Zoomable Box */}
          <div 
            className="relative flex-1 rounded-2xl overflow-hidden border border-slate-500/10 cursor-zoom-in group"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={activeImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-150 ${isZooming ? 'scale-[2.2]' : 'scale-100'}`}
              style={{
                transformOrigin: isZooming ? `${zoomPos.x}% ${zoomPos.y}%` : 'center center'
              }}
            />
            <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider ${currentTheme.colors.accent}`}>
              {translateCategory(product.category)}
            </span>
          </div>

          {/* Thumbnails list */}
          <div className="flex gap-2 mt-3 justify-center">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-12 h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all active:scale-90 ${
                  activeImage === img ? 'border-cyan-500 scale-105 shadow-md shadow-cyan-500/20' : 'border-slate-500/10 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>

        </div>

        {/* Info Section */}
        <div className="p-6 md:p-8 flex flex-col justify-between h-full gap-6">
          <div className="flex flex-col gap-4">
            <h2 className={`text-2xl md:text-3xl font-black leading-tight ${currentTheme.fontHeading}`}>
              {product.name}
            </h2>

            <div className="flex items-center gap-4">
              <span className={`text-2xl font-black ${currentTheme.fontHeading}`}>
                {formatPrice(product.price)}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${
                isOutOfStock 
                  ? 'border-red-800 bg-red-950/20 text-red-400' 
                  : 'border-emerald-800 bg-emerald-950/20 text-emerald-400'
              }`}>
                {isOutOfStock ? t('stock_empty') : t('stock_available', { count: product.stock })}
              </span>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-slate-500/10 gap-4 mt-2">
              <button
                type="button"
                onClick={() => setActiveModalTab('details')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeModalTab === 'details' 
                    ? 'border-cyan-500 text-cyan-400 font-black' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {language === 'es' ? 'Detalles' : 'Details'}
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('reviews')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeModalTab === 'reviews' 
                    ? 'border-cyan-500 text-cyan-400 font-black' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {t('reviews_title')} ({productReviews.length})
              </button>
            </div>

            {activeModalTab === 'details' ? (
              <>
                <p className="text-xs opacity-80 leading-relaxed">
                  {product.description}
                </p>

                {/* Specifications */}
                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-500/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('specs_label')}</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="flex flex-col p-2 bg-slate-500/5 rounded border border-slate-500/5">
                          <span className="opacity-55 font-medium">{key}</span>
                          <span className="font-bold opacity-90">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Reviews Panel */
              <div className="flex flex-col gap-4 max-h-[240px] overflow-y-auto pr-1 scrollbar-none">
                {/* Stats & Histogram */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between border-b border-slate-500/10 pb-3">
                  <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-slate-500/5 border border-slate-500/10 w-full sm:w-24 shrink-0">
                    <span className="text-2xl font-black text-slate-100 font-mono">{(product.rating || 5.0).toFixed(1)}</span>
                    <div className="flex text-amber-400 my-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-2.5 w-2.5 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-20'}`} />
                      ))}
                    </div>
                    <span className="text-[8px] opacity-50 uppercase tracking-wider font-semibold">{t('rating_average')}</span>
                  </div>

                  {/* Histogram */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = productReviews.filter(r => r.rating === stars).length;
                      const percent = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2 text-[9px] font-semibold text-slate-400">
                          <span className="w-3 text-right font-mono">{stars}</span>
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 shrink-0" />
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="w-6 text-right font-mono opacity-65">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form to submit review */}
                <div className="p-3 border border-slate-500/10 rounded-xl bg-slate-500/5 flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">{t('write_review')}</span>
                  
                  {/* Stars selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] opacity-60">{t('rating_label')}:</span>
                    <div className="flex text-slate-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setNewRating(star)}
                          className="hover:scale-110 active:scale-95 transition-all p-0.5 cursor-pointer text-amber-400"
                        >
                          <Star 
                            className={`h-4 w-4 ${(hoverRating !== null ? star <= hoverRating : star <= newRating) ? 'fill-current text-amber-400' : 'text-slate-600 opacity-40'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="flex gap-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={t('review_comment_placeholder')}
                      className={`flex-1 min-h-[45px] p-2 text-xs border rounded-lg outline-none bg-slate-950/40 border-slate-500/15 text-slate-100`}
                    />
                    <button
                      type="button"
                      onClick={handleReviewSubmit}
                      className={`px-3 py-1 flex items-center justify-center text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${currentTheme.colors.button}`}
                    >
                      {t('submit_review')}
                    </button>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="flex flex-col gap-3">
                  {productReviews.length === 0 ? (
                    <div className="text-center py-6 text-xs opacity-50 italic">
                      {t('no_reviews')}
                    </div>
                  ) : (
                    productReviews.map((rev) => (
                      <div key={rev.id} className="p-3 border border-slate-500/10 rounded-xl bg-slate-950/20 flex flex-col gap-1.5 animate-slide-in">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-200">{rev.userName}</span>
                          <span className="opacity-50 font-mono">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-2.5 w-2.5 ${i < rev.rating ? 'fill-current' : 'opacity-20'}`} />
                          ))}
                        </div>
                        <p className="text-xs opacity-85 leading-relaxed text-slate-300 break-words">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          {!isOutOfStock && (
            <div className="flex flex-col gap-4 pt-4 border-t border-slate-500/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">{t('cart_title').includes('Cart') ? 'Quantity' : 'Cantidad'}</span>
                <div className="flex items-center gap-3 border rounded-full p-1 border-inherit bg-slate-500/5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-slate-500/10 rounded-full transition-colors cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-slate-500/10 rounded-full transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 px-6 flex items-center justify-center gap-3 font-bold uppercase tracking-wider text-sm transition-all cursor-pointer ${
                  added 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : `${currentTheme.colors.button}`
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5 stroke-[3] animate-scale" />
                    <span>{t('cart_title').includes('Cart') ? 'Added!' : '¡Añadido!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    <span>{t('add_to_cart')} • {formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
