import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Receipt, Search, Eye, Mail, Printer, X, 
  Trash2, ShoppingBag, DollarSign, Clock, CheckCircle, Ship, Ban
} from 'lucide-react';

export default function OrdersTab() {
  const { orders, updateOrderStatus, deleteOrder, formatPrice, language, t } = useStore();
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal Drawer State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Stats calculations
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Procesado' || o.status === 'Processed').length;

  // Filter orders
  const filteredOrders = orders.filter(ord => {
    const customerName = ord.customer?.name || '';
    const customerEmail = ord.customer?.email || '';
    const matchesSearch = 
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Handle normalized status check (in database it might be stored as "Processed" or "Procesado")
    const orderStatus = ord.status || '';
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      const isProcessed = statusFilter === 'processed' && (orderStatus === 'Procesado' || orderStatus === 'Processed');
      const isShipped = statusFilter === 'shipped' && (orderStatus === 'Enviado' || orderStatus === 'Shipped');
      const isDelivered = statusFilter === 'delivered' && (orderStatus === 'Entregado' || orderStatus === 'Delivered');
      const isCancelled = statusFilter === 'cancelled' && (orderStatus === 'Cancelado' || orderStatus === 'Cancelled');
      matchesStatus = isProcessed || isShipped || isDelivered || isCancelled;
    }

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetails = (ord) => {
    setSelectedOrder(ord);
    setSelectedStatus(ord.status);
  };

  const handleUpdateStatusClick = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, selectedStatus);
      setSelectedOrder(prev => ({ ...prev, status: selectedStatus }));
    }
  };

  const handleSimulateEmail = () => {
    if (selectedOrder) {
      const email = selectedOrder.customer?.email || 'cliente@tienda.com';
      alert(t('email_sent_toast', { email }));
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // Status Badge Formatter
  const renderStatusBadge = (status) => {
    const normalized = (status || '').toLowerCase();
    const isProcessed = normalized === 'procesado' || normalized === 'processed';
    const isShipped = normalized === 'enviado' || normalized === 'shipped';
    const isDelivered = normalized === 'entregado' || normalized === 'delivered';
    const isCancelled = normalized === 'cancelado' || normalized === 'cancelled';

    if (isProcessed) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
          <Clock className="h-3 w-3" />
          <span>{language === 'es' ? 'Procesando' : 'Processing'}</span>
        </span>
      );
    }
    if (isShipped) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 w-fit">
          <Ship className="h-3 w-3" />
          <span>{t('order_status_shipped')}</span>
        </span>
      );
    }
    if (isDelivered) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
          <CheckCircle className="h-3 w-3" />
          <span>{t('order_status_delivered')}</span>
        </span>
      );
    }
    if (isCancelled) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 w-fit">
          <Ban className="h-3 w-3" />
          <span>{t('order_status_cancelled')}</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-slate-500/10 text-slate-400 border border-slate-500/20 flex items-center gap-1 w-fit">
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Dynamic CSS Print Overrides */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-invoice-area, #print-invoice-area * {
            visibility: visible;
          }
          #print-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-cyan-500" />
            <span>{t('orders_management') || 'Gestión de Pedidos'}</span>
          </h2>
          <p className="text-xs opacity-60 mt-1">
            {language === 'es' 
              ? 'Controla los envíos, estados de cobro y emite facturas de compras de tus clientes.' 
              : 'Track shipping, payment status and generate purchase invoices for your customers.'}
          </p>
        </div>

        {/* Metric widgets */}
        <div className="grid grid-cols-3 gap-3 select-none shrink-0 w-full sm:w-auto">
          <div className="px-4 py-2 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] opacity-40 uppercase font-mono">{t('orders_total_count')}</span>
              <span className="text-xs font-black text-slate-100 font-mono">{totalOrdersCount}</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] opacity-40 uppercase font-mono">{language === 'es' ? 'Facturado' : 'Revenue'}</span>
              <span className="text-xs font-black text-slate-100 font-mono truncate max-w-[80px]">{formatPrice(totalRevenue)}</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] opacity-40 uppercase font-mono">{t('orders_pending')}</span>
              <span className="text-xs font-black text-slate-100 font-mono">{pendingOrdersCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control panel toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'es' ? 'Buscar por ID, nombre o email...' : 'Search by ID, name or email...'}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-cyan-500 rounded-xl text-xs outline-none transition-all text-slate-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-cyan-500 rounded-xl text-xs outline-none transition-all text-slate-100 cursor-pointer"
          >
            <option value="all">{language === 'es' ? 'Todos los Estados' : 'All Statuses'}</option>
            <option value="processed">{language === 'es' ? 'Procesando' : 'Processing'}</option>
            <option value="shipped">{t('order_status_shipped')}</option>
            <option value="delivered">{t('order_status_delivered')}</option>
            <option value="cancelled">{t('order_status_cancelled')}</option>
          </select>
        </div>
        <span className="text-[10px] opacity-45 uppercase font-mono">
          {language === 'es' ? `Filtrados: ${filteredOrders.length}` : `Filtered: ${filteredOrders.length}`}
        </span>
      </div>

      {/* Orders Table */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-2xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-slate-800 text-slate-500">
              <Receipt className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {language === 'es' ? 'No se encontraron pedidos' : 'No orders found'}
              </h3>
              <p className="text-xs opacity-50 mt-1">
                {language === 'es' ? 'Prueba con otro término o espera a que se realicen ventas.' : 'Try another filter or wait for customer checkouts.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Pedido ID</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Dirección de Envío</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/20 transition-colors">
                    {/* Order ID */}
                    <td className="p-4 font-mono font-bold text-cyan-400">
                      #{ord.id}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-300 font-mono whitespace-nowrap">
                      {ord.date}
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200">{ord.customer?.name || 'Cliente'}</span>
                        <span className="text-[10px] opacity-40 font-mono mt-0.5">{ord.customer?.email}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="p-4 max-w-[150px] truncate text-slate-300">
                      {ord.customer?.address}
                    </td>

                    {/* Total */}
                    <td className="p-4 font-bold text-slate-100 font-mono">
                      {formatPrice(ord.total)}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {renderStatusBadge(ord.status)}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetails(ord)}
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-850 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700 flex items-center gap-1"
                          title="Detalles"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Ver</span>
                        </button>
                        <button
                          onClick={() => deleteOrder(ord.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar Pedido"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in p-4 sm:p-6">
          <div className="w-full max-w-2xl h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/40">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-cyan-500" />
                  <span>Pedido #{selectedOrder.id}</span>
                </h3>
                <span className="text-[10px] opacity-50 font-mono mt-0.5 block">{selectedOrder.date}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable details info */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-none">
              
              {/* Status Update Card */}
              <div className="p-4 border border-slate-800 bg-slate-950/20 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{language === 'es' ? 'Estado Actual del Pedido' : 'Current Order Status'}</span>
                  {renderStatusBadge(selectedOrder.status)}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs outline-none text-slate-100 flex-1 sm:flex-initial cursor-pointer"
                  >
                    <option value="Procesado">{language === 'es' ? 'Procesando' : 'Processing'}</option>
                    <option value="Enviado">{t('order_status_shipped')}</option>
                    <option value="Entregado">{t('order_status_delivered')}</option>
                    <option value="Cancelado">{t('order_status_cancelled')}</option>
                  </select>
                  <button
                    onClick={handleUpdateStatusClick}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    {t('update_status')}
                  </button>
                </div>
              </div>

              {/* Customer Details Box */}
              <div className="p-5 border border-slate-850 rounded-2xl flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-400 border-b border-slate-850 pb-1.5">{language === 'es' ? 'Datos del Cliente' : 'Customer Details'}</span>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="opacity-50 block">{language === 'es' ? 'Nombre completo' : 'Full Name'}</span>
                    <strong className="text-slate-200">{selectedOrder.customer?.name || 'Cliente'}</strong>
                  </div>
                  <div>
                    <span className="opacity-50 block">{language === 'es' ? 'Correo electrónico' : 'Email Address'}</span>
                    <strong className="text-slate-200 font-mono">{selectedOrder.customer?.email}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="opacity-50 block">{t('address_label')}</span>
                    <strong className="text-slate-200">{selectedOrder.customer?.address}</strong>
                  </div>
                </div>
              </div>

              {/* Items Purchased List */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-400 border-b border-slate-850 pb-1.5">{language === 'es' ? 'Artículos Comprados' : 'Items Purchased'}</span>
                <div className="flex flex-col gap-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-4 text-xs p-3 border border-slate-850/50 bg-slate-950/15 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={item.product?.image} className="h-10 w-10 rounded object-cover border border-slate-800" alt="" />
                        <div>
                          <strong className="text-slate-200">{item.product?.name}</strong>
                          <span className="text-[10px] opacity-40 block mt-0.5">{language === 'es' ? 'Cantidad' : 'Quantity'}: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-350 font-mono">{formatPrice(item.product?.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Calculations breakdown */}
              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="opacity-50">{t('subtotal')}</span>
                  <span className="font-mono">{formatPrice(selectedOrder.total * 0.84 - 5)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-50">{t('tax_label').split('(')[0]} (IVA 16%)</span>
                  <span className="font-mono">{formatPrice(selectedOrder.total * 0.16)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-50">{t('shipping')}</span>
                  <span className="font-mono">{formatPrice(5)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-850 pt-2 font-bold text-slate-200">
                  <span>Total</span>
                  <span className="text-sm font-black text-cyan-400 font-mono">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-slate-850 bg-slate-950/40 flex flex-wrap gap-3 items-center justify-between shrink-0">
              <button
                onClick={handleSimulateEmail}
                className="flex-1 min-w-[120px] py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{t('simulate_email')}</span>
              </button>
              <button
                onClick={handlePrintInvoice}
                className="flex-1 min-w-[120px] py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                <Printer className="h-4 w-4" />
                <span>{t('print_invoice')}</span>
              </button>
            </div>

            {/* Printable Invoice Overlay Template (Invisible in browser except in print view) */}
            <div id="print-invoice-area" className="hidden p-8 flex-col gap-6 text-black bg-white">
              <div className="flex justify-between items-start border-b-2 border-gray-300 pb-6">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">FlexCommerce</h1>
                  <p className="text-xs text-gray-500 mt-1">Factura de Compra / Purchase Invoice</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">Orden: #{selectedOrder.id}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-gray-700">Fecha/Date: <span className="font-normal font-mono">{selectedOrder.date}</span></p>
                  <p className="font-bold text-gray-700 mt-1">Estado/Status: <span className="font-normal uppercase">{selectedOrder.status}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 text-xs border-b border-gray-200 pb-6">
                <div>
                  <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Cliente / Billing info:</h4>
                  <p className="font-bold text-gray-900 text-sm">{selectedOrder.customer?.name}</p>
                  <p className="text-gray-600 font-mono mt-1">{selectedOrder.customer?.email}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Despacho / Ship to:</h4>
                  <p className="text-gray-800 leading-relaxed">{selectedOrder.customer?.address}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-gray-200 pb-6">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Detalle del Pedido / Order details:</h4>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 font-bold text-gray-600">
                      <th className="py-2">Producto</th>
                      <th className="py-2 text-center">Cant.</th>
                      <th className="py-2 text-right">Precio Unitario</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 text-gray-800">
                        <td className="py-2.5 font-bold">{item.product?.name}</td>
                        <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 text-right font-mono">{formatPrice(item.product?.price)}</td>
                        <td className="py-2.5 text-right font-mono font-bold">{formatPrice(item.product?.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-64 ml-auto flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatPrice(selectedOrder.total * 0.84 - 5)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Impuestos (IVA 16%):</span>
                  <span className="font-mono">{formatPrice(selectedOrder.total * 0.16)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío / Shipping:</span>
                  <span className="font-mono">{formatPrice(5)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-gray-300 pt-2 font-bold text-gray-900 text-sm">
                  <span>Total:</span>
                  <span className="font-mono">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-gray-400 mt-20 border-t border-gray-100 pt-4">
                © {new Date().getFullYear()} FlexCommerce. Simulación de factura. No se ha cobrado dinero real.
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
