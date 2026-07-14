import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShieldCheck, CreditCard, Sparkles, Printer, CheckCircle, Lock, ShieldAlert } from 'lucide-react';

const validateLuhn = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  if (!digits || digits.length < 13) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let val = parseInt(digits[i], 10);
    if (shouldDouble) {
      val *= 2;
      if (val > 9) val -= 9;
    }
    sum += val;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const detectCardBrand = (cardNumber) => {
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(clean) || /^2(22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)/.test(clean)) return 'Mastercard';
  if (/^3[47]/.test(clean)) return 'Amex';
  return '';
};

export default function CheckoutModal({ isOpen, onClose }) {
  const { currentTheme, cart, placeOrder, currency, currentUser, coupons, formatPrice, t, language } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [step, setStep] = useState('form'); // 'form', 'loading', 'success', '3ds'
  const [completedOrder, setCompletedOrder] = useState(null);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponFeedback, setCouponFeedback] = useState(null);

  const [cardError, setCardError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  // Auto-populate user data on modal open
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        name: currentUser ? currentUser.name : prev.name || '',
        email: currentUser ? currentUser.email : prev.email || '',
        address: (currentUser && currentUser.shippingAddress) ? currentUser.shippingAddress : prev.address || '',
        cardNumber: (currentUser && currentUser.paymentMethod?.cardNumber) ? currentUser.paymentMethod.cardNumber : prev.cardNumber || '',
        expiry: (currentUser && currentUser.paymentMethod?.expiry) ? currentUser.paymentMethod.expiry : prev.expiry || '',
        cvv: (currentUser && currentUser.paymentMethod?.cvv) ? currentUser.paymentMethod.cvv : prev.cvv || '',
      }));
      setStep('form');
      setCompletedOrder(null);
      setCouponInput('');
      setAppliedCoupon(null);
      setCouponFeedback(null);
      setCardError('');
      setGeneratedOtp('');
      setOtpInput('');
      setOtpError('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const orderTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  let isFreeShipping = false;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = orderTotal * (appliedCoupon.value / 100);
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = Math.min(appliedCoupon.value, orderTotal);
    } else if (appliedCoupon.type === 'shipping') {
      isFreeShipping = true;
    }
  }

  const shippingFee = (orderTotal >= 100 || isFreeShipping) ? 0 : 9.99;
  const total = Math.max(0, orderTotal - discountAmount + shippingFee);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponFeedback(null);
    const code = couponInput.toUpperCase().trim();
    if (!code) return;

    const coupon = coupons.find(c => c.code.toUpperCase() === code);
    if (!coupon) {
      setCouponFeedback({ text: t('coupon_invalid'), type: 'error' });
      setAppliedCoupon(null);
      return;
    }

    if (!coupon.isActive) {
      setCouponFeedback({ text: t('coupon_inactive'), type: 'error' });
      setAppliedCoupon(null);
      return;
    }

    if (orderTotal < coupon.minPurchase) {
      setCouponFeedback({
        text: t('coupon_min_purchase', { amount: formatPrice(coupon.minPurchase) }),
        type: 'error'
      });
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponFeedback({ text: t('coupon_success'), type: 'success' });
  };

  const cardBrand = detectCardBrand(formData.cardNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCardError('');

    if (!validateLuhn(formData.cardNumber)) {
      setCardError('Número de tarjeta inválido (Fallo de suma de comprobación Luhn).');
      return;
    }

    // Generate simulated OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpInput('');
    setOtpError('');
    setStep('3ds');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError('');

    if (otpInput !== generatedOtp) {
      setOtpError(language === 'es' ? 'Código de verificación OTP incorrecto. Reintente.' : 'Incorrect OTP verification code. Try again.');
      return;
    }

    setStep('loading');
    setTimeout(async () => {
      try {
        const order = await placeOrder({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          discount: discountAmount
        }, total);
        setCompletedOrder(order);
        setStep('success');
      } catch (error) {
        console.error('Error placing order:', error);
        setOtpError(language === 'es' ? 'Error al procesar el pedido. Por favor intente nuevamente.' : 'Error processing order. Please try again.');
        setStep('3ds');
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={step === 'success' ? onClose : undefined}
      />

      <div className={`relative w-full max-w-2xl overflow-hidden border shadow-2xl transition-all duration-300 rounded-2xl ${currentTheme.colors.cardBg}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-500/10 flex items-center justify-between">
          <h2 className={`text-lg font-bold ${currentTheme.fontHeading}`}>
            {step === 'success' ? t('checkout_success') : t('checkout_title')}
          </h2>
          {step !== 'loading' && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-500/15 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto scrollbar-none">
          
          {/* STEP 1: Form & Order Summary */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-6">
              
              {/* Checkout Form */}
              <div className="md:col-span-3 flex flex-col gap-4">
                <h3 className="text-sm font-bold opacity-80 border-b border-slate-500/10 pb-2">{t('shipping_info')}</h3>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('full_name')}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                      setFormData(prev => ({ ...prev, name: val }));
                    }}
                    className={`w-full px-4 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('email_address')}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('address_label')}</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                    placeholder="Av. Diagonal 456, Depto 3B"
                  />
                </div>

                <h3 className="text-sm font-bold opacity-80 border-b border-slate-500/10 pb-2 mt-2 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" />
                  <span>{t('payment_info')}</span>
                </h3>

                <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('card_number')}</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          maxLength={19}
                          value={formData.cardNumber}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').substring(0, 16);
                            const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
                            setFormData(prev => ({ ...prev, cardNumber: formatted }));
                            setCardError('');
                          }}
                          className={`w-full pl-4 pr-16 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                          placeholder="4000 1234 5678 9010"
                        />
                        {cardBrand && (
                          <span className="absolute right-3 px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/20 text-[9px] font-black uppercase tracking-wider text-cyan-400">
                            {cardBrand}
                          </span>
                        )}
                      </div>
                      {cardError && (
                        <span className="text-[10px] text-red-400 mt-1 font-semibold">{cardError}</span>
                      )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{language === 'es' ? 'Vencimiento' : 'Expiry'}</label>
                    <input
                      type="text"
                      name="expiry"
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => {
                        let digits = e.target.value.replace(/\D/g, '').substring(0, 4);
                        if (digits.length > 2) {
                          digits = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
                        }
                        setFormData(prev => ({ ...prev, expiry: digits }));
                      }}
                      className={`w-full px-4 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('cvv_label')}</label>
                    <input
                      type="password"
                      name="cvv"
                      required
                      maxLength={3}
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').substring(0, 3);
                        setFormData(prev => ({ ...prev, cvv: digits }));
                      }}
                      className={`w-full px-4 py-2 border rounded-lg text-sm outline-none transition-all ${currentTheme.colors.input}`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-500/10 bg-slate-500/5 text-xs opacity-80 mt-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{t('secure_checkout')}</span>
                </div>
              </div>

              {/* Order Summary sidebar */}
              <div className="md:col-span-2 flex flex-col gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-500/10 h-fit">
                <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">{t('order_summary')}</h3>
                
                <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center gap-2 text-xs">
                      <span className="line-clamp-1 flex-1">{item.product.name} <span className="opacity-60">x{item.quantity}</span></span>
                      <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code input row */}
                <div className="border-t border-slate-500/10 pt-3 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder={t('coupon_placeholder')}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase().replace(/[^a-zA-Z0-9]/g, ''))}
                      className={`flex-1 px-3 py-1.5 border rounded-lg text-xs outline-none bg-slate-950/20 border-slate-500/15`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className={`px-3 py-1.5 bg-slate-500/10 hover:bg-slate-500/15 border border-slate-500/15 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all`}
                    >
                      {t('apply_coupon')}
                    </button>
                  </div>
                  {couponFeedback && (
                    <span className={`text-[10px] ${
                      couponFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {couponFeedback.text}
                    </span>
                  )}
                </div>

                <div className="border-t border-slate-500/10 pt-3 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="opacity-60">{t('subtotal')}</span>
                    <span>{formatPrice(orderTotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>{language === 'es' ? 'Descuento' : 'Discount'} ({appliedCoupon?.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  {appliedCoupon && appliedCoupon.type === 'shipping' && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>{language === 'es' ? 'Envío Gratis' : 'Free Shipping'} ({appliedCoupon.code})</span>
                      <span>{t('shipping_free')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="opacity-60">{t('shipping')}</span>
                    <span>{shippingFee === 0 ? t('shipping_free') : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="border-t border-slate-500/10 mt-2 pt-2 flex justify-between text-sm font-black">
                    <span>Total</span>
                    <span className={`text-base ${currentTheme.fontHeading}`}>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 px-6 mt-4 font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${currentTheme.colors.button}`}
                >
                  {t('pay_btn')} • {formatPrice(total)}
                </button>
              </div>
            </form>
          )}

                    {/* STEP: 3D Secure verification */}
              {step === '3ds' && (
                <form onSubmit={handleVerifyOtp} className="py-8 max-w-md mx-auto flex flex-col gap-6 text-center animate-slide-in">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/30 text-cyan-400">
                      <Lock className="h-8 w-8 animate-pulse" />
                    </div>
                    <h3 className={`text-lg font-bold ${currentTheme.fontHeading}`}>{t('otp_auth')}</h3>
                    <p className="text-xs opacity-70 px-4">
                      {language === 'es' ? 'Tu banco requiere verificación adicional mediante código OTP para autorizar tu compra de ' : 'Your bank requires additional verification via OTP code to authorize your purchase of '} <strong>{formatPrice(total)}</strong>.
                    </p>
                  </div>

                  {/* Fictitious SMS generated display */}
                  <div className="p-4 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-950/20 text-xs flex flex-col gap-1.5 text-left">
                    <span className="opacity-60 block text-[9px] uppercase tracking-wider font-bold text-cyan-400">{language === 'es' ? 'Mensaje de Prueba Recibido (SMS)' : 'Test Message Received (SMS)'}</span>
                    <p className="opacity-95">
                      FlexCommerce-Secure: {language === 'es' ? 'Usa el código ' : 'Use code '} <strong className="text-cyan-400 font-mono text-sm tracking-widest">{generatedOtp}</strong> {language === 'es' ? ' para confirmar tu transacción por ' : ' to confirm your transaction of '} {formatPrice(total)}.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('otp_code')}</label>
                     <input 
                       type="text"
                       maxLength="6"
                       required
                       placeholder="123456"
                       value={otpInput}
                       onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').substring(0, 6))}
                       className="px-4 py-2.5 border rounded-xl text-center text-sm outline-none bg-slate-950/40 border-slate-500/20 font-mono tracking-widest text-slate-100"
                     />
                     {otpError && (
                       <span className="text-[10px] text-red-400 font-semibold mt-1">{otpError}</span>
                     )}
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 px-6 font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${currentTheme.colors.button}`}
                  >
                    {t('verify_btn')}
                  </button>
                </form>
              )}

              {/* STEP 2: Processing Payment */}
              {step === 'loading' && (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-slate-500/10 border-t-cyan-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 opacity-60 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">{t('processing_payment')}</h3>
                <p className="text-xs opacity-60 mt-1">{language === 'es' ? 'Conectando con el servidor bancario ficticio. Por favor, no recargues la página.' : 'Connecting to fictitious banking server. Please do not refresh the page.'}</p>
              </div>
            </div>
          )}

          {/* STEP 3: Order Completed successfully */}
          {step === 'success' && completedOrder && (
            <div className="flex flex-col gap-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/30 text-emerald-500">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className={`text-2xl font-black ${currentTheme.fontHeading}`}>{t('checkout_success')}</h3>
                <p className="text-xs opacity-70">{t('order_success_desc')}</p>
              </div>

              {/* Receipt Visual layout */}
              <div className="p-6 rounded-xl border border-slate-500/10 bg-slate-500/5 text-left text-xs flex flex-col gap-4 max-w-md mx-auto w-full">
                <div className="flex justify-between border-b border-slate-500/10 pb-3">
                  <div>
                    <span className="opacity-60 block text-[9px] uppercase tracking-wider">{language === 'es' ? 'Número de Pedido' : 'Order Number'}</span>
                    <span className="font-mono font-bold text-sm">{completedOrder.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="opacity-60 block text-[9px] uppercase tracking-wider">{language === 'es' ? 'Fecha' : 'Date'}</span>
                    <span className="font-bold">{completedOrder.date}</span>
                  </div>
                </div>

                <div>
                  <span className="opacity-60 block text-[9px] uppercase tracking-wider mb-2">{language === 'es' ? 'Destinatario' : 'Recipient'}</span>
                  <div className="font-semibold">{completedOrder.customer.name}</div>
                  <div className="opacity-80 mt-0.5">{completedOrder.customer.address}</div>
                </div>

                <div className="border-t border-b border-slate-500/10 py-3 flex flex-col gap-2">
                  <span className="opacity-60 block text-[9px] uppercase tracking-wider mb-1">{language === 'es' ? 'Detalle' : 'Details'}</span>
                  {completedOrder.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="opacity-85">{item.product.name} <span className="opacity-60">x{item.quantity}</span></span>
                      <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm font-bold">
                  <span>{language === 'es' ? 'Total pagado' : 'Total paid'}</span>
                  <span className="text-base font-black">{formatPrice(completedOrder.total)}</span>
                </div>
              </div>

              <div className="flex gap-4 max-w-md mx-auto w-full pt-4">
                <button
                  onClick={() => window.print()}
                  className={`flex-1 py-3 px-6 flex items-center justify-center gap-2 border text-xs font-bold uppercase tracking-wider rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${currentTheme.colors.buttonSecondary}`}
                >
                  <Printer className="h-4 w-4" />
                  <span>{language === 'es' ? 'Imprimir Recibo' : 'Print Receipt'}</span>
                </button>
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 px-6 text-xs font-bold uppercase tracking-wider rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${currentTheme.colors.button}`}
                >
                  {language === 'es' ? 'Continuar' : 'Continue'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
