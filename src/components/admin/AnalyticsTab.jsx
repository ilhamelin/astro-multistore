import React from 'react';
import { useStore } from '../../context/StoreContext';
import { TrendingUp, Users, ShoppingBag, DollarSign, PackageOpen, Award } from 'lucide-react';

export default function AnalyticsTab() {
  const { analytics, orders, currentTheme, formatPrice } = useStore();

  // Simulated metrics
  const conversionRate = analytics.views > 0 
    ? ((analytics.salesCount / analytics.views) * 100).toFixed(2) 
    : '0.00';

  // SVG Sparkline path generator
  const sparklineData = [30, 45, 35, 60, 55, 75, 90, 85, 110, 95, 120];
  const points = sparklineData
    .map((val, index) => `${(index * 35) + 10},${120 - val}`)
    .join(' ');

  return (
    <div className="flex flex-col gap-8">
      {/* Intro */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-cyan-500" />
          <span>Métricas y Rendimiento</span>
        </h2>
        <p className="text-xs opacity-60 mt-1">Monitorea las visitas, ventas simuladas y conversión de tu tienda en tiempo real.</p>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 border border-slate-800 bg-slate-900/30 rounded-xl flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Visitas</span>
            <span className="text-2xl font-black text-slate-100 font-mono">{analytics.views}</span>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 border border-slate-800 bg-slate-900/30 rounded-xl flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Pedidos</span>
            <span className="text-2xl font-black text-slate-100 font-mono">{analytics.salesCount}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 border border-slate-800 bg-slate-900/30 rounded-xl flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Ingresos</span>
            <span className="text-2xl font-black text-slate-100 font-mono">{formatPrice(analytics.revenue)}</span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 border border-slate-800 bg-slate-900/30 rounded-xl flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Conversión</span>
            <span className="text-2xl font-black text-slate-100 font-mono">{conversionRate}%</span>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* SVG Chart Panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* SVG Graphic column */}
        <div className="lg:col-span-2 p-6 border border-slate-800 bg-slate-900/30 rounded-2xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">Tendencia de Ventas (Historial Simulado)</h3>
            <p className="text-[11px] opacity-50">Representación gráfica de las ventas acumuladas durante las últimas semanas.</p>
          </div>
          
          {/* SVG Chart */}
          <div className="w-full h-48 bg-slate-950/60 rounded-xl border border-slate-850 p-4 flex items-end relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 380 110">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="380" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="55" x2="380" y2="55" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="380" y2="90" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />

              {/* Gradient fill area */}
              <polygon
                points={`10,110 ${points} 360,110`}
                fill="url(#chartGrad)"
              />
              
              {/* Main Line */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
            <span className="absolute bottom-2 left-4 text-[9px] opacity-45 uppercase font-mono">Semana 1</span>
            <span className="absolute bottom-2 right-4 text-[9px] opacity-45 uppercase font-mono">Semana actual</span>
          </div>
        </div>

        {/* Top Product / Status */}
        <div className="p-6 border border-slate-800 bg-slate-900/30 rounded-2xl flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Estado del Comercio</span>
            </h3>
            
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-850 flex flex-col gap-0.5">
                <span className="text-[10px] opacity-50 uppercase tracking-wide">Pedidos en cola</span>
                <span className="text-base font-bold text-slate-200">{orders.filter(o => o.status === 'Procesado').length} pendientes</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-850 flex flex-col gap-0.5">
                <span className="text-[10px] opacity-50 uppercase tracking-wide">Nicho Activo</span>
                <span className="text-base font-bold text-cyan-400 capitalize">{currentTheme.id} ({currentTheme.name})</span>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] opacity-40 leading-relaxed">
            Las métricas se calculan localmente y se actualizan de forma reactiva cada vez que completas el flujo de pago en tu storefront.
          </div>
        </div>
      </div>

      {/* Recent Orders log */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-850 bg-slate-950/30 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Historial de Pedidos Recientes</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {orders.length} pedidos totales
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-slate-800 text-slate-500">
              <PackageOpen className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Aún no hay pedidos</h3>
              <p className="text-xs opacity-50 mt-1">Realiza compras ficticias desde el Storefront para poblar esta lista.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/10 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Pedido ID</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Dirección</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-300">{ord.id}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-slate-200">{ord.customer.name}</div>
                        <div className="text-[10px] opacity-50 mt-0.5">{ord.customer.email}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 truncate max-w-[150px]">{ord.customer.address}</td>
                    <td className="p-4 font-semibold text-slate-200">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[9px]">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
