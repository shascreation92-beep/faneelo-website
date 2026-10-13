import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Search, ExternalLink, LogOut, 
  Database, RefreshCw, Upload, X, Check, AlertCircle, Layers,
  DollarSign, Package, Image as ImageIcon, Settings
} from 'lucide-react';
import { 
  getAllProducts, saveProduct, deleteProduct, 
  seedDefaultCatalog, uploadImageFile 
} from '../../services/productService';
import { isSupabaseConfigured, updateSupabaseCredentials } from '../../services/supabaseClient';

const AVAILABLE_COLLECTIONS = ['Lilly', 'Dino', 'Ashwin', 'Chesterfield', 'Dylan', 'Hannah', 'Custom'];

const STANDARD_VARIANTS_TEMPLATE = [
  { type: '1-seater', label: '1 Seater', price: 250, soldCount: 35 },
  { type: '2-seater', label: '2 Seater', price: 350, soldCount: 40 },
  { type: '3-seater', label: '3 Seater', price: 380, soldCount: 45 },
  { type: '4-seater', label: '4 Seater', price: 500, soldCount: 30 },
  { type: '5-seater', label: '5 Seater', price: 550, soldCount: 60 },
  { type: '6-seater', label: '6 Seater', price: 650, soldCount: 20 },
  { type: '3plus2-seater', label: '3+2 Seater', price: 600, soldCount: 50 },
  { type: 'corner-sofa', label: 'Corner Sofa', price: 650, soldCount: 75 }
];

