import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, User, MapPin, CreditCard, ShoppingBag, 
  Receipt, Shield, Lock, Save, AlertCircle 
} from 'lucide-react';

export default function UserProfileModal() {
  const { 
    currentTheme, 
    currentUser, 
    orders,
    isProfileOpen, 
    setIsProfileOpen, 
    updateUserProfile,
    formatPrice,
    language
  } = useStore();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'shipping', 'payment', 'orders', 'billing', 'privacy', 'security'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isTabLoading, setIsTabLoading] = useState(false);

  useEffect(() => {
    setIsTabLoading(true);
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderTabSkeleton = () => {
    if (activeTab === 'orders') {
      return (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-5 w-40 bg-slate-800/40 rounded animate-shimmer" />
          <div className="h-3.5 w-64 bg-slate-800/20 rounded animate-shimmer mb-4" />
          {[1, 2].map((idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-500/10 bg-slate-500/5 flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="h-4 w-28 bg-slate-800/40 rounded animate-shimmer" />
                <div className="h-4 w-20 bg-slate-800/40 rounded animate-shimmer" />
              </div>
              <div className="border-t border-slate-500/10 pt-3 flex flex-col gap-2">
                <div className="h-3.5 w-3/4 bg-slate-800/30 rounded animate-shimmer" />
                <div className="h-3.5 w-1/2 bg-slate-800/30 rounded animate-shimmer" />
              </div>
              <div className="border-t border-slate-500/10 pt-2 flex justify-between">
                <div className="h-4 w-24 bg-slate-800/40 rounded animate-shimmer" />
                <div className="h-4 w-16 bg-slate-800/40 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6 max-w-md animate-pulse">
        <div className="flex flex-col gap-1.5">
          <div className="h-5 w-48 bg-slate-800/40 rounded animate-shimmer" />
          <div className="h-3.5 w-72 bg-slate-800/20 rounded animate-shimmer mt-1 mb-2" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-3.5 w-24 bg-slate-800/30 rounded animate-shimmer" />
            <div className="h-10 w-full bg-slate-800/20 border border-slate-500/10 rounded-xl animate-shimmer" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3.5 w-32 bg-slate-800/30 rounded animate-shimmer" />
            <div className="h-10 w-full bg-slate-800/20 border border-slate-500/10 rounded-xl animate-shimmer" />
          </div>
        </div>
        <div className="h-10 w-36 bg-slate-800/40 rounded-xl mt-2 animate-shimmer" />
      </div>
    );
  };

  // Form states initialized on render
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  });

  const [shippingForm, setShippingForm] = useState({
    address: currentUser?.shippingAddress || ''
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: currentUser?.paymentMethod?.cardNumber || '',
    expiry: currentUser?.paymentMethod?.expiry || '',
    cvv: currentUser?.paymentMethod?.cvv || ''
  });

  const [billingForm, setBillingForm] = useState({
    taxId: currentUser?.billingInfo?.taxId || '',
    legalName: currentUser?.billingInfo?.legalName || '',
    address: currentUser?.billingInfo?.address || ''
  });

  const [privacyForm, setPrivacyForm] = useState({
    marketingEmails: currentUser?.privacySettings?.marketingEmails ?? true,
    analyticsCookies: currentUser?.privacySettings?.analyticsCookies ?? true
  });

  const [securityForm, setSecurityForm] = useState({
    twoFactorEnabled: currentUser?.securitySettings?.twoFactorEnabled ?? false,
    newPassword: '',
    confirmPassword: ''
  });

  const handleNameChange = (val, setter) => {
    const cleanVal = val.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    setter(cleanVal);
  };

  const handleCardNumberChange = (val) => {
    const digits = val.replace(/\D/g, '').substring(0, 16);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    setPaymentForm(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (val) => {
    let digits = val.replace(/\D/g, '').substring(0, 4);
    if (digits.length > 2) {
      digits = digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    setPaymentForm(prev => ({ ...prev, expiry: digits }));
  };

  const handleCVVChange = (val) => {
    const digits = val.replace(/\D/g, '').substring(0, 3);
    setPaymentForm(prev => ({ ...prev, cvv: digits }));
  };

  const handleTaxIdChange = (val) => {
    const cleanVal = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 15);
    setBillingForm(prev => ({ ...prev, taxId: cleanVal }));
  };

  if (!isProfileOpen || !currentUser) return null;

  // Filter orders matching this user
  const userOrders = orders.filter(
    (o) => 
      o.userId === currentUser.id || 
      o.customer?.email?.toLowerCase() === currentUser.email?.toLowerCase()
  );

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const res = await updateUserProfile({ name: profileForm.name });
    if (res.success) {
      setSuccessMsg('Información de perfil actualizada con éxito.');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleSaveShipping = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const res = await updateUserProfile({ shippingAddress: shippingForm.address });
    if (res.success) {
      setSuccessMsg('Dirección de envío guardada.');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const res = await updateUserProfile({ 
      paymentMethod: { ...paymentForm } 
    });
    if (res.success) {
      setSuccessMsg('Método de pago guardado para futuras compras.');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleSaveBilling = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const res = await updateUserProfile({ 
      billingInfo: { ...billingForm } 
    });
    if (res.success) {
      setSuccessMsg('Detalles de facturación actualizados.');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleSavePrivacy = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const res = await updateUserProfile({ 
      privacySettings: { ...privacyForm } 
    });
    if (res.success) {
      setSuccessMsg('Ajustes de privacidad guardados.');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (securityForm.newPassword) {
      if (securityForm.newPassword.length < 6) {
        setErrorMsg('La contraseña nueva debe tener al menos 6 caracteres.');
        return;
      }
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden.');
        return;
      }
      // Simulate password update
      setSuccessMsg('Contraseña actualizada con éxito.');
    }

    const res = await updateUserProfile({ 
      securitySettings: { twoFactorEnabled: securityForm.twoFactorEnabled } 
    });
    if (res.success && !errorMsg) {
      setSuccessMsg('Ajustes de seguridad actualizados.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'shipping', label: 'Envío', icon: MapPin },
    { id: 'payment', label: 'Pago Guardado', icon: CreditCard },
    { id: 'orders', label: 'Mis Pedidos', icon: ShoppingBag },
    { id: 'billing', label: 'Facturación', icon: Receipt },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'security', label: 'Seguridad', icon: Lock },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsProfileOpen(false)}
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-4xl h-[85vh] rounded-3xl border flex flex-col md:flex-row overflow-hidden shadow-2xl transition-all duration-300 ${currentTheme.colors.cardBg}`}>
        
        {/* Header (Close Button Mobile) */}
        <button
          onClick={() => setIsProfileOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-500/15 transition-colors cursor-pointer text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Sidebar Nav */}
        <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-500/10 p-6 flex flex-col justify-between shrink-0 bg-slate-950/20">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className={`text-base font-bold truncate leading-tight ${currentTheme.fontHeading}`}>{currentUser.name}</h3>
              <p className="text-[10px] opacity-50 tracking-wider truncate uppercase mt-0.5">{currentUser.email}</p>
            </div>
            
            <nav className="flex flex-col gap-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      isActive 
                        ? `bg-gradient-to-r ${currentTheme.colors.primary} text-white shadow-lg` 
                        : 'opacity-70 hover:opacity-100 hover:bg-slate-500/5'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Body */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between scrollbar-none">
          <div className="flex-1 flex flex-col justify-center">
            
            {/* Notifications */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {isTabLoading ? (
              renderTabSkeleton()
            ) : (
              <>
                {/* TAB: PROFILE */}
                {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 max-w-md">
                <div>
                  <h4 className={`text-lg font-bold ${currentTheme.fontHeading}`}>Información de Perfil</h4>
                  <p className="text-xs opacity-60 mt-1">Actualiza tus datos de contacto básicos.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Nombre Completo</label>
                    <input 
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => handleNameChange(e.target.value, (name) => setProfileForm(prev => ({ ...prev, name })))}
                      className={`px-4 py-2.5 border rounded-xl text-xs outline-none bg-slate-950/40 border-slate-500/20`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Correo Electrónico (Solo Lectura)</label>
                    <input 
                      type="email"
                      readOnly
                      disabled
                      value={profileForm.email}
                      className="px-4 py-2.5 border rounded-xl text-xs outline-none bg-slate-500/5 border-slate-500/10 opacity-50 select-none"
                    />
                  </div>
                </div>
                <button type="submit" className={`self-start flex items-center gap-1.5 py-2.5 px-6 rounded-xl text-xs font-bold cursor-pointer transition-colors ${currentTheme.colors.button}`}>
                  <Save className="h-4 w-4" />
                  <span>Guardar Cambios</span>
                </button>
              </form>
            )}

            {/* TAB: SHIPPING */}
            {activeTab === 'shipping' && (
              <form onSubmit={handleSaveShipping} className="flex flex-col gap-6 max-w-md">
                <div>
                  <h4 className={`text-lg font-bold ${currentTheme.fontHeading}`}>Dirección de Envío</h4>
                  <p className="text-xs opacity-60 mt-1">Guarda tu dirección para auto-completar al comprar.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Dirección de Entrega</label>
                  <textarea 
                    rows="3"
                    required
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({ address: e.target.value })}
                    placeholder="Calle, Número, Ciudad, Estado, Código Postal..."
                    className={`px-4 py-2.5 border rounded-xl text-xs outline-none resize-none bg-slate-950/40 border-slate-500/20`}
                  />
                </div>
                <button type="submit" className={`self-start flex items-center gap-1.5 py-2.5 px-6 rounded-xl text-xs font-bold cursor-pointer transition-colors ${currentTheme.colors.button}`}>
                  <Save className="h-4 w-4" />
                  <span>Guardar Dirección</span>
                </button>
              </form>
            )}

            {/* TAB: PAYMENT */}
            {activeTab === 'payment' && (
              <form onSubmit={handleSavePayment} className="flex flex-col gap-6 max-w-md">
                <div>
                  <h4 className={`text-lg font-bold ${currentTheme.fontHeading}`}>Método de Pago Predeterminado</h4>
                  <p className="text-xs opacity-60 mt-1">Guarda tu tarjeta simulada de forma segura.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Número de Tarjeta</label>
                    <input 
                      type="text"
                      maxLength="19"
                      placeholder="1234 5678 1234 5678"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className={`px-4 py-2.5 border rounded-xl text-xs outline-none bg-slate-950/40 border-slate-500/20`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Vencimiento</label>
                      <input 
                        type="text"
                        maxLength="5"
                        placeholder="MM/AA"
                        value={paymentForm.expiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        className={`px-4 py-2.5 border rounded-xl text-xs outline-none bg-slate-950/40 border-slate-500/20`}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">CVV</label>
                      <input 
                        type="password"
                        maxLength="3"
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => handleCVVChange(e.target.value)}
                        className={`px-4 py-2.5 border rounded-xl text-xs outline-none bg-slate-950/40 border-slate-500/20`}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className={`self-start flex items-center gap-1.5 py-2.5 px-6 rounded-xl text-xs font-bold cursor-pointer transition-colors ${currentTheme.colors.button}`}>
                  <Save className="h-4 w-4" />
                  <span>Guardar Tarjeta</span>
                </button>
              </form>
            )}

            {/* TAB: ORDERS HISTORY */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className={`text-lg font-bold ${currentTheme.fontHeading}`}>Historial de Pedidos</h4>
                  <p className="text-xs opacity-60 mt-1">Revisa el estado de tus compras anteriores.</p>
                </div>
                
                {userOrders.length === 0 ? (
                  <div className="py-12 border border-slate-500/10 rounded-2xl bg-slate-500/5 text-center flex flex-col items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-slate-500 opacity-50" />
                    <p className="text-xs opacity-60">No has realizado ninguna compra todavía.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-none">
                    {userOrders.map((order) => (
                      <div key={order.id} className="p-4 rounded-2xl border border-slate-500/10 bg-slate-500/5 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-extrabold text-cyan-400">#{order.id}</span>
                            <span className="mx-2 opacity-30">|</span>
                            <span className="opacity-60">{order.date}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {order.status}
                          </span>
                        </div>
                        <div className="border-t border-slate-500/10 pt-2.5">
                          <ul className="text-xs flex flex-col gap-1 text-slate-300">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between">
                                <span>{item.product.name} <strong className="opacity-50">x{item.quantity}</strong></span>
                                <span>{formatPrice(item.product.price * item.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-t border-slate-500/10 pt-2 flex justify-between items-center text-xs">
                          <span className="font-bold">{language === 'es' ? 'Total Pagado:' : 'Total Paid:'}</span>
                          <span className="text-sm font-black text-inherit">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: BILLING */}
            {activeTab === 'billing' && (
              <form onSubmit={handleSaveBilling} className="flex flex-col gap-6 max-w-md">
                <div>
                  <h4 className={`text-lg font-bold ${currentTheme.fontHeading}`}>Datos de Facturación</h4>
                  <p className="text-xs opacity-60 mt-1">Configura tus identificaciones fiscales para emitir facturas.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Identificación Fiscal (RFC / RUC / RUT)</label>
                    <input 
                      type="text"
                      required
                      placeholder="ABC123456XYZ"
                      value={billingForm.taxId}
                      onChange={(e) => handleTaxIdChange(e.target.value)}
                      className={`px-4 py-2.5 border rounded-xl text-xs outline-none bg-slate-950/40 border-slate-500/20`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Nombre Legal / Razón Social</label>
                    <input 
                      type="text"
                      required
                      placeholder="Empresa S.A."
                      value={billingForm.legalName}
                      onChange={(e) => handleNameChange(e.target.value, (legalName) => setBillingForm(prev => ({ ...prev, legalName })))}
                      className={`px-4 py-2.5 border rounded-xl text-xs outline-none bg-slate-950/40 border-slate-500/20`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Dirección Fiscal</label>
                    <input 
                      type="text"
                      required
                      value={billingForm.address}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, address: e.target.value }))}
                      className={`px-4 py-2.5 border rounded-xl text-xs outline-none bg-slate-950/40 border-slate-500/20`}
                    />
                  </div>
                </div>
                <button type="submit" className={`self-start flex items-center gap-1.5 py-2.5 px-6 rounded-xl text-xs font-bold cursor-pointer transition-colors ${currentTheme.colors.button}`}>
                  <Save className="h-4 w-4" />
                  <span>Guardar Facturación</span>
                </button>
              </form>
            )}

            {/* TAB: PRIVACY */}
            {activeTab === 'privacy' && (
              <form onSubmit={handleSavePrivacy} className="flex flex-col gap-6 max-w-md">
                <div>
                  <h4 className={`text-lg font-bold ${currentTheme.fontHeading}`}>Ajustes de Privacidad</h4>
                  <p className="text-xs opacity-60 mt-1">Gestiona el tratamiento de tus datos personales.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-500/10 bg-slate-500/5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={privacyForm.marketingEmails}
                      onChange={(e) => setPrivacyForm(prev => ({ ...prev, marketingEmails: e.target.checked }))}
                      className="accent-cyan-500 h-4 w-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Correos Promocionales</span>
                      <span className="text-[10px] opacity-60 mt-0.5">Deseo recibir ofertas exclusivas y novedades comerciales en mi bandeja.</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-500/10 bg-slate-500/5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={privacyForm.analyticsCookies}
                      onChange={(e) => setPrivacyForm(prev => ({ ...prev, analyticsCookies: e.target.checked }))}
                      className="accent-cyan-500 h-4 w-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Cookies de Análisis</span>
                      <span className="text-[10px] opacity-60 mt-0.5">Permitir guardar métricas anónimas para mejorar la experiencia de la tienda.</span>
                    </div>
                  </label>
                </div>
                <button type="submit" className={`self-start flex items-center gap-1.5 py-2.5 px-6 rounded-xl text-xs font-bold cursor-pointer transition-colors ${currentTheme.colors.button}`}>
                  <Save className="h-4 w-4" />
                  <span>Guardar Preferencias</span>
                </button>
              </form>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <form onSubmit={handleSaveSecurity} className="flex flex-col gap-6 max-w-md">
                <div>
                  <h4 className={`text-lg font-bold ${currentTheme.fontHeading}`}>Ajustes de Seguridad</h4>
                  <p className="text-xs opacity-60 mt-1">Protege el acceso a tu cuenta.</p>
                </div>
                <div className="flex flex-col gap-5">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-500/10 bg-slate-500/5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={securityForm.twoFactorEnabled}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                      className="accent-cyan-500 h-4 w-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Autenticación de Dos Factores (2FA)</span>
                      <span className="text-[10px] opacity-60 mt-0.5">Solicitar un código OTP adicional en cada inicio de sesión.</span>
                    </div>
                  </label>

                  <div className="border-t border-slate-500/10 pt-4 flex flex-col gap-3">
                    <span className="text-xs font-bold">Cambiar Contraseña</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold opacity-60 uppercase">Nueva Contraseña</label>
                        <input 
                          type="password"
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="px-3 py-2 border rounded-xl text-xs outline-none bg-slate-950/40 border-slate-500/20"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold opacity-60 uppercase">Confirmar Contraseña</label>
                        <input 
                          type="password"
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="px-3 py-2 border rounded-xl text-xs outline-none bg-slate-950/40 border-slate-500/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className={`self-start flex items-center gap-1.5 py-2.5 px-6 rounded-xl text-xs font-bold cursor-pointer transition-colors ${currentTheme.colors.button}`}>
                  <Save className="h-4 w-4" />
                  <span>Actualizar Seguridad</span>
                </button>
              </form>
            )}
          </>
        )}

          </div>
        </div>

      </div>
    </div>
  );
}

// Inline CheckCircle component since Lucide-react CheckCircle may differ
function CheckCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}
