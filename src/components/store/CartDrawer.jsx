import React, { useEffect } from 'react';
import gsap from 'gsap';
import { useStore } from '../../context/StoreContext';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';

export default function CartDrawer({ onCheckout }) {
  const { 
    currentTheme, 
    cart, 
    updateCartQty, 
    removeFromCart, 
    isCartOpen, 
    setIsCartOpen, 
    formatPrice,
    translateCategory,
    t
  } = useStore();

  useEffect(() => {
    if (!isCartOpen) return;

    const ctx = gsap.context(() => {
      // 1. Animate header elements
      gsap.fromTo(".drawer-header-anim", 
        { opacity: 0, x: 20 }, 
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
      
      // 2. Stagger animate cart items
      gsap.fromTo(".drawer-item-anim",
        { opacity: 0, x: 30, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.45, stagger: 0.05, ease: "power2.out", delay: 0.1 }
      );

      // 3. Animate footer elements
      gsap.fromTo(".drawer-footer-anim",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.25 }
      );
    });

    return () => ctx.revert();
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingThreshold = 100;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md border-l flex flex-col justify-between shadow-2xl transition-all duration-300 ${currentTheme.colors.cardBg}`}>
          
          {/* Header */}
          <div className="p-6 border-b border-slate-500/10 flex items-center justify-between drawer-header-anim opacity-0">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className={`text-lg font-bold ${currentTheme.fontHeading}`}>{t('cart_title')}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 opacity-70">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-slate-500/15 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="p-4 rounded-full bg-slate-500/5 border border-slate-500/10 text-slate-500">
                  <ShoppingCart className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{t('cart_empty')}</h3>
                  <p className="text-xs opacity-60 mt-1 max-w-[200px]">{t('cart_empty_sub')}</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className={`mt-2 py-2 px-5 text-xs font-semibold uppercase tracking-wider cursor-pointer ${currentTheme.colors.button}`}
                >
                  {t('back_to_store')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div 
                    key={item.product.id} 
                    className="flex gap-4 p-3 rounded-xl bg-slate-500/5 border border-slate-500/10 hover:border-slate-500/20 transition-all drawer-item-anim opacity-0"
                  >
                    {/* Image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-900/10 dark:bg-white/5">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-sm font-bold line-clamp-1">{item.product.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 p-1 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] opacity-50 uppercase tracking-wide">{translateCategory(item.product.category)}</span>
                      </div>

                      <div className="flex justify-between items-center gap-2 mt-2">
                        <span className="text-sm font-bold">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        
                        {/* Qty Controls */}
                        <div className="flex items-center gap-2 border border-slate-500/20 rounded-full px-2 py-0.5 bg-slate-950/10">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-500/15 rounded-full transition-colors cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-500/15 rounded-full transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer calculation */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-500/10 bg-slate-500/5">
              <div className="flex flex-col gap-2.5 text-sm drawer-footer-anim opacity-0">
                <div className="flex justify-between">
                  <span className="opacity-60">{t('subtotal')}</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-60">{t('shipping')}</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-500 font-bold">{t('shipping_free')}</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <div className="text-[10px] text-amber-500 font-medium">
                    {t('shipping_alert', { amount: formatPrice(shippingThreshold - subtotal) })}
                  </div>
                )}
                <div className="border-t border-slate-500/10 my-2 pt-2 flex justify-between text-base font-black">
                  <span>Total</span>
                  <span className={`text-lg ${currentTheme.fontHeading}`}>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className={`w-full mt-6 py-4 px-6 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs transition-all cursor-pointer drawer-footer-anim opacity-0 ${currentTheme.colors.button}`}
              >
                <span>{t('checkout_btn')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
