import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Check, Mail, Landmark, Tag, Trash2, Plus } from 'lucide-react';

export default function SettingsTab() {
  const { 
    currency, 
    setCurrency, 
    contactEmail, 
    setContactEmail,
    coupons,
    addCoupon,
    deleteCoupon,
    formatPrice,
    language
  } = useStore();

  const [saved, setSaved] = useState(false);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [globalFreeShipping, setGlobalFreeShipping] = useState(false);

  // Form states for new coupon
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('percent'); // 'percent', 'fixed', 'shipping'
  const [newValue, setNewValue] = useState('');
  const [newMinPurchase, setNewMinPurchase] = useState('');
  const [creationError, setCreationError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    setCreationError('');

    if (!newCode.trim()) {
      setCreationError('El código del cupón es obligatorio.');
      return;
    }

    // Check duplicate
    const exists = coupons.some(c => c.code.toUpperCase() === newCode.trim().toUpperCase());
    if (exists) {
      setCreationError('Ya existe un cupón registrado con ese código.');
      return;
    }

    addCoupon({
      code: newCode.toUpperCase().trim(),
      type: newType,
      value: newType === 'shipping' ? 0 : parseFloat(newValue) || 0,
      minPurchase: parseFloat(newMinPurchase) || 0
    });

    // Reset form
    setNewCode('');
    setNewValue('');
    setNewMinPurchase('');
  };

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      {/* Intro */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="h-5 w-5 text-cyan-500" />
          <span>Configuración del Comercio</span>
        </h2>
        <p className="text-xs opacity-60 mt-1">Modifica los ajustes técnicos, la moneda predeterminada y las políticas de cobro.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        
        {/* Core fields */}
        <div className="p-6 border border-slate-800 bg-slate-900/30 rounded-2xl flex flex-col gap-5">
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Landmark className="h-4 w-4 text-cyan-400" />
            <span>Moneda y Fiscalidad</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60">Símbolo Monetario</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-sm outline-none transition-all text-slate-100"
              >
                <option value="$">Dólar ($)</option>
                <option value="€">Euro (€)</option>
                <option value="£">Libra (£)</option>
                <option value="MXN$">Peso Mexicano (MXN$)</option>
                <option value="CLP$">Peso Chileno (CLP$)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60">Email del Comercio</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-sm outline-none transition-all text-slate-100"
                  placeholder="admin@tienda.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="p-6 border border-slate-800 bg-slate-900/30 rounded-2xl flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 border-b border-slate-800 pb-2">Reglas de Envío y Impuestos (Simulados)</h3>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-850">
            <div className="flex flex-col gap-0.5 max-w-[70%]">
              <span className="text-xs font-bold text-slate-200">Impuestos Activos (IVA/VAT)</span>
              <span className="text-[10px] opacity-50">Aplica impuestos del 16% al finalizar la compra de forma ficticia.</span>
            </div>
            <button
              type="button"
              onClick={() => setTaxEnabled(!taxEnabled)}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative border cursor-pointer ${
                taxEnabled ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-slate-950 absolute top-0.5 transition-all duration-300 ${
                taxEnabled ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-850">
            <div className="flex flex-col gap-0.5 max-w-[70%]">
              <span className="text-xs font-bold text-slate-200">Envío Gratuito Global</span>
              <span className="text-[10px] opacity-50">Omite la tarifa de envío base para cualquier compra, sin mínimo requerido.</span>
            </div>
            <button
              type="button"
              onClick={() => setGlobalFreeShipping(!globalFreeShipping)}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative border cursor-pointer ${
                globalFreeShipping ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-slate-950 absolute top-0.5 transition-all duration-300 ${
                globalFreeShipping ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-8">
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 active:scale-95 transition-all"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span>Configuración Guardada</span>
              </>
            ) : (
              <span>Guardar Ajustes</span>
            )}
          </button>
        </div>
      </form>

      {/* DISCOUNT COUPONS MANAGEMENT */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Tag className="h-4.5 w-4.5 text-cyan-500" />
            <span>Gestión de Cupones de Descuento</span>
          </h2>
          <p className="text-[11px] opacity-60 mt-0.5">Genera promociones para rebajar subtotales de compra o bonificar envíos.</p>
        </div>

        {/* Create Coupon Form */}
        <form onSubmit={handleCreateCoupon} className="p-6 border border-slate-800 bg-slate-900/30 rounded-2xl flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-85">Nuevo Cupón de Descuento</h3>
          
          {creationError && (
            <span className="text-[11px] text-red-400 border border-red-500/20 bg-red-950/20 px-3 py-2 rounded-lg">{creationError}</span>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Código</label>
              <input 
                type="text"
                required
                placeholder="E.g. REGALO20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                className="px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs outline-none transition-all text-slate-100"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Tipo</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs outline-none transition-all text-slate-100"
              >
                <option value="percent">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ({currency})</option>
                <option value="shipping">Envío Gratis</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Valor</label>
              <input 
                type="number"
                min="0"
                disabled={newType === 'shipping'}
                required={newType !== 'shipping'}
                placeholder={newType === 'percent' ? '10' : '15.00'}
                value={newType === 'shipping' ? '' : newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs outline-none transition-all text-slate-100 disabled:opacity-40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Mín. Compra</label>
              <input 
                type="number"
                min="0"
                placeholder="0"
                value={newMinPurchase}
                onChange={(e) => setNewMinPurchase(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs outline-none transition-all text-slate-100"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="self-start px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Crear Cupón</span>
          </button>
        </form>

        {/* Coupons List */}
        <div className="border border-slate-800 bg-slate-900/10 rounded-2xl overflow-hidden">
          <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Códigos Activos ({coupons.length})</span>
          </div>

          <div className="divide-y divide-slate-850 max-h-[300px] overflow-y-auto pr-1">
            {coupons.length === 0 ? (
              <div className="p-8 text-center text-xs opacity-50">No hay cupones de descuento configurados.</div>
            ) : (
              coupons.map((coupon) => (
                <div key={coupon.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-900/20">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded text-xs font-extrabold tracking-wide font-mono">
                        {coupon.code}
                      </span>
                      <span className="text-[10px] opacity-40 uppercase font-semibold">
                        {coupon.type === 'percent' ? 'Porcentaje' : coupon.type === 'fixed' ? 'Fijo' : 'Envío Gratis'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 mt-1">
                      {coupon.type === 'percent' && (language === 'es' ? `Rebaja el ${coupon.value}% del subtotal` : `Deducts ${coupon.value}% of subtotal`)}
                      {coupon.type === 'fixed' && (language === 'es' ? `Rebaja ${formatPrice(coupon.value)} de la compra` : `Deducts ${formatPrice(coupon.value)} from order`)}
                      {coupon.type === 'shipping' && (language === 'es' ? `Costo de envío bonificado ($0)` : `Free shipping ($0)`)}
                      {coupon.minPurchase > 0 && ` • ${language === 'es' ? 'Compra mínima' : 'Min purchase'}: ${formatPrice(coupon.minPurchase)}`}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteCoupon(coupon.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar Cupón"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

