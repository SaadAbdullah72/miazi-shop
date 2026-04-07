import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api, { BASE_URL } from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { 
    Package, Users, ShoppingBag, Layers, Plus, Trash2, Edit, 
    Loader, X, Upload, LayoutDashboard, Settings, LogOut, Menu, ChevronLeft, ChevronRight, Zap, Star, ShieldCheck, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboardPage = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Product Form State
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', price: '', discountPrice: '', description: '', brand: '', countInStock: '', category: '', images: ['']
    });

    // Category Form State
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', image: '' });

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [userInfo, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes, ordRes] = await Promise.all([
                api.get('/api/products'),
                api.get('/api/categories'),
                api.get('/api/orders'),
            ]);
            setProducts(prodRes.data.products || []);
            setCategories(catRes.data || []);
            setOrders(ordRes.data || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // ============== PRODUCT CRUD ==============
    const resetProductForm = () => {
        setProductForm({ name: '', price: '', discountPrice: '', description: '', brand: '', countInStock: '', category: '', images: [''] });
        setEditingProduct(null);
        setShowProductForm(false);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...productForm,
                price: Number(productForm.price),
                discountPrice: Number(productForm.discountPrice) || 0,
                countInStock: Number(productForm.countInStock),
                slug: productForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
                images: productForm.images.filter(img => img.trim() !== ''),
            };

            if (editingProduct) {
                await api.put(`/api/products/${editingProduct._id}`, payload);
                toast.success('Product updated!');
            } else {
                const res = await api.post('/api/products', { categoryId: payload.category });
                await api.put(`/api/products/${res.data._id}`, payload);
                toast.success('Product created!');
            }
            resetProductForm();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const editProduct = (p) => {
        setProductForm({
            name: p.name, price: p.price, discountPrice: p.discountPrice || '', description: p.description,
            brand: p.brand, countInStock: p.countInStock, category: p.category?._id || p.category || '',
            images: p.images?.length ? p.images : ['']
        });
        setEditingProduct(p);
        setShowProductForm(true);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/api/products/${id}`);
            toast.success('Product deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await api.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setProductForm(prev => ({ ...prev, images: [data.image, ...prev.images.filter(i => i)] }));
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error('Upload failed');
        }
    };

    // ============== CATEGORY CRUD ==============
    const resetCategoryForm = () => {
        setCategoryForm({ name: '', slug: '', image: '' });
        setEditingCategory(null);
        setShowCategoryForm(false);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...categoryForm, slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-') };
            if (editingCategory) {
                await api.put(`/api/categories/${editingCategory._id}`, payload);
                toast.success('Category updated!');
            } else {
                await api.post('/api/categories', payload);
                toast.success('Category created!');
            }
            resetCategoryForm();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await api.delete(`/api/categories/${id}`);
            toast.success('Category deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    // ============== ORDER STATUS ==============
    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/api/orders/${orderId}/status`, { status });
            toast.success(`Order marked as ${status}`);
            fetchData();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center py-64 bg-silk-white h-screen">
                <Loader size={40} className="animate-spin text-void-black" />
            </div>
        );
    }

    const navigation = [
        { id: 'products', name: 'Inventory Master', icon: Package },
        { id: 'categories', name: 'Category Registry', icon: Layers },
        { id: 'orders', name: 'Logistics Center', icon: ShoppingBag },
    ];

    return (
        <div className="min-h-screen bg-silk-white flex">
            {/* SIDEBAR REVOLUTION */}
            <aside 
                className={`bg-void-black text-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] sticky top-0 h-screen overflow-hidden z-50 flex flex-col ${isSidebarOpen ? 'w-80' : 'w-20'}`}
            >
                {/* Brand Identity */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between min-h-[100px]">
                    <div className={`flex items-center gap-4 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="w-10 h-10 bg-alpha-gold rounded-full flex items-center justify-center">
                            <Zap size={22} className="text-void-black fill-void-black" />
                        </div>
                        <span className="font-black text-xl tracking-tighter uppercase italic">MIAZI_ALPHA</span>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-sm transition-colors"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Nav Registry */}
                <nav className="flex-grow p-4 mt-8 flex flex-col gap-2">
                    {navigation.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 relative group truncate ${activeTab === item.id ? 'text-alpha-gold' : 'text-white/40 hover:text-white'}`}
                        >
                            <item.icon size={22} className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                            {isSidebarOpen && (
                                <span className={`text-[13px] font-black uppercase tracking-widest transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                                    {item.name}
                                </span>
                            )}
                            {activeTab === item.id && (
                                <motion.div layoutId="nav-glow" className="absolute left-0 w-1 h-8 bg-alpha-gold shadow-[0_0_20px_#fed700] rounded-r-full" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* System Logout */}
                <div className="p-8 border-t border-white/5">
                    <Link to="/" className="flex items-center gap-4 text-white/20 hover:text-red-500 transition-colors px-6">
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="text-[12px] font-black uppercase tracking-widest leading-none">EXIT_CONTROL</span>}
                    </Link>
                </div>
            </aside>

            {/* MAIN COMMAND AREA */}
            <main className="flex-grow p-8 lg:p-16 overflow-y-auto max-h-screen">
                <header className="mb-16 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-[2px] w-12 bg-void-black"></div>
                            <span className="text-label text-void-black opacity-40">ADMIN_LOG // COMMAND_CENTER_V4</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-void-black tracking-tighter uppercase italic">
                            MASTER <span className="opacity-10 text-white drop-shadow-[2px_2px_0_#000]">CONTROL.</span>
                        </h1>
                    </div>
                </header>

                {/* FLAGSHIP STRUCTURAL STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 px-4 md:px-0">
                    {[
                        { label: 'Inventory_Registry', val: products.length, icon: Package, color: 'text-alpha-gold' },
                        { label: 'Category_Nodes', val: categories.length, icon: Layers, color: 'text-blue-500' },
                        { label: 'Active_Deployments', val: orders.length, icon: ShoppingBag, color: 'text-green-500' },
                        { label: 'Gross_Credits', val: `৳${orders.reduce((a, o) => a + (o.totalPrice || 0), 0).toLocaleString()}`, icon: Zap, color: 'text-purple-500' },
                    ].map((stat, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i} 
                            className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-void-black opacity-5 group-hover:opacity-100 group-hover:bg-alpha-gold transition-all"></div>
                            <div className="flex items-center gap-4 mb-6 opacity-40">
                                <stat.icon size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] font-poppins">{stat.label}</span>
                            </div>
                            <p className={`text-4xl font-black tracking-tighter italic ${stat.color}`}>{stat.val}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-2xl">
                    {/* Tab Header Overlay */}
                    <div className="bg-silk-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-void-black"></div>
                            <h3 className="text-sm font-black uppercase tracking-widest opacity-40">NODE_CONTENT // {activeTab}</h3>
                        </div>
                    </div>

                    <div className="p-8 lg:p-12">
                        {/* ============== PRODUCTS TAB ============== */}
                        {activeTab === 'products' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                                    <h2 className="text-3xl font-black text-void-black tracking-tighter uppercase italic">
                                        INVENTORY_LEDGER <span className="text-void-black/20">({products.length})</span>
                                    </h2>
                                    <button 
                                        onClick={() => { resetProductForm(); setShowProductForm(true); }}
                                        className="btn-dark py-3 px-8 text-xs group"
                                    >
                                        REGISTER_NEW_UNIT <Plus size={16} className="ml-2 group-hover:rotate-180 transition-transform" />
                                    </button>
                                </div>

                                {/* Products Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="pb-6 text-label opacity-40">IMAGE</th>
                                                <th className="pb-6 text-label opacity-40">IDENTIFIER</th>
                                                <th className="pb-6 text-label opacity-40 text-center">VALUE</th>
                                                <th className="pb-6 text-label opacity-40 text-center">STOCK</th>
                                                <th className="pb-6 text-label opacity-40">SECTOR</th>
                                                <th className="pb-6 text-label opacity-40 text-right">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {products.length === 0 ? (
                                                <tr><td colSpan="6" className="text-center py-20 text-void-black/20 font-black italic">NO_DATA_AVAILABLE</td></tr>
                                            ) : products.map((p) => (
                                                <tr key={p._id} className="group hover:bg-silk-white transition-colors">
                                                    <td className="py-6">
                                                        <div className="w-16 h-16 bg-silk-white rounded-sm p-2 flex items-center justify-center border border-gray-50 overflow-hidden group-hover:scale-110 transition-transform">
                                                            <img 
                                                                src={p.images?.[0]?.startsWith('http') ? p.images[0] : `${BASE_URL}${p.images?.[0]}`} 
                                                                alt="" 
                                                                className="w-full h-full object-contain" 
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="py-6">
                                                        <p className="font-bold text-void-black leading-tight max-w-[240px] truncate">{p.name}</p>
                                                        <span className="text-[9px] font-black uppercase text-void-black/20 tracking-widest mt-1 block">ID_{p._id.slice(-6)}</span>
                                                    </td>
                                                    <td className="py-6 text-center font-black text-void-black italic">৳{p.price.toLocaleString()}</td>
                                                    <td className="py-6 text-center">
                                                        <span className={`text-[10px] font-black px-3 py-1 rounded-sm border ${p.countInStock > 5 ? 'border-green-100 text-green-600 bg-green-50' : 'border-red-100 text-red-500 bg-red-50'}`}>
                                                            {p.countInStock} _UNITS
                                                        </span>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-void-black/40 italic">{p.category?.name || 'GENERIC'}</span>
                                                    </td>
                                                    <td className="py-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => editProduct(p)} className="p-2 hover:text-alpha-gold transition-colors"><Edit size={16} /></button>
                                                            <button onClick={() => deleteProduct(p._id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* ============== CATEGORIES TAB ============== */}
                        {activeTab === 'categories' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                                    <h2 className="text-3xl font-black text-void-black tracking-tighter uppercase italic">
                                        CATEGORY_REGISTRY <span className="text-void-black/20">({categories.length})</span>
                                    </h2>
                                    <button 
                                        onClick={() => { resetCategoryForm(); setShowCategoryForm(true); }}
                                        className="btn-dark py-3 px-8 text-xs group"
                                    >
                                        CREATE_NEW_SECTOR <Plus size={16} className="ml-2 group-hover:rotate-180 transition-transform" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {categories.length === 0 ? (
                                        <div className="col-span-full text-center py-20 text-void-black/20 font-black italic">NO_SECTORS_INITIALIZED</div>
                                    ) : categories.map((c) => (
                                        <div key={c._id} className="bg-white border border-gray-100 p-8 flex justify-between items-center group hover:border-void-black transition-all">
                                            <div>
                                                <h3 className="font-black text-xl text-void-black italic tracking-tighter uppercase">{c.name}</h3>
                                                <p className="text-[10px] font-black text-void-black/20 tracking-[0.3em] uppercase mt-1">/{c.slug}</p>
                                            </div>
                                            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setCategoryForm({ name: c.name, slug: c.slug, image: c.image || '' }); setEditingCategory(c); setShowCategoryForm(true); }} className="hover:text-alpha-gold transition-colors"><Edit size={18} /></button>
                                                <button onClick={() => deleteCategory(c._id)} className="hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ============== ORDERS TAB ============== */}
                        {activeTab === 'orders' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="mb-12">
                                    <h2 className="text-3xl font-black text-void-black tracking-tighter uppercase italic">
                                        LOGISTICS_LEDGER <span className="text-void-black/20">({orders.length})</span>
                                    </h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="pb-6 text-label opacity-40">ORDER_UID</th>
                                                <th className="pb-6 text-label opacity-40">RECIPIENT</th>
                                                <th className="pb-6 text-label opacity-40">DEPLOY_DATE</th>
                                                <th className="pb-6 text-label opacity-40">CREDITS</th>
                                                <th className="pb-6 text-label opacity-40">STATUS_LAYER</th>
                                                <th className="pb-6 text-label opacity-40 text-right">COMMAND</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {orders.length === 0 ? (
                                                <tr><td colSpan="6" className="text-center py-20 text-void-black/20 font-black italic">NO_DEPLOYMENTS_FOUND</td></tr>
                                            ) : orders.map((o) => (
                                                <tr key={o._id} className="group hover:bg-silk-white transition-colors">
                                                    <td className="py-6 font-mono text-[11px] font-black text-void-black/30">#{o._id.slice(-10).toUpperCase()}</td>
                                                    <td className="py-6">
                                                        <p className="font-bold text-void-black italic">{o.user?.name || 'UNAUTHORIZED_ENTITY'}</p>
                                                    </td>
                                                    <td className="py-6 text-xs font-black uppercase text-void-black/40">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-6 font-black text-void-black text-lg tracking-tighter">৳{o.totalPrice?.toLocaleString()}</td>
                                                    <td className="py-6">
                                                        <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full ${
                                                            o.orderStatus === 'Delivered' ? 'bg-green-600 text-white' :
                                                            o.orderStatus === 'Shipped' ? 'bg-blue-600 text-white' :
                                                            'bg-alpha-gold text-void-black'
                                                        }`}>
                                                            {o.orderStatus || 'PENDING'}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 text-right">
                                                        <select 
                                                            onChange={(e) => updateOrderStatus(o._id, e.target.value)} 
                                                            defaultValue=""
                                                            className="bg-silk-white border border-gray-100 text-[10px] font-black uppercase px-3 py-2 outline-none focus:border-alpha-gold transition-colors"
                                                        >
                                                            <option value="" disabled>UPDATE_STATUS</option>
                                                            <option value="Processing">PROCESSING</option>
                                                            <option value="Shipped">SHIPPED</option>
                                                            <option value="Delivered">DELIVERED</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* MODALS REFINEMENT */}
                <AnimatePresence>
                    {(showProductForm || showCategoryForm) && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-void-black/80 backdrop-blur-sm"
                        >
                            <motion.div 
                                initial={{ y: 50, scale: 0.95 }}
                                animate={{ y: 0, scale: 1 }}
                                exit={{ y: 50, scale: 0.95 }}
                                className="bg-white w-full max-w-4xl p-12 relative max-h-[90vh] overflow-y-auto"
                            >
                                <button 
                                    onClick={() => { setShowProductForm(false); setShowCategoryForm(false); }}
                                    className="absolute top-8 right-8 text-void-black/20 hover:text-void-black transition-colors"
                                >
                                    <X size={32} />
                                </button>

                                {showProductForm ? (
                                    <div>
                                        <h3 className="text-4xl font-black text-void-black tracking-tighter uppercase italic mb-12">
                                            PRODUCT_CONFIG <span className="text-alpha-gold">// {editingProduct ? 'UPDATE' : 'DEPLOY'}</span>
                                        </h3>
                                        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-label">UNIT_NAME</label>
                                                <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="border-b-2 border-gray-100 py-3 outline-none focus:border-void-black transition-colors font-bold" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-10">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-label">BASE_PRICE</label>
                                                    <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="border-b-2 border-gray-100 py-3 outline-none focus:border-void-black transition-colors font-bold" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-label">STOCK_UNITS</label>
                                                    <input type="number" required value={productForm.countInStock} onChange={e => setProductForm({...productForm, countInStock: e.target.value})} className="border-b-2 border-gray-100 py-3 outline-none focus:border-void-black transition-colors font-bold" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-label">SECTOR_ASSIGN</label>
                                                <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="border-b-2 border-gray-100 py-3 outline-none focus:border-void-black transition-colors font-bold bg-white">
                                                    <option value="">SELECT_CATEGORY</option>
                                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-label">IMAGE_DATA_SOURCE (URL)</label>
                                                <input type="text" value={productForm.images[0] || ''} onChange={e => setProductForm({...productForm, images: [e.target.value]})} className="border-b-2 border-gray-100 py-3 outline-none focus:border-void-black transition-colors font-bold" />
                                            </div>
                                            <div className="md:col-span-2 flex flex-col gap-2">
                                                <label className="text-label">TECHNICAL_DESC</label>
                                                <textarea required rows="4" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="border-2 border-gray-100 p-4 outline-none focus:border-void-black transition-colors font-medium resize-none" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <button type="submit" className="w-full btn-dark py-6 text-lg">PROCEED_WITH_DATA_LOCKED</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-4xl font-black text-void-black tracking-tighter uppercase italic mb-12">
                                            SECTOR_CONFIG <span className="text-alpha-gold">// CREATE</span>
                                        </h3>
                                        <form onSubmit={handleCategorySubmit} className="flex flex-col gap-10">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-label">CATEGORY_NAME</label>
                                                <input type="text" required value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="border-b-2 border-gray-100 py-3 outline-none focus:border-void-black transition-colors font-bold text-2xl uppercase tracking-tighter" />
                                            </div>
                                            <button type="submit" className="btn-dark py-6 text-lg">INITIALIZE_NEW_SECTOR</button>
                                        </form>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
