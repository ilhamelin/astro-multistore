import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PRESETS } from '../../mockData';
import { Check, Palette, Sparkles, AlertCircle } from 'lucide-react';

export default function CustomizeTab() {
  const { 
    activeThemeId, 
    currentTheme, 
    storeName, 
    setStoreName, 
    storeSlogan, 
    setStoreSlogan, 
    switchTheme,
    customHeroImage,
    setCustomHeroImage,
    customHeroDescription,
    setCustomHeroDescription,
    promoBarEnabled,
    setPromoBarEnabled,
    promoBarText,
    setPromoBarText,
    promoBarColor,
    setPromoBarColor,
    language,
    t
  } = useStore();

  const SUGGESTED_HERO_IMAGES = {
    tech: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=1600'
    ],
    bakery: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&q=80&w=1600'
    ],
    luxury: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600'
    ],
    eco: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600'
    ]
  };

  const PROMO_BAR_STYLES = [
    { name: 'Amber Glow', class: 'bg-amber-500 text-slate-950 font-bold' },
    { name: 'Cyber Ticker', class: 'bg-slate-950 border-b border-cyan-500/20 text-cyan-400 font-mono font-bold' },
    { name: 'Emerald Mint', class: 'bg-emerald-600 text-white font-bold' },
    { name: 'Sunset Rose', class: 'bg-rose-500 text-white font-bold' },
    { name: 'Indigo Violet', class: 'bg-indigo-650 text-white font-bold' }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Introduction */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Palette className="h-5 w-5 text-cyan-500" />
          <span>Personalización Visual</span>
        </h2>
        <p className="text-xs opacity-60 mt-1">Cambia instantáneamente la estética, colores, fuentes y catálogo base de tu tienda seleccionando una plantilla preestablecida.</p>
      </div>

      {/* Preset Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(PRESETS).map((preset) => {
          const isActive = preset.id === activeThemeId;
          return (
            <button
              key={preset.id}
              onClick={() => switchTheme(preset.id)}
              className={`p-4 border rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02] cursor-pointer ${
                isActive 
                  ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500 shadow-md shadow-cyan-950/30' 
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex justify-between items-start w-full gap-2">
                <span className={`text-base font-extrabold uppercase tracking-wide font-mono ${isActive ? 'text-cyan-400' : 'text-slate-200'}`}>
                  {preset.name}
                </span>
                {isActive && (
                  <span className="p-1 rounded-full bg-cyan-500 text-slate-950 shrink-0">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              
              <p className="text-xs opacity-60 mt-2 mb-4 line-clamp-2 leading-relaxed">
                {preset.slogan}
              </p>

              {/* Color dots preview */}
              <div className="flex items-center gap-1.5 mt-auto">
                <div className={`h-4 w-4 rounded-full bg-gradient-to-tr ${preset.colors.primary}`} title="Principal" />
                <div className="h-4 w-4 rounded-full border border-slate-700 bg-slate-950" title="Fondo" />
                <span className="text-[10px] opacity-40 ml-1 uppercase font-mono">
                  {preset.id}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 rounded-xl border border-amber-800/40 bg-amber-950/15 text-xs text-amber-300 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
        <div>
          <span className="font-bold">Nota importante:</span> Cambiar de plantilla cargará el catálogo y estilo base correspondiente. Puedes personalizar el nombre y el eslogan debajo sin perder tu configuración de plantilla activa.
        </div>
      </div>

      {/* Brand Form Customizer */}
      <div className="p-6 border border-slate-800 bg-slate-900/30 rounded-2xl flex flex-col gap-5">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 border-b border-slate-800 pb-2">Información de Marca</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Nombre Comercial</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-sm outline-none transition-all text-slate-100"
              placeholder={currentTheme.name}
            />
            <span className="text-[10px] opacity-40">Se muestra en la cabecera, correos y facturas de tu comercio.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Eslogan o Lema</label>
            <input
              type="text"
              value={storeSlogan}
              onChange={(e) => setStoreSlogan(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-sm outline-none transition-all text-slate-100"
              placeholder={currentTheme.slogan}
            />
            <span className="text-[10px] opacity-40">Aparece en el banner principal (Hero) de la página de inicio.</span>
          </div>
        </div>
      </div>

      {/* ADVANCED VISUAL CUSTOMIZER FOR LANDING & HERO */}
      <div className="p-6 border border-slate-800 bg-slate-900/30 rounded-2xl flex flex-col gap-6">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 border-b border-slate-800 pb-2">
          {t('personalizer_title') || 'Personalizador Visual de la Landing'}
        </h3>

        {/* Hero Background image customizer */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">
              {t('hero_image_label')}
            </label>
            <input
              type="text"
              value={customHeroImage}
              onChange={(e) => setCustomHeroImage(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs outline-none transition-all text-slate-100 font-mono"
              placeholder={t('custom_url_placeholder')}
            />
            {customHeroImage && (
              <button
                type="button"
                onClick={() => setCustomHeroImage('')}
                className="text-[10px] text-red-400 font-bold self-start mt-0.5 hover:underline cursor-pointer"
              >
                {language === 'es' ? 'Restaurar imagen por defecto' : 'Restore default image'}
              </button>
            )}
          </div>

          {/* Quick Select Thumbnails */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
              {t('quick_select_images')}
            </span>
            <div className="grid grid-cols-3 gap-3">
              {(SUGGESTED_HERO_IMAGES[activeThemeId] || SUGGESTED_HERO_IMAGES.tech).map((imgUrl, idx) => {
                const isSelected = customHeroImage === imgUrl || (!customHeroImage && idx === 0 && imgUrl === currentTheme.heroImage);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomHeroImage(imgUrl)}
                    className={`relative aspect-[16/9] rounded-xl overflow-hidden border-2 cursor-pointer transition-all active:scale-95 ${
                      isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-transparent" />
                    {isSelected && (
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 text-[9px] font-extrabold uppercase">
                        {language === 'es' ? 'Activo' : 'Active'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hero description text area */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider opacity-60">
            {t('hero_description_label')}
          </label>
          <textarea
            value={customHeroDescription}
            onChange={(e) => setCustomHeroDescription(e.target.value)}
            className="px-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs outline-none transition-all text-slate-100 h-20"
            placeholder={t('hero_description', { theme: currentTheme.name })}
          />
          {customHeroDescription && (
            <button
              type="button"
              onClick={() => setCustomHeroDescription('')}
              className="text-[10px] text-red-400 font-bold self-start mt-0.5 hover:underline cursor-pointer"
            >
              {language === 'es' ? 'Restaurar descripción por defecto' : 'Restore default description'}
            </button>
          )}
        </div>

        {/* Ribbon Promo Ticker Ribbon Customizer */}
        <div className="border-t border-slate-800 pt-5 flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-850">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-slate-200">{t('promo_bar_label')}</span>
              <span className="text-[10px] opacity-50">{t('promo_bar_toggle')}</span>
            </div>
            <button
              type="button"
              onClick={() => setPromoBarEnabled(!promoBarEnabled)}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative border cursor-pointer ${
                promoBarEnabled ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-slate-950 absolute top-0.5 transition-all duration-300 ${
                promoBarEnabled ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>

          {promoBarEnabled && (
            <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('promo_bar_text_label')}</label>
                <input
                  type="text"
                  value={promoBarText}
                  onChange={(e) => setPromoBarText(e.target.value)}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs outline-none transition-all text-slate-100"
                  placeholder={language === 'es' ? '🚀 ¡Envío gratis inmediato para compras superiores a 100.00!' : '🚀 Free immediate shipping for purchases over 100.00!'}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('promo_bar_style_label')}</label>
                <div className="flex flex-wrap gap-2">
                  {PROMO_BAR_STYLES.map((style) => {
                    const isSelected = promoBarColor === style.class;
                    return (
                      <button
                        key={style.name}
                        type="button"
                        onClick={() => setPromoBarColor(style.class)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${style.class} ${
                          isSelected ? 'ring-2 ring-cyan-500 scale-105 border-cyan-400' : 'border-slate-800 opacity-80 hover:opacity-100'
                        }`}
                      >
                        {style.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Theme elements preview */}
      <div className="p-6 border border-slate-800 bg-slate-900/30 rounded-2xl flex flex-col gap-5">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 border-b border-slate-800 pb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>Vista Previa de Componentes en Vivo ({currentTheme.name})</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Buttons preview */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">Botones</span>
            <div className="flex flex-wrap gap-3 items-center">
              <button className={`${currentTheme.colors.button} px-4 py-2 text-xs cursor-default`}>
                Botón Principal
              </button>
              <button className={`${currentTheme.colors.buttonSecondary} px-4 py-2 text-xs rounded-full cursor-default`}>
                Botón Secundario
              </button>
            </div>
          </div>

          {/* Alert badges and inputs preview */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">Tags y Inputs</span>
            <div className="flex gap-4 items-center">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${currentTheme.colors.accent}`}>
                CATEGORÍA EJEMPLO
              </span>
              <input
                type="text"
                disabled
                placeholder="Entrada de texto..."
                className={`px-3 py-1 border text-xs outline-none w-36 ${currentTheme.colors.input}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