export default function AdminDashboard({ onLogout, onNavigateToStore }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');

  // Modal states
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Settings state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const prods = await getAllProducts();
      setProducts(prods);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingProduct({
      id: `prod_${Date.now()}`,
      name: '',
      collection: 'Lilly',
      price: 250,
      originalPrice: 300,
      imageUrl: '',
      images: [],
      variants: [...STANDARD_VARIANTS_TEMPLATE],
      color: 'Charcoal, Grey, Beige, Navy Blue, Cream, Forest Green, Black',
      fabric: 'Plush Velvet, Chenille, Bouclé, Jumbo Cord, Linen',
      description: 'Experience supreme British handcrafted comfort with this luxury sofa. Made for modern UK living rooms with premium upholstery and solid frame.',
      delivery: 'Within 1–3 working days | Free UK Delivery | Cash on Delivery',
      rating: 5,
      soldCount: 45,
      inStock: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct({
      ...prod,
      variants: prod.variants && prod.variants.length > 0 ? [...prod.variants] : [...STANDARD_VARIANTS_TEMPLATE],
      images: prod.images || [prod.imageUrl]
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    const ok = await deleteProduct(id);
    if (ok) {
      notify(`Product "${name}" deleted.`);
      loadData();
    } else {
      notify('Failed to delete product', 'error');
    }
  };

  const handleSeedCatalog = async () => {
    if (!window.confirm('Reset/seed initial BritSofa matching catalog (12 products)?')) return;
    setLoading(true);
    await seedDefaultCatalog();
    await loadData();
    notify('Catalog seeded successfully with 12 BritSofa products!');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.imageUrl) {
      alert('Please provide at least a Product Name and Main Image.');
      return;
    }
    setSaveLoading(true);
    try {
      await saveProduct(editingProduct);
      notify(`Product "${editingProduct.name}" saved successfully!`);
      setIsModalOpen(false);
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      console.error(err);
      notify('Error saving product', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Image Upload helper for main product image
  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      setEditingProduct((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
        images: prev.images?.length ? [uploadedUrl, ...prev.images.slice(1)] : [uploadedUrl]
      }));
    }
  };

  // Image Upload helper for specific variant
  const handleVariantImageUpload = async (index, file) => {
    if (!file) return;
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      setEditingProduct((prev) => {
        const updated = [...prev.variants];
        updated[index] = { ...updated[index], imageUrl: uploadedUrl };
        return { ...prev, variants: updated };
      });
    }
  };

  // Variant management
  const handleAddVariant = () => {
    setEditingProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          type: 'custom',
          label: 'New Size Variant',
          price: prev.price || 250,
          imageUrl: prev.imageUrl,
          soldCount: 20
        }
      ]
    }));
  };

  const handleRemoveVariant = (index) => {
    setEditingProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantFieldChange = (index, field, value) => {
    setEditingProduct((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        (p.collection && p.collection.toLowerCase().includes(search.toLowerCase()));
    const matchColl = selectedCollection === 'all' || p.collection?.toLowerCase() === selectedCollection.toLowerCase();
    return matchSearch && matchColl;
  });

  const isCloud = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] font-sans pb-24">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E6E6E6] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-normal tracking-tight text-[#111111]">
              Faneelo<span className="text-[#C47C5A]">.</span>
            </span>
            <span className="rounded-full admin-badge-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              ADMIN CMS
            </span>
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              isCloud ? 'bg-[#EAF4E2] text-[#2E7D32]' : 'bg-[#FFFBEB] text-[#B45309]'
            }`}>
              <Database size={13} />
              {isCloud ? 'Live Supabase Cloud' : 'Local Catalog Mode'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onNavigateToStore}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D6D3D1] bg-white text-xs font-semibold text-[#111111] hover:bg-[#F5F5F4] transition-colors cursor-pointer"
            >
              <ExternalLink size={13} /> View Website
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full border border-[#D6D3D1] bg-white text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F4] transition-colors cursor-pointer"
              title="Cloud Database Settings"
            >
              <Settings size={16} />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer border border-red-200"
            >
              <LogOut size={13} /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-lg border text-xs font-semibold flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-[#EAF4E2] text-[#2E7D32] border-[#C8E6C9]'
        }`}>
          <Check size={14} /> {notification.msg}
        </div>
      )}

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
            <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">Total Products</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans">{products.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
            <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">Active Collections</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans">
              {new Set(products.map(p => p.collection)).size}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
            <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">Total Variants</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans">
              {products.reduce((acc, p) => acc + (p.variants?.length || 0), 0)}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
            <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">In Stock Sofas</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#2E7D32] font-sans">
              {products.filter(p => p.inStock !== false).length}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input
                type="text"
                placeholder="Search sofas by name or collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#D6D3D1] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-black transition"
              />
            </div>

            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="px-4 py-2.5 rounded-full border border-[#D6D3D1] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-black transition cursor-pointer"
            >
              <option value="all">All Collections</option>
              {AVAILABLE_COLLECTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSeedCatalog}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#D6D3D1] bg-white text-xs font-semibold text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F4] transition cursor-pointer"
              title="Reset default 12 BritSofa products"
            >
              <RefreshCw size={13} /> Reset Default Catalog
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full admin-btn-black text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-[#E6E6E6] overflow-hidden shadow-2xs">
          {loading ? (
            <div className="p-12 text-center text-xs text-[#777777]">Loading catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-[#111111]">No products found</p>
              <p className="text-xs text-[#777777] mt-1">Try modifying your search filter or click "Reset Default Catalog".</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#333333]">
                <thead className="bg-[#FAF9F5] text-[11px] font-bold uppercase tracking-wider text-[#777777] border-b border-[#E6E6E6]">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Collection</th>
                    <th className="py-3.5 px-4">Starting Price</th>
                    <th className="py-3.5 px-4">Variations</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE5]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E6E6E6] bg-[#F5F5F4]"
                          />
                          <div>
                            <p className="font-semibold text-sm text-[#111111] line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-[#777777]">{p.variants?.length || 0} size options configured</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#555555]">
                        <span className="rounded-full bg-[#F0ECE5] px-2.5 py-1 text-[11px] font-semibold text-[#111111]">
                          {p.collection || 'Standard'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sm text-[#111111] tabular-nums">
                        £{Number(p.price || 250).toLocaleString('en-GB')}
                      </td>
                      <td className="py-3.5 px-4 text-[#555555]">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(p.variants || []).slice(0, 4).map((v, i) => (
                            <span key={i} className="text-[10px] bg-[#F5F5F4] px-1.5 py-0.5 rounded text-[#666666]">
                              {v.label || v.type}
                            </span>
                          ))}
                          {(p.variants?.length || 0) > 4 && (
                            <span className="text-[10px] text-[#888888] self-center">
                              +{p.variants.length - 4} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          p.inStock !== false ? 'bg-[#EAF4E2] text-[#2E7D32]' : 'bg-red-50 text-red-700'
                        }`}>
                          {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-[#555555] hover:text-[#111111] hover:bg-[#EFEBE4] transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
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
      </main>

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#E6E6E6]">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE5] mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#111111]">
                  {editingProduct.id.startsWith('prod_') && !products.some(p => p.id === editingProduct.id) 
                    ? 'Add New Luxury Sofa' 
                    : `Edit: ${editingProduct.name}`}
                </h3>
                <p className="text-xs text-[#777777]">Fill in sofa details, images, and size variations</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#F5F5F4] text-[#777777] cursor-pointer border-0 bg-transparent"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Luxury Chesterfield Corner Sofa"
                    className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Collection / Style
                  </label>
                  <select
                    value={editingProduct.collection}
                    onChange={(e) => setEditingProduct({ ...editingProduct, collection: e.target.value })}
                    className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black cursor-pointer bg-white"
                  >
                    {AVAILABLE_COLLECTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Starting Price (£) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Original Price (£)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Optional struck-through price"
                    className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Main Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Main Product Image * (Upload from phone/laptop or paste URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  {editingProduct.imageUrl ? (
                    <img 
                      src={editingProduct.imageUrl} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-xl object-cover border border-[#E6E6E6] bg-[#F5F5F4]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[#D6D3D1] flex items-center justify-center text-[#888888]">
                      <ImageIcon size={20} />
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F0ECE5] hover:bg-[#E5E0D8] text-xs font-semibold text-[#111111] cursor-pointer transition">
                      <Upload size={14} /> Upload Image File
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMainImageUpload}
                        className="hidden" 
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or enter direct image URL..."
                      value={editingProduct.imageUrl}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black"
                />
              </div>

              {/* Colors & Fabrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Available Colors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.color}
                    onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                    className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Fabric Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.fabric}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* In Stock toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={editingProduct.inStock !== false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                  className="w-4 h-4 rounded text-black cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="text-xs font-semibold text-[#111111] cursor-pointer">
                  In Stock & Available for UK Delivery
                </label>
              </div>

              {/* ================= SIZE VARIATIONS SECTION ================= */}
              <div className="pt-4 border-t border-[#F0ECE5]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                      <Layers size={16} /> Size Variations & Category Mappings
                    </h4>
                    <p className="text-[11px] text-[#777777]">
                      Each size (e.g. 1-Seater, 2-Seater, Corner) gets its own image and price on the filter pages!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F0ECE5] hover:bg-[#E5E0D8] text-xs font-semibold text-[#111111] cursor-pointer transition"
                  >
                    <Plus size={13} /> Add Variant
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {(editingProduct.variants || []).map((v, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl border border-[#E6E6E6] bg-[#FAF9F5] flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      {/* Variant Type Select */}
                      <div className="w-full sm:w-36">
                        <label className="block text-[10px] font-bold text-[#777777] uppercase mb-0.5">Size Category</label>
                        <select
                          value={v.type}
                          onChange={(e) => handleVariantFieldChange(idx, 'type', e.target.value)}
                          className="w-full rounded-lg border border-[#D6D3D1] bg-white px-2 py-1.5 text-xs font-medium focus:outline-none cursor-pointer"
                        >
                          <option value="1-seater">1-Seater</option>
                          <option value="2-seater">2-Seater</option>
                          <option value="3-seater">3-Seater</option>
                          <option value="4-seater">4-Seater</option>
                          <option value="5-seater">5-Seater</option>
                          <option value="6-seater">6-Seater</option>
                          <option value="3plus2-seater">3+2 Seater</option>
                          <option value="corner-sofa">Corner Sofa</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>

                      {/* Variant Title */}
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold text-[#777777] uppercase mb-0.5">Title / Label</label>
                        <input
                          type="text"
                          value={v.label}
                          onChange={(e) => handleVariantFieldChange(idx, 'label', e.target.value)}
                          placeholder="e.g. Luxury 1 Seater Armchair"
                          className="w-full rounded-lg border border-[#D6D3D1] bg-white px-2.5 py-1.5 text-xs focus:outline-none"
                        />
                      </div>

                      {/* Variant Price */}
                      <div className="w-full sm:w-24">
                        <label className="block text-[10px] font-bold text-[#777777] uppercase mb-0.5">Price (£)</label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleVariantFieldChange(idx, 'price', Number(e.target.value))}
                          className="w-full rounded-lg border border-[#D6D3D1] bg-white px-2 py-1.5 text-xs font-bold tabular-nums focus:outline-none"
                        />
                      </div>

                      {/* Variant Image */}
                      <div className="w-full sm:w-32 flex items-center gap-2">
                        {v.imageUrl && (
                          <img 
                            src={v.imageUrl} 
                            alt={v.label} 
                            className="w-8 h-8 rounded-lg object-cover border border-[#E6E6E6] bg-white"
                          />
                        )}
                        <label className="p-1.5 rounded-lg border border-[#D6D3D1] bg-white text-[#555555] hover:text-black hover:bg-[#F5F5F4] cursor-pointer text-xs flex items-center gap-1" title="Upload variant image">
                          <Upload size={12} />
                          <span className="text-[10px]">Photo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleVariantImageUpload(idx, e.target.files?.[0])}
                            className="hidden" 
                          />
                        </label>
                      </div>

                      {/* Delete Variant */}
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer border-0 bg-transparent self-end sm:self-center"
                        title="Remove Variant"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0ECE5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#D6D3D1] text-xs font-semibold text-[#555555] hover:bg-[#F5F5F4] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-full admin-btn-black text-xs font-semibold transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {saveLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CLOUD DATABASE SETTINGS MODAL ================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E6E6E6]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE5] mb-5">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Database size={17} /> Supabase Cloud Settings
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-full text-[#777777] hover:bg-[#F5F5F4] cursor-pointer border-0 bg-transparent"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[#666666] mb-4 leading-relaxed">
              To connect your free Supabase Cloud Database for live multi-device syncing and direct cloud storage, paste your Supabase Project URL and Anon Key below:
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyz.supabase.co"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Anon API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-full border border-[#D6D3D1] text-xs font-semibold text-[#555555] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  updateSupabaseCredentials(supabaseUrlInput, supabaseKeyInput);
                  setIsSettingsOpen(false);
                }}
                className="px-5 py-2 rounded-full admin-btn-black text-xs font-semibold cursor-pointer"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
