'use client';

import { useProducts } from '@/context/ProductContext';
import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '@/context/CurrencyContext';

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { formatPrice } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const defaultProduct = { name: '', category: 'National Jerseys', price: '', image: '', images: [], color: 'emerald', description: '', isOffer: false, offerPrice: '', isNewArrival: false, outOfStockSizes: [] };
  const [newProduct, setNewProduct] = useState(defaultProduct);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    
    let uploadedImageUrls = newProduct.images || [];

    if (selectedFiles.length > 0) {
      if (selectedFiles.length < 3) {
        alert("Please select at least 3 images.");
        return;
      }
      
      setIsUploading(true);
      const formData = new FormData();
      for (let file of selectedFiles) {
        formData.append('images', file);
      }
      
      try {
        const token = localStorage.getItem('luxe_token');
        const res = await fetch('https://the-lables.onrender.com/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        
        if (data.urls) {
          uploadedImageUrls = data.urls;
        } else {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
          setIsUploading(false);
          return;
        }
      } catch (err) {
        alert('Upload failed: ' + err.message);
        setIsUploading(false);
        return;
      }
    } else if (uploadedImageUrls.length < 3) {
      alert("A minimum of 3 images is required for this product.");
      return;
    }

    const productData = {
      ...newProduct,
      images: uploadedImageUrls,
      image: uploadedImageUrls[0] || newProduct.image,
      price: parseFloat(newProduct.price),
      offerPrice: newProduct.isOffer ? parseFloat(newProduct.offerPrice) : null
    };

    if (isEditing) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }

    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setNewProduct(defaultProduct);
    setSelectedFiles([]);
    setIsUploading(false);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setNewProduct(defaultProduct);
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setEditingId(product._id);
    setNewProduct({
      name: product.name,
      category: product.category || 'National Jerseys',
      price: product.price,
      image: product.image,
      images: product.images || (product.image ? [product.image] : []),
      color: product.color || 'emerald',
      description: product.description || '',
      isOffer: product.isOffer || false,
      offerPrice: product.offerPrice || '',
      isNewArrival: product.isNewArrival || false,
      outOfStockSizes: product.outOfStockSizes || [],
    });
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-white whitespace-nowrap">Product Management</h2>
        
        <div className="flex-1 max-w-md relative">
          <input 
            type="text" 
            placeholder="Search products by name or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-emerald-500 text-black px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm">
              <tr>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="p-4 text-gray-200 font-medium">
                    {product.name}
                    <div className="flex gap-2 mt-2">
                      {product.isOffer && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-500 border border-red-500/30">
                          OFFER APPLIED
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                          NEW ARRIVAL
                        </span>
                      )}
                      {product.isOutOfStock && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{product.category}</td>
                  <td className="p-4 text-gray-300 font-semibold">
                    {product.isOffer ? (
                      <div>
                        <span className="text-gold block">{formatPrice(product.offerPrice)}</span>
                        <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
                      </div>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="text-gray-500 hover:text-emerald-400 transition-colors p-2"
                        title="Edit Product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </button>
                      <button 
                        onClick={() => deleteProduct(product._id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-2"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-8 text-center text-gray-500">No products found.</div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0f1c] border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-semibold text-white mb-6">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Product Name</label>
                  <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Category</label>
                    <select 
                      required 
                      value={newProduct.category} 
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="National Jerseys">National Jerseys</option>
                      <option value="Club Jerseys">Club Jerseys</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Price (LKR)</label>
                    <input required type="number" min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Product Images (Min 3)</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={e => setSelectedFiles(Array.from(e.target.files))} 
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-emerald-500 transition-all" 
                  />
                  {selectedFiles.length > 0 && <p className="text-xs text-gray-400 mt-2">{selectedFiles.length} file(s) selected.</p>}
                  {isEditing && selectedFiles.length === 0 && newProduct.images?.length > 0 && (
                    <p className="text-xs text-primary mt-2">Currently has {newProduct.images.length} uploaded images. Selecting new files will replace them.</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Theme Color</label>
                  <select value={newProduct.color} onChange={e => setNewProduct({...newProduct, color: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary appearance-none">
                    <option value="emerald">Emerald</option>
                    <option value="gold">Gold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Description</label>
                  <textarea required rows="3" placeholder="Enter product details..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none"></textarea>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="isOffer"
                      checked={newProduct.isOffer} 
                      onChange={e => setNewProduct({...newProduct, isOffer: e.target.checked})} 
                      className="w-4 h-4 accent-primary"
                    />
                    <label htmlFor="isOffer" className="text-sm font-bold text-white uppercase tracking-wider">Is on Offer?</label>
                  </div>
                  {newProduct.isOffer && (
                    <div className="flex-1 pl-4 border-l border-white/10">
                      <label className="block text-xs text-gold mb-1 uppercase tracking-wider">Offer Price (LKR)</label>
                      <input required type="number" min="0" value={newProduct.offerPrice} onChange={e => setNewProduct({...newProduct, offerPrice: e.target.value})} className="w-full bg-black/50 border border-gold/30 rounded-lg p-2 text-white focus:outline-none focus:border-gold text-sm" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="isNewArrival"
                        checked={newProduct.isNewArrival} 
                        onChange={e => setNewProduct({...newProduct, isNewArrival: e.target.checked})} 
                        className="w-4 h-4 accent-primary"
                      />
                      <label htmlFor="isNewArrival" className="text-sm font-bold text-white uppercase tracking-wider">New Arrival?</label>
                    </div>
                  </div>
                  <div className="flex items-start flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10">
                    <label className="text-sm font-bold text-white uppercase tracking-wider mb-2">Out of Stock Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                        const isSelected = newProduct.outOfStockSizes.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setNewProduct({...newProduct, outOfStockSizes: newProduct.outOfStockSizes.filter(s => s !== size)});
                              } else {
                                setNewProduct({...newProduct, outOfStockSizes: [...newProduct.outOfStockSizes, size]});
                              }
                            }}
                            className={`w-10 h-10 rounded-lg font-bold transition-all ${isSelected ? 'bg-red-500 text-white border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-transparent border border-white/20 text-gray-400 hover:border-white/50'}`}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <button disabled={isUploading} type="submit" className="w-full bg-primary hover:bg-emerald-500 text-black py-3 rounded-xl font-medium transition-colors mt-4 disabled:opacity-50">
                  {isUploading ? 'Uploading...' : 'Save Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
