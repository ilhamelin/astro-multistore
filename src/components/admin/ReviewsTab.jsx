import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquare, Trash2, Star, User, ExternalLink } from 'lucide-react';

export default function ReviewsTab() {
  const { reviews, products, deleteReview, language, t } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate some simple stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  // Filter reviews by reviewer name, comment or product name
  const filteredReviews = reviews.filter((rev) => {
    const product = products.find(p => p.id === rev.productId);
    const productName = product ? product.name.toLowerCase() : '';
    const matchSearch = 
      rev.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-cyan-500" />
            <span>{t('reviews_moderation') || 'Moderación de Reseñas'}</span>
          </h2>
          <p className="text-xs opacity-60 mt-1">
            {language === 'es' 
              ? 'Administra, lee y elimina valoraciones inapropiadas de tus clientes.' 
              : 'Manage, read and delete inappropriate ratings from your customers.'}
          </p>
        </div>
        
        {/* Stats card */}
        <div className="flex gap-4 select-none shrink-0">
          <div className="px-4 py-2 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] opacity-40 uppercase font-mono">{language === 'es' ? 'Total' : 'Total'}</span>
              <span className="text-sm font-black text-slate-100 font-mono">{totalReviews}</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Star className="h-4 w-4 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] opacity-40 uppercase font-mono">{language === 'es' ? 'Promedio' : 'Average'}</span>
              <span className="text-sm font-black text-slate-100 font-mono">{averageRating} ★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={language === 'es' ? 'Buscar por producto, cliente o comentario...' : 'Search by product, customer or comment...'}
          className="w-full sm:max-w-md px-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs outline-none transition-all text-slate-100"
        />
        <span className="text-[10px] opacity-40 uppercase font-mono">
          {t('showing_products', { count: filteredReviews.length, category: '' }).replace('en la categoría ', '').replace('in the  category', '')}
        </span>
      </div>

      {/* Reviews Table */}
      <div className="border border-slate-800 bg-slate-900/30 rounded-2xl overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-slate-800 text-slate-500">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {language === 'es' ? 'No se encontraron reseñas' : 'No reviews found'}
              </h3>
              <p className="text-xs opacity-50 mt-1">
                {language === 'es' ? 'Prueba con otro término de búsqueda o espera opiniones.' : 'Try another search query or wait for customer feedback.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">{language === 'es' ? 'Producto' : 'Product'}</th>
                  <th className="p-4">{language === 'es' ? 'Cliente' : 'Customer'}</th>
                  <th className="p-4">{language === 'es' ? 'Calificación' : 'Rating'}</th>
                  <th className="p-4">{language === 'es' ? 'Comentario' : 'Comment'}</th>
                  <th className="p-4">{language === 'es' ? 'Fecha' : 'Date'}</th>
                  <th className="p-4 text-right">{language === 'es' ? 'Acción' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredReviews.map((rev) => {
                  const product = products.find(p => p.id === rev.productId);
                  return (
                    <tr key={rev.id} className="hover:bg-slate-900/20 transition-colors">
                      {/* Product associated */}
                      <td className="p-4 max-w-[150px]">
                        {product ? (
                          <div className="flex items-center gap-2">
                            <img src={product.image} className="h-8 w-8 rounded object-cover border border-slate-700 shrink-0" alt="" />
                            <div className="truncate">
                              <span className="font-bold text-slate-200 block truncate">{product.name}</span>
                              <span className="text-[9px] opacity-40 uppercase font-mono">{product.theme}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-red-400 font-semibold italic">{language === 'es' ? 'Producto Eliminado' : 'Deleted Product'}</span>
                        )}
                      </td>

                      {/* Reviewer */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200">{rev.userName}</span>
                          <span className="text-[9px] opacity-40 font-mono mt-0.5">{rev.userEmail}</span>
                        </div>
                      </td>

                      {/* Stars */}
                      <td className="p-4">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'opacity-20'}`} 
                            />
                          ))}
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="p-4 max-w-xs md:max-w-md">
                        <p className="text-slate-300 leading-relaxed break-words">{rev.comment}</p>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-400 font-mono whitespace-nowrap">
                        {rev.date}
                      </td>

                      {/* Action block */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteReview(rev.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700"
                          title={t('delete_review_tooltip') || 'Eliminar Reseña'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
