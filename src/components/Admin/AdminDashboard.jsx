import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, Search, ExternalLink, LogOut, 
  Database, RefreshCw, Upload, X, Check, Layers,
  Image as ImageIcon, Settings, ChevronDown,
  ChevronLeft, ChevronRight, Star, FolderTree, Palette,
  ShoppingBag, Download, Eye, Phone, MapPin, MessageCircle, Calendar
} from 'lucide-react';
import { 
  getAllProducts, saveProduct, deleteProduct, 
  seedDefaultCatalog, uploadImageFile 
} from '../../services/productService';
import { 
  getAllCollections, saveCollection, renameCollection, deleteCollection 
} from '../../services/collectionService';
import { 
  getAllOrders, updateOrderStatus, deleteOrder, exportOrdersToCSV 
} from '../../services/orderService';
import { isSupabaseConfigured, updateSupabaseCredentials } from '../../services/supabaseClient';

const POPULAR_UK_COLORS = [
  'Charcoal', 'Grey', 'Light Grey', 'Cream Bouclé', 'Beige', 
  'Navy Blue', 'Forest Green', 'Black', 'Mustard', 'Rust', 'Mink', 'Camel'
];

export function getColorHex(colorName) {
  if (!colorName) return '#A8A29E';
  const c = colorName.toLowerCase().trim();
  if (c.includes('charcoal')) return '#36454F';
  if (c.includes('dark grey') || c.includes('dark gray')) return '#4A4A4A';
  if (c.includes('light grey') || c.includes('light gray')) return '#D1D5DB';
  if (c.includes('grey') || c.includes('gray')) return '#808080';
  if (c.includes('black')) return '#111111';
  if (c.includes('white')) return '#FAFAFA';
  if (c.includes('cream') || c.includes('ivory')) return '#FFFDD0';
  if (c.includes('beige')) return '#F5F5DC';
  if (c.includes('bouclé') || c.includes('boucle')) return '#F3EFE6';
  if (c.includes('navy')) return '#0A192F';
  if (c.includes('blue')) return '#1E3A8A';
  if (c.includes('forest') || c.includes('emerald')) return '#1B4332';
  if (c.includes('sage') || c.includes('olive')) return '#708238';
  if (c.includes('green')) return '#2D6A4F';
  if (c.includes('mustard') || c.includes('gold')) return '#D4AF37';
  if (c.includes('rust') || c.includes('terracotta') || c.includes('orange')) return '#C05621';
  if (c.includes('brown') || c.includes('chocolate') || c.includes('coffee')) return '#5C4033';
  if (c.includes('mink') || c.includes('taupe') || c.includes('caramel')) return '#8E735B';
  if (c.includes('pink') || c.includes('rose') || c.includes('blush')) return '#F472B6';
  if (c.includes('teal')) return '#0D9488';
  return '#A8A29E';
}

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
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');

  // Orders State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Modal states
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Image Gallery inputs in Product Modal
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // Color inputs in Product Modal
  const [newColorInput, setNewColorInput] = useState('');

  // Collections Form State
  const [editingCollection, setEditingCollection] = useState(null);
  const [colFormName, setColFormName] = useState('');
  const [colFormDesc, setColFormDesc] = useState('');
  const [colFormImage, setColFormImage] = useState('');

  // Supabase Settings state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cols, ords] = await Promise.all([
        getAllProducts(),
        getAllCollections(),
        getAllOrders()
      ]);
      setProducts(prods || []);
      setCollections(cols || []);
      setOrders(ords || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reset pagination to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCollection]);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Order Management Handlers
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    notify(`Order #${orderId} marked as "${newStatus}"`);
    const ords = await getAllOrders();
    setOrders(ords || []);
    if (selectedOrderDetails && selectedOrderDetails.orderId === orderId) {
      setSelectedOrderDetails(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) return;
    await deleteOrder(orderId);
    notify(`Order #${orderId} deleted.`);
    const ords = await getAllOrders();
    setOrders(ords || []);
    if (selectedOrderDetails?.orderId === orderId) {
      setSelectedOrderDetails(null);
    }
  };

  const handleExportCSV = () => {
    exportOrdersToCSV(filteredOrders);
    notify('Orders exported to CSV spreadsheet!');
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchesRef = (o.orderId || '').toLowerCase().includes(q);
        const matchesName = (o.customer?.fullName || '').toLowerCase().includes(q);
        const matchesPhone = (o.customer?.phone || '').toLowerCase().includes(q);
        const matchesPostcode = (o.customer?.postcode || '').toLowerCase().includes(q);
        const matchesCity = (o.customer?.city || '').toLowerCase().includes(q);
        if (!matchesRef && !matchesName && !matchesPhone && !matchesPostcode && !matchesCity) {
          return false;
        }
      }
      return true;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const availableCollectionNames = collections.length > 0 
    ? collections.map(c => c.name) 
    : ['Lilly', 'Dino', 'Ashwin', 'Chesterfield', 'Dylan', 'Hannah', 'Custom'];

  // Product Add / Edit
  const handleOpenAdd = () => {
    setEditingProduct({
      id: `prod_${Date.now()}`,
      name: '',
      collection: availableCollectionNames[0] || 'Lilly',
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
    setNewImageUrlInput('');
    setNewColorInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    const imagesList = prod.images && prod.images.length > 0 
      ? [...prod.images] 
      : (prod.imageUrl ? [prod.imageUrl] : []);

    setEditingProduct({
      ...prod,
      collection: prod.collection || availableCollectionNames[0] || 'Lilly',
      variants: prod.variants && prod.variants.length > 0 ? [...prod.variants] : [...STANDARD_VARIANTS_TEMPLATE],
      images: imagesList,
      imageUrl: prod.imageUrl || imagesList[0] || ''
    });
    setNewImageUrlInput('');
    setNewColorInput('');
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
      alert('Please provide at least a Product Name and a Main Cover Image.');
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

  // Multiple Images Upload handler
  const handleMultiImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSaveLoading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadImageFile(file);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        setEditingProduct((prev) => {
          const currentList = prev.images || (prev.imageUrl ? [prev.imageUrl] : []);
          const updatedImages = [...currentList, ...uploadedUrls];
          return {
            ...prev,
            imageUrl: prev.imageUrl || updatedImages[0],
            images: updatedImages
          };
        });
        notify(`${uploadedUrls.length} photo(s) added to gallery!`);
      }
    } catch (err) {
      console.error(err);
      notify('Error uploading photos', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Add Image via Direct URL
  const handleAddImageUrl = () => {
    if (!newImageUrlInput.trim()) return;
    const url = newImageUrlInput.trim();
    setEditingProduct((prev) => {
      const currentList = prev.images || (prev.imageUrl ? [prev.imageUrl] : []);
      const updatedImages = [...currentList, url];
      return {
        ...prev,
        imageUrl: prev.imageUrl || updatedImages[0],
        images: updatedImages
      };
    });
    setNewImageUrlInput('');
    notify('Image URL added to gallery!');
  };

  // Set Primary / Cover Image
  const handleSetPrimaryImage = (imgUrl) => {
    setEditingProduct((prev) => ({
      ...prev,
      imageUrl: imgUrl
    }));
    notify('Main cover photo updated!');
  };

  // Remove photo from gallery
  const handleRemoveGalleryImage = (indexToRemove) => {
    setEditingProduct((prev) => {
      const updatedImages = (prev.images || []).filter((_, i) => i !== indexToRemove);
      const isRemovingCover = prev.imageUrl === prev.images?.[indexToRemove];
      const newCover = isRemovingCover ? (updatedImages[0] || '') : prev.imageUrl;
      return {
        ...prev,
        imageUrl: newCover,
        images: updatedImages
      };
    });
  };

  // Variant photo upload helper
  const handleVariantImageUpload = async (index, file) => {
    if (!file) return;
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      setEditingProduct((prev) => {
        const updated = [...prev.variants];
        updated[index] = { ...updated[index], imageUrl: uploadedUrl };
        return { ...prev, variants: updated };
      });
      notify('Variant photo updated!');
    }
  };

  // Color management helpers
  const getCurrentColorList = () => {
    if (!editingProduct) return [];
    return (editingProduct.color || '')
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);
  };

  const handleAddCustomColor = () => {
    if (!newColorInput.trim()) return;
    const colorToAdd = newColorInput.trim();
    const currentList = getCurrentColorList();
    if (!currentList.some(c => c.toLowerCase() === colorToAdd.toLowerCase())) {
      const updated = [...currentList, colorToAdd];
      setEditingProduct((prev) => ({
        ...prev,
        color: updated.join(', ')
      }));
    }
    setNewColorInput('');
  };

  const handleAddColorPill = (colorName) => {
    const currentList = getCurrentColorList();
    if (!currentList.some(c => c.toLowerCase() === colorName.toLowerCase())) {
      const updated = [...currentList, colorName];
      setEditingProduct((prev) => ({
        ...prev,
        color: updated.join(', ')
      }));
    }
  };

  const handleRemoveColor = (colorName) => {
    const currentList = getCurrentColorList();
    const updated = currentList.filter(c => c.toLowerCase() !== colorName.toLowerCase());
    setEditingProduct((prev) => ({
      ...prev,
      color: updated.join(', ')
    }));
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

  // Collections Manager Handlers
  const handleOpenCollectionsManager = () => {
    setEditingCollection(null);
    setColFormName('');
    setColFormDesc('');
    setColFormImage('');
    setIsCollectionsOpen(true);
  };

  const handleCollectionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageFile(file);
    if (url) {
      setColFormImage(url);
    }
  };

  const handleSaveCollectionForm = async () => {
    if (!colFormName.trim()) {
      alert('Please enter a collection name');
      return;
    }
    const name = colFormName.trim();
    if (editingCollection) {
      // Renaming / updating existing collection
      await renameCollection(editingCollection.name, name, colFormImage || null, colFormDesc || null);
      notify(`Collection renamed to "${name}" & updated across all products!`);
    } else {
      // Creating new collection
      await saveCollection({
        name,
        description: colFormDesc,
        image: colFormImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80'
      });
      notify(`Collection "${name}" created!`);
    }
    setEditingCollection(null);
    setColFormName('');
    setColFormDesc('');
    setColFormImage('');
    await loadData();
  };

  const handleDeleteCollectionClick = async (col) => {
    if (!window.confirm(`Are you sure you want to delete collection "${col.name}"?`)) return;
    await deleteCollection(col.id || col.name);
    notify(`Collection "${col.name}" removed.`);
    await loadData();
  };

  // Filtering & Pagination Calculations
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        (p.collection && p.collection.toLowerCase().includes(search.toLowerCase()));
    const matchColl = selectedCollection === 'all' || p.collection?.toLowerCase() === selectedCollection.toLowerCase();
    return matchSearch && matchColl;
  });

  const totalItems = filteredProducts.length;
  const isAll = itemsPerPage === 'all';
  const perPageNum = isAll ? Math.max(1, totalItems) : Number(itemsPerPage);
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(totalItems / perPageNum));
  const startIndex = isAll ? 0 : (currentPage - 1) * perPageNum;
  const paginatedProducts = isAll
    ? filteredProducts
    : filteredProducts.slice(startIndex, startIndex + perPageNum);

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
              onClick={handleOpenCollectionsManager}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D6D3D1] bg-white text-xs font-semibold text-[#111111] hover:bg-[#F5F5F4] transition-colors cursor-pointer"
              title="Manage Collections & Cover Images"
            >
              <FolderTree size={13} /> Collections ({collections.length})
            </button>

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
        
        {/* Navigation Tabs (Products vs Orders) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E6E6E6]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white text-[#555555] hover:bg-[#F5F5F4] hover:text-[#111111] border border-[#E6E6E6]'
              }`}
            >
              <Layers size={14} />
              Products Catalog ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === 'orders'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white text-[#555555] hover:bg-[#F5F5F4] hover:text-[#111111] border border-[#E6E6E6]'
              }`}
            >
              <ShoppingBag size={14} />
              Customer Orders
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'orders' ? 'bg-[#C47C5A] text-white' : 'bg-[#EAF4E2] text-[#2E7D32]'
              }`}>
                {orders.length}
              </span>
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#D6D3D1] text-xs font-semibold text-[#111111] hover:bg-[#F5F5F4] transition cursor-pointer shadow-2xs"
              >
                <Download size={13} /> Export Orders to CSV
              </button>
            </div>
          )}
        </div>

        {activeTab === 'products' ? (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
                <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">Total Products</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans">{products.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
            <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">Active Collections</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans">{collections.length}</p>
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
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          <div className="flex flex-1 items-center gap-3">
            <div className="admin-search-container flex-1 max-w-md">
              <Search size={16} className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search sofas by name or collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input font-sans"
              />
            </div>

            <div className="admin-select-container">
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="admin-select-pill font-sans"
              >
                <option value="all">All Collections</option>
                {availableCollectionNames.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="admin-select-arrow" />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleSeedCatalog}
              className="admin-btn-secondary"
              title="Reset default 12 BritSofa products"
            >
              <RefreshCw size={14} />
              <span>Reset Default Catalog</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="admin-btn-black px-5 rounded-full text-xs font-semibold"
            >
              <Plus size={16} />
              <span>Add New Product</span>
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
              <p className="text-xs text-[#777777] mt-1">Try modifying your search filter or click &quot;Reset Default Catalog&quot;.</p>
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
                    <th className="py-3.5 px-4">Photos</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE5]">
                  {paginatedProducts.map((p) => {
                    const photosCount = (p.images && p.images.length > 0) ? p.images.length : (p.imageUrl ? 1 : 0);
                    return (
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
                        <td className="py-3.5 px-4 font-semibold text-[11px] text-[#666666]">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F5F5F4] border border-[#E6E6E6]">
                            <ImageIcon size={11} /> {photosCount} {photosCount === 1 ? 'img' : 'imgs'}
                          </span>
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
                              title="Edit Product & Photos"
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer with Pagination Controls */}
          <div className="px-5 py-4 bg-white border-t border-[#E6E6E6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#666666]">
              <span>
                Showing <strong className="text-[#111111]">{totalItems === 0 ? 0 : startIndex + 1}</strong>–<strong className="text-[#111111]">{Math.min(startIndex + perPageNum, totalItems)}</strong> of <strong className="text-[#111111]">{totalItems}</strong> products
              </span>
              <span className="text-[#D6D3D1]">|</span>
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#D6D3D1] px-2 py-1 text-xs font-semibold text-[#111111] bg-white cursor-pointer focus:outline-none"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="admin-pagination-btn"
                  title="Previous Page"
                >
                  <ChevronLeft size={15} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`admin-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="admin-pagination-btn"
                  title="Next Page"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
        </>
      ) : (
        /* ================= CUSTOMER ORDERS TAB CONTENT ================= */
        <div>
          {/* Orders Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
              <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans">{orders.length}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
              <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">Total Sales</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#2E7D32] font-sans">
                £{orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString('en-GB')}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
              <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">Average Order Value</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans">
                £{orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) / orders.length).toLocaleString('en-GB') : 0}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-2xs">
              <p className="text-xs text-[#777777] font-medium uppercase tracking-wider mb-1">Pending Confirmation</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#D97706] font-sans">
                {orders.filter(o => (o.status || 'Pending Confirmation') === 'Pending Confirmation').length}
              </p>
            </div>
          </div>

          {/* Orders Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
            <div className="flex flex-1 items-center gap-3">
              <div className="admin-search-container flex-1 max-w-md">
                <Search size={16} className="admin-search-icon" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer, phone, or UK postcode..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="admin-search-input font-sans"
                />
              </div>

              <div className="admin-select-container">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="admin-select-pill font-sans"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending Confirmation">Pending Confirmation</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <ChevronDown size={14} className="admin-select-arrow" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  const ords = await getAllOrders();
                  setOrders(ords || []);
                  notify('Orders list refreshed.');
                }}
                className="admin-btn-secondary"
                title="Refresh orders list"
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          </div>

          {/* Orders Table Container */}
          <div className="bg-white rounded-3xl border border-[#E6E6E6] overflow-hidden shadow-2xs">
            {filteredOrders.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#EAE6DF] flex items-center justify-center mx-auto mb-3 text-[#777777]">
                  <ShoppingBag size={24} />
                </div>
                <p className="text-base font-semibold text-[#111111]">No orders found</p>
                <p className="text-xs text-[#777777] mt-1">
                  {orderSearch || orderStatusFilter !== 'all' 
                    ? 'Try adjusting your search query or filter.' 
                    : 'Customer orders placed via checkout will automatically appear here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#333333]">
                  <thead className="bg-[#FAF9F5] text-[11px] font-bold uppercase tracking-wider text-[#777777] border-b border-[#E6E6E6]">
                    <tr>
                      <th className="py-3.5 px-4">Order Ref / Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Delivery Location</th>
                      <th className="py-3.5 px-4">Items Summary</th>
                      <th className="py-3.5 px-4">Total Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE5]">
                    {filteredOrders.map((o) => {
                      const cleanPhone = (o.customer?.phone || '').replace(/[^0-9]/g, '');
                      const status = o.status || 'Pending Confirmation';
                      const statusStyles = {
                        'Pending Confirmation': 'bg-amber-50 text-amber-800 border-amber-200',
                        'Confirmed': 'bg-blue-50 text-blue-800 border-blue-200',
                        'Out for Delivery': 'bg-purple-50 text-purple-800 border-purple-200',
                        'Delivered': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                        'Cancelled': 'bg-red-50 text-red-800 border-red-200'
                      }[status] || 'bg-gray-50 text-gray-800 border-gray-200';

                      return (
                        <tr key={o.orderId} className="hover:bg-[#FAF9F5] transition-colors">
                          {/* Order Ref & Date */}
                          <td className="py-3.5 px-4 font-mono">
                            <span className="font-bold text-[#111111] bg-[#F5F5F4] px-2 py-1 rounded-md text-[11px]">
                              #{o.orderId}
                            </span>
                            <p className="text-[11px] text-[#777777] mt-1 flex items-center gap-1 font-sans">
                              <Calendar size={11} /> {o.date}
                            </p>
                          </td>

                          {/* Customer */}
                          <td className="py-3.5 px-4 font-sans">
                            <p className="font-semibold text-sm text-[#111111]">
                              {o.customer?.fullName || 'Anonymous'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <a 
                                href={`tel:${o.customer?.phone}`}
                                className="text-[11px] text-[#555555] hover:underline flex items-center gap-1 font-mono"
                              >
                                <Phone size={10} /> {o.customer?.phone}
                              </a>
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${o.customer?.fullName || 'Customer'}! Regarding your Faneelo order #${o.orderId}:`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#25D366]/15 text-[#128C7E] font-bold hover:bg-[#25D366]/25"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle size={10} /> WhatsApp
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Delivery Location */}
                          <td className="py-3.5 px-4 font-sans">
                            <p className="font-bold text-[#111111] flex items-center gap-1">
                              <MapPin size={12} className="text-[#C47C5A]" />
                              {o.customer?.postcode || 'No Postcode'}
                            </p>
                            <p className="text-[11px] text-[#777777] line-clamp-1 mt-0.5">
                              {o.customer?.city ? `${o.customer.city}, ` : ''}{o.customer?.address}
                            </p>
                          </td>

                          {/* Items Summary */}
                          <td className="py-3.5 px-4 font-sans">
                            <div className="flex items-center gap-2">
                              {o.items?.[0]?.image && (
                                <img 
                                  src={o.items[0].image} 
                                  alt="Item" 
                                  className="w-10 h-10 rounded-lg object-cover border border-[#E6E6E6] bg-[#F5F5F4] flex-shrink-0"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-xs text-[#111111] line-clamp-1">
                                  {o.items?.[0]?.name}
                                </p>
                                <p className="text-[11px] text-[#777777]">
                                  {o.items?.[0]?.variant || 'Standard'} • Qty: {o.items?.[0]?.quantity || 1}
                                  {o.items?.length > 1 && ` (+${o.items.length - 1} more)`}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Total Amount */}
                          <td className="py-3.5 px-4 font-sans">
                            <p className="font-bold text-sm text-[#111111]">
                              £{Number(o.totalAmount || 0).toLocaleString('en-GB')}
                            </p>
                            <span className="text-[10px] text-[#2E7D32] font-semibold bg-[#EAF4E2] px-1.5 py-0.5 rounded">
                              Cash on Delivery
                            </span>
                          </td>

                          {/* Status with inline changer */}
                          <td className="py-3.5 px-4 font-sans">
                            <select
                              value={status}
                              onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                              className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none ${statusStyles}`}
                            >
                              <option value="Pending Confirmation">Pending Confirmation</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderDetails(o)}
                                className="p-1.5 rounded-lg text-[#555555] hover:text-[#111111] hover:bg-[#EFEBE4] transition cursor-pointer"
                                title="View Full Order Details"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(o.orderId)}
                                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
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
      )}
      </main>

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#E6E6E6] max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE5] mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#111111]">
                    Order #{selectedOrderDetails.orderId}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedOrderDetails.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOrderDetails.status === 'Confirmed'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedOrderDetails.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedOrderDetails.status || 'Pending Confirmation'}
                  </span>
                </div>
                <p className="text-xs text-[#777777] mt-1 flex items-center gap-3">
                  <span>Date: {selectedOrderDetails.date}</span>
                  {selectedOrderDetails.timestamp && (
                    <span>Placed: {new Date(selectedOrderDetails.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 rounded-full hover:bg-[#F5F5F4] text-[#777777] hover:text-[#111111] transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Delivery Card */}
            <div className="bg-[#FAF9F5] rounded-2xl p-4 sm:p-5 border border-[#EAE6DF] mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-3">Customer & Delivery Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[#888888]">Customer Name</p>
                  <p className="font-semibold text-sm text-[#111111]">{selectedOrderDetails.customer?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[#888888]">Phone Number</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a href={`tel:${selectedOrderDetails.customer?.phone}`} className="font-semibold text-[#111111] hover:underline flex items-center gap-1">
                      <Phone size={12} /> {selectedOrderDetails.customer?.phone}
                    </a>
                    {selectedOrderDetails.customer?.phone && (
                      <a
                        href={`https://wa.me/${(selectedOrderDetails.customer.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedOrderDetails.customer?.fullName || 'Customer'}! Regarding your Faneelo Sofa order #${selectedOrderDetails.orderId}:`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#25D366]/15 text-[#128C7E] font-bold text-[11px] hover:bg-[#25D366]/25"
                      >
                        <MessageCircle size={11} /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[#888888]">UK Delivery Address</p>
                  <p className="font-medium text-[#111111]">
                    {selectedOrderDetails.customer?.address}, {selectedOrderDetails.customer?.city}
                  </p>
                  <p className="font-bold text-[#111111] flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-[#C47C5A]" /> Postcode: {selectedOrderDetails.customer?.postcode}
                  </p>
                </div>
                <div>
                  <p className="text-[#888888]">Payment & Notes</p>
                  <p className="font-semibold text-[#2E7D32]">Cash on Delivery (COD)</p>
                  {selectedOrderDetails.customer?.deliveryNotes && (
                    <p className="text-[#666666] italic mt-1 bg-white p-2 rounded-lg border border-[#E6E6E6]">
                      &quot;{selectedOrderDetails.customer.deliveryNotes}&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-3">Order Items ({selectedOrderDetails.items?.length || 0})</h4>
              <div className="divide-y divide-[#F0ECE5] border border-[#E6E6E6] rounded-2xl overflow-hidden bg-white">
                {(selectedOrderDetails.items || []).map((it, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {it.image && (
                        <img src={it.image} alt={it.name} className="w-14 h-14 rounded-xl object-cover border border-[#E6E6E6] bg-[#F5F5F4]" />
                      )}
                      <div>
                        <p className="font-bold text-sm text-[#111111]">{it.name}</p>
                        <p className="text-xs text-[#666666]">
                          Variant: <span className="font-semibold text-[#111111]">{it.variant}</span> | Fabric: {it.fabric} | Colour: {it.color}
                        </p>
                        {it.facing && <p className="text-[11px] text-[#777777]">Facing: {it.facing}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-[#111111]">£{(Number(it.price) * Number(it.quantity || 1)).toLocaleString('en-GB')}</p>
                      <p className="text-[11px] text-[#777777]">Qty: {it.quantity || 1} × £{it.price}</p>
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-[#FAF9F5] flex justify-between items-center text-sm font-bold text-[#111111]">
                  <span>Total to Collect on Delivery:</span>
                  <span className="text-base text-[#111111]">£{Number(selectedOrderDetails.totalAmount || 0).toLocaleString('en-GB')}</span>
                </div>
              </div>
            </div>

            {/* Change Status & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F0ECE5]">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-[#777777]">Update Status:</span>
                <select
                  value={selectedOrderDetails.status || 'Pending Confirmation'}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrderDetails.orderId, e.target.value)}
                  className="rounded-xl border border-[#D6D3D1] px-3 py-1.5 text-xs font-semibold text-[#111111] bg-white cursor-pointer focus:outline-none"
                >
                  <option value="Pending Confirmation">Pending Confirmation</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedOrderDetails.orderId)}
                  className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition cursor-pointer"
                >
                  Delete Order
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#111111] text-white hover:bg-black text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-[#E6E6E6] max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE5] mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#111111]">
                  {editingProduct.id?.startsWith('prod_') && !editingProduct.createdAt ? 'Add New Luxury Sofa' : `Edit Sofa: ${editingProduct.name}`}
                </h3>
                <p className="text-xs text-[#777777] mt-0.5">
                  Update product details, multi-image gallery, colors, and variant pricing
                </p>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                      Collection / Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCollectionsOpen(true);
                      }}
                      className="text-[11px] text-[#C47C5A] hover:underline font-semibold cursor-pointer border-0 bg-transparent"
                    >
                      + Manage Collections
                    </button>
                  </div>
                  <select
                    value={editingProduct.collection}
                    onChange={(e) => setEditingProduct({ ...editingProduct, collection: e.target.value })}
                    className="w-full rounded-xl border border-[#D6D3D1] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-black cursor-pointer bg-white"
                  >
                    {availableCollectionNames.map(c => (
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

              {/* ================= MULTI-IMAGE GALLERY SECTION ================= */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[#E6E6E6] bg-[#FAF9F5] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                      <ImageIcon size={16} /> Product Photos & Multi-Image Gallery
                    </h4>
                    <p className="text-[11px] text-[#777777] mt-0.5">
                      Upload multiple photos (different angles, fabrics, living room setups). The starred cover photo is shown on product cards.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full admin-btn-black text-xs font-semibold cursor-pointer shadow-2xs self-start sm:self-auto">
                    <Upload size={14} /> Upload Multiple Photos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultiImagesUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct Image URL input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Or paste an image URL and click Add to Gallery..."
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    className="flex-1 rounded-xl border border-[#D6D3D1] bg-white px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 rounded-xl bg-[#F0ECE5] hover:bg-[#E5E0D8] text-xs font-semibold text-[#111111] transition cursor-pointer"
                  >
                    + Add URL
                  </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {(editingProduct.images || []).map((imgUrl, imgIdx) => {
                    const isCover = (editingProduct.imageUrl === imgUrl) || (!editingProduct.imageUrl && imgIdx === 0);
                    return (
                      <div 
                        key={imgIdx} 
                        className={`admin-gallery-card group ${isCover ? 'is-primary' : ''}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${imgIdx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Cover Badge */}
                        {isCover && (
                          <div className="absolute top-1.5 left-1.5 bg-[#111111] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <Star size={10} className="fill-amber-400 text-amber-400" /> Cover
                          </div>
                        )}

                        {/* Action Overlay */}
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(imgUrl)}
                              className="p-1.5 rounded-lg bg-white text-[#111111] hover:bg-amber-100 transition text-[10px] font-bold cursor-pointer"
                              title="Set as Main Cover Photo"
                            >
                              <Star size={12} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(imgIdx)}
                            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {(!editingProduct.images || editingProduct.images.length === 0) && (
                    <div className="col-span-full py-8 text-center text-xs text-[#888888] border-2 border-dashed border-[#D6D3D1] rounded-2xl bg-white">
                      <ImageIcon size={28} className="mx-auto mb-1.5 text-[#AAAAAA]" />
                      No photos in gallery. Click &quot;Upload Multiple Photos&quot; or paste a link above.
                    </div>
                  )}
                </div>
              </div>

              {/* ================= COLOR PALETTE & SWATCHES ================= */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[#E6E6E6] bg-[#FAF9F5] space-y-3.5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                    <Palette size={16} /> Color Swatches & Fabric Options
                  </h4>
                  <p className="text-[11px] text-[#777777] mt-0.5">
                    Manage colors available for this sofa. Customers will see these in the interactive color selector.
                  </p>
                </div>

                {/* Active Color Chips */}
                <div className="flex flex-wrap gap-2 items-center min-h-[42px] p-2.5 rounded-xl bg-white border border-[#D6D3D1]">
                  {getCurrentColorList().map((cName, cIdx) => (
                    <span key={cIdx} className="admin-color-chip">
                      <span 
                        className="w-3 h-3 rounded-full border border-black/15 inline-block shrink-0" 
                        style={{ backgroundColor: getColorHex(cName) }}
                      />
                      <span>{cName}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(cName)}
                        className="text-[#888888] hover:text-red-600 cursor-pointer border-0 bg-transparent p-0 ml-0.5"
                        title={`Remove ${cName}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {getCurrentColorList().length === 0 && (
                    <span className="text-xs text-[#888888] italic">No colors added yet. Pick from quick-add options below.</span>
                  )}
                </div>

                {/* Custom Color Add Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type custom color (e.g. Sage Green, Ivory Bouclé, Mustard Gold)..."
                    value={newColorInput}
                    onChange={(e) => setNewColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomColor();
                      }
                    }}
                    className="flex-1 rounded-xl border border-[#D6D3D1] bg-white px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-4 py-2 rounded-xl bg-[#F0ECE5] hover:bg-[#E5E0D8] text-xs font-semibold text-[#111111] transition cursor-pointer"
                  >
                    + Add Color
                  </button>
                </div>

                {/* Quick Add Bestsellers */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
                    Quick-Add Bestselling UK Colors:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_UK_COLORS.map((col) => {
                      const alreadyAdded = getCurrentColorList().some(c => c.toLowerCase() === col.toLowerCase());
                      return (
                        <button
                          key={col}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => handleAddColorPill(col)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer border ${
                            alreadyAdded
                              ? 'bg-[#EAF4E2] text-[#2E7D32] border-[#C8E6C9] opacity-70 cursor-default'
                              : 'bg-white text-[#333333] border-[#E6E6E6] hover:border-[#111111] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0" 
                            style={{ backgroundColor: getColorHex(col) }}
                          />
                          <span>{alreadyAdded ? `✓ ${col}` : `+ ${col}`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fabric types */}
                <div className="pt-2 border-t border-[#E6E6E6]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Available Fabrics (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.fabric || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    placeholder="e.g. Plush Velvet, Chenille, Bouclé, Jumbo Cord, Linen"
                    className="w-full rounded-xl border border-[#D6D3D1] bg-white px-3.5 py-2 text-xs focus:outline-none focus:border-black"
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
                      Each size (e.g. 1-Seater, 2-Seater, Corner) gets its own photo and price on the filter pages!
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

      {/* ================= COLLECTIONS & CATEGORIES MANAGER MODAL ================= */}
      {isCollectionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-[#E6E6E6] max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE5] mb-5">
              <div>
                <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <FolderTree size={20} /> Collections & Categories Manager
                </h3>
                <p className="text-xs text-[#777777] mt-0.5">
                  Create new collections, rename existing collections, and customize collection cover photos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCollectionsOpen(false);
                  setEditingCollection(null);
                }}
                className="p-1 rounded-full text-[#777777] hover:bg-[#F5F5F4] cursor-pointer border-0 bg-transparent"
              >
                <X size={18} />
              </button>
            </div>

            {/* Create / Edit Collection Box */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E6E6] mb-6 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                {editingCollection ? `Edit / Rename Collection: "${editingCollection.name}"` : '+ Add New Collection'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kensington, Mayfair, Luxury Bouclé..."
                    value={colFormName}
                    onChange={(e) => setColFormName(e.target.value)}
                    className="w-full rounded-xl border border-[#D6D3D1] bg-white px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Handcrafted modern designer sofas..."
                    value={colFormDesc}
                    onChange={(e) => setColFormDesc(e.target.value)}
                    className="w-full rounded-xl border border-[#D6D3D1] bg-white px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Cover Photo */}
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                  Collection Cover Photo
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {colFormImage ? (
                    <img
                      src={colFormImage}
                      alt="Collection Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-[#E6E6E6] bg-white"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl border-2 border-dashed border-[#D6D3D1] flex items-center justify-center text-[#888888]">
                      <ImageIcon size={18} />
                    </div>
                  )}
                  <div className="flex-1 flex gap-2 w-full">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D6D3D1] text-xs font-semibold text-[#111111] hover:bg-[#F5F5F4] cursor-pointer transition">
                      <Upload size={13} /> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCollectionImageUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste direct image URL..."
                      value={colFormImage}
                      onChange={(e) => setColFormImage(e.target.value)}
                      className="flex-1 rounded-xl border border-[#D6D3D1] bg-white px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                {editingCollection && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCollection(null);
                      setColFormName('');
                      setColFormDesc('');
                      setColFormImage('');
                    }}
                    className="px-4 py-2 rounded-full border border-[#D6D3D1] bg-white text-xs font-semibold text-[#555555] cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveCollectionForm}
                  className="px-5 py-2 rounded-full admin-btn-black text-xs font-semibold cursor-pointer"
                >
                  {editingCollection ? 'Save & Cascade Rename' : '+ Create Collection'}
                </button>
              </div>
            </div>

            {/* List of Existing Collections */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">
                Existing Collections ({collections.length})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {collections.map((col) => {
                  const count = products.filter(p => (p.collection || '').toLowerCase() === col.name.toLowerCase()).length;
                  return (
                    <div 
                      key={col.id || col.name}
                      className="p-3.5 rounded-2xl border border-[#E6E6E6] bg-white flex items-center gap-3 hover:border-[#111111]/40 transition"
                    >
                      <img
                        src={col.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'}
                        alt={col.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#E6E6E6] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-[#111111] truncate">{col.name}</p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E6E6E6] text-[#666666]">
                            {count} {count === 1 ? 'sofa' : 'sofas'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#777777] line-clamp-1 mt-0.5">
                          {col.description || 'Collection category'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCollection(col);
                            setColFormName(col.name);
                            setColFormDesc(col.description || '');
                            setColFormImage(col.image || '');
                          }}
                          className="p-1.5 text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F4] rounded-lg cursor-pointer border-0 bg-transparent"
                          title="Edit / Rename Collection"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCollectionClick(col)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer border-0 bg-transparent"
                          title="Delete Collection"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
