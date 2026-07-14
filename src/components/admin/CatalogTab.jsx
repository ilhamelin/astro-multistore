import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Package, Plus, Trash2, Edit2, X, PlusCircle, Check } from 'lucide-react';

export default function CatalogTab() {
  const { 
    activeThemeId, 
    currentTheme, 
    products, 
    addProduct, 
    editProduct, 
    deleteProduct, 
    formatPrice,
    translateCategory,
    language
  } = useStore();

  // Filter products by active theme so the catalog shows the corresponding products
  const themeProducts = products.filter((p) => p.theme === activeThemeId);

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [specs, setSpecs] = useState({});

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setStock('');
    setCategory(currentTheme.categories[0] || '');
    setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600');
    setDescription('');
    setSpecs({});
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price.toString());
    setStock(prod.stock.toString());
    setCategory(prod.category);
    setImage(prod.image);
    setDescription(prod.description);
    setSpecs(prod.specs || {});
    setIsFormOpen(true);
  };

  const handleAddSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setSpecs((prev) => ({ ...prev, [specKey.trim()]: specValue.trim() }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpec = (keyToRemove) => {
    const updatedSpecs = { ...specs };
    delete updatedSpecs[keyToRemove];
    setSpecs(updatedSpecs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productPayload = {
      name,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      category,
      image,
      description,
      specs
    };

    if (editingProduct) {
      editProduct({
        ...editingProduct,
        ...productPayload
      });
    } else {
      addProduct(productPayload);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-cyan-500" />
            <span>Gestor de Inventario</span>
          </h2>
          <p className="text-xs opacity-60 mt-1">
            Administra los productos de tu catálogo para el nicho actual (<strong>{currentTheme.name}</strong>).
          </p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 active:scale-95 transition-all w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Añadir Producto</span>
        </button>
      </div>

      {/* Catalog Table / Grid */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-2xl overflow-hidden">
        {themeProducts.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-slate-800 text-slate-500">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm">No hay productos en esta plantilla</h3>
              <p className="text-xs opacity-50 mt-1">Crea un nuevo artículo para comenzar a vender en tu tienda.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Producto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {themeProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-900/20 transition-colors">
                    {/* Product cell with thumbnail */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded overflow-hidden bg-slate-800 shrink-0 border border-slate-750">
                        <img src={prod.image} alt={prod.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-200">{prod.name}</div>
                        <div className="text-[10px] opacity-50 line-clamp-1 max-w-[200px] mt-0.5">{prod.description}</div>
                      </div>
                    </td>
                    
                    {/* Category cell */}
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-950 text-slate-300 font-semibold text-[9px] uppercase tracking-wide">
                        {translateCategory(prod.category)}
                      </span>
                    </td>
                    
                    {/* Price cell */}
                    <td className="p-4 font-semibold text-slate-200">
                      {formatPrice(prod.price)}
                    </td>
                    
                    {/* Stock cell */}
                    <td className="p-4">
                      <span className={`font-bold ${prod.stock <= 3 ? 'text-red-400' : 'text-slate-300'}`}>
                        {prod.stock} uds.
                      </span>
                    </td>
                    
                    {/* Actions cell */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditForm(prod)}
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-850 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700"
                          title="Editar"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-850 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* FORM MODAL (ADD & EDIT) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          
          <div className="relative w-full max-w-xl border border-slate-800 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
                {editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-none">
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-400">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs outline-none focus:border-cyan-500 text-slate-100 transition-all"
                  placeholder="Ej. Sourdough Deluxe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-400">
                    {language === 'es' ? 'Precio (Base USD $)' : 'Price (Base USD $)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs outline-none focus:border-cyan-500 text-slate-100 transition-all"
                    placeholder="25.50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-400">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs outline-none focus:border-cyan-500 text-slate-100 transition-all"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-400">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs outline-none focus:border-cyan-500 text-slate-100 transition-all"
                  >
                    {currentTheme.categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-400">URL de Imagen</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs outline-none focus:border-cyan-500 text-slate-100 transition-all"
                    placeholder="https://unsplash..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-400">Descripción Corta</label>
                <textarea
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs outline-none focus:border-cyan-500 text-slate-100 transition-all resize-none"
                  placeholder="Detalles sobre el producto..."
                />
              </div>

              {/* Specs management inside form */}
              <div className="flex flex-col gap-2 p-4 bg-slate-950 border border-slate-850 rounded-xl">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-400">Especificaciones Técnicas</label>
                
                {/* Add spec inline row */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nombre (ej. Peso)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-[11px] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Valor (ej. 850g)"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-[11px] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-md text-xs cursor-pointer flex items-center"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                </div>

                {/* Specs List */}
                {Object.keys(specs).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(specs).map(([key, val]) => (
                      <span key={key} className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                        <strong>{key}:</strong> {val}
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(key)}
                          className="text-red-400 hover:text-red-300 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800 mt-2 bg-slate-950/20 p-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-800 bg-transparent text-slate-300 hover:bg-slate-850 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 active:scale-95 transition-all"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>{editingProduct ? 'Guardar Cambios' : 'Añadir Producto'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
