import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../slices/productSlice';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Star, List } from 'lucide-react';
import { BASE_URL } from '../utils/axiosConfig';

const HomePage = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.product);
    const location = useLocation();
    
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');

    useEffect(() => {
        dispatch(listProducts({ 
            keyword: keyword || '', 
            category: category || '' 
        }));
    }, [dispatch, keyword, category]);

    return (
        <div className="bg-electro-bg min-h-screen pb-20">
            
            {/* PREMIUM ELECTRO HERO SLIDER */}
            {!keyword && !category && (
                <section className="relative py-16 md:py-24 mb-12 overflow-hidden shadow-sm border-b border-gray-200">
                    <div className="absolute inset-0 z-0">
                        <img src="/hero_bg.png" alt="tech background" className="w-full h-full object-cover opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/98 via-gray-50/90 to-emerald-50/60"></div>
                    </div>
                    
                    <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="flex-1 max-w-xl animate-fade-in-up">
                            <div className="text-[14px] font-bold text-electro-blue uppercase tracking-widest mb-4">The New Standard</div>
                            <h1 className="text-4xl md:text-6xl font-sans font-light text-electro-dark leading-tight mb-6">
                                <span className="font-bold block">Under Favorable</span> Smartphones
                            </h1>
                            <div className="text-xl text-electro-text mb-8 flex items-center gap-2">
                                <span className="text-sm">From</span> <span className="font-bold">৳15,000</span>
                            </div>
                            <Link to="/?category=smartphone" className="btn-electro text-sm bg-electro-yellow hover:bg-black hover:text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition">
                                START BUYING
                            </Link>
                        </div>
                        <div className="flex-1 right-img relative flex justify-end pr-10">
                             <img 
                                src="/hero_phone.png" 
                                alt="Premium Flagship Smartphone" 
                                className="max-w-[70%] md:max-w-[95%] h-auto object-contain transition-all duration-1000 hover:scale-110 drop-shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-10 mix-blend-multiply [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_100%)] filter contrast-[1.1] brightness-[1.05]"
                             />
                        </div>
                    </div>
                </section>
            )}

            {/* MAIN CATALOG AREA */}
            <section id="shop-section" className="bg-gray-50/50 py-10 border-t border-gray-200">
                <div className="container-custom flex flex-col lg:flex-row gap-8">
                
                {/* LEFT SIDEBAR (Electro features sidebars heavily) */}
                {!keyword && !category && (
                    <aside className="w-full lg:w-1/4 flex flex-col gap-8 hidden lg:flex">
                        
                        {/* Categories Widget */}
                        <div className="bg-white border border-electro-border rounded p-5">
                            <h3 className="font-bold text-electro-dark border-b border-electro-border pb-3 mb-4 flex items-center gap-2">
                               <List size={18} /> Browse Categories
                            </h3>
                            <ul className="space-y-3">
                                {['Smartphones', 'Laptops', 'Audio', 'Accessories', 'Smartwatches'].map(cat => (
                                    <li key={cat}>
                                        <Link to={`/?category=${cat.toLowerCase()}`} className="text-sm text-electro-text hover:text-electro-yellow flex items-center justify-between group transition">
                                            {cat} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Latest Products Widget Parody */}
                        <div className="bg-white border border-electro-border rounded p-5">
                            <h3 className="font-bold text-electro-dark border-b border-electro-border pb-3 mb-4">
                               Latest Products
                            </h3>
                            <div className="space-y-4">
                                {products?.slice(0, 3).map(p => (
                                    <Link key={p._id} to={`/product/${p.slug}`} className="flex items-center gap-4 group">
                                        <img 
                                            src={p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `${BASE_URL}${p.images[0]}`) : 'https://placehold.co/100x100/FFFFFF/333e48?text=Product'}
                                            className="w-16 h-16 object-contain border border-electro-border rounded p-1 group-hover:border-electro-yellow transition mix-blend-multiply" 
                                            alt={p.name} 
                                        />
                                        <div>
                                            <div className="text-xs text-electro-blue group-hover:underline line-clamp-2 leading-tight">{p.name}</div>
                                            <div className="font-bold text-electro-dark text-sm mt-1">৳{p.price}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </aside>
                )}

                {/* RIGHT PRODUCT GRID - ENHANCED POLISH */}
                <div className={`w-full ${(keyword || category) ? 'lg:w-full' : 'lg:w-3/4'}`}>
                    
                    {/* Header bar */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-electro-border pb-6">
                        <div className="space-y-1">
                             <div className="flex items-center gap-2 text-electro-blue text-[10px] font-bold uppercase tracking-[0.2em]">
                                <List size={14} /> Recommended for you
                             </div>
                             <h2 className="text-3xl font-bold text-electro-dark tracking-tight">
                                {keyword ? `Search Results for "${keyword}"` : category ? `${category.toUpperCase()}` : 'Best Sellers'}
                             </h2>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-sm text-gray-400 font-medium">
                                Showing <span className="text-electro-dark font-bold">{products?.length || 0}</span> results
                            </div>
                            <Link to="/" className="group flex items-center gap-2 text-sm font-bold text-electro-blue hover:text-electro-dark transition-all">
                                VIEW ALL <div className="p-1 px-3 bg-electro-yellow rounded-full text-electro-dark group-hover:bg-black group-hover:text-white transition-all"><ChevronRight size={14} /></div>
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-80 bg-white/50 rounded-2xl border border-gray-100 shadow-inner">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electro-yellow mb-4"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Syncing Inventory...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100">
                            {error}
                        </div>
                    ) : (!products || products.length === 0) ? (
                        <div className="text-center py-20 bg-white border border-electro-border rounded-xl">
                            <h3 className="text-xl text-electro-dark font-bold mb-2 text-center w-full">No products found</h3>
                            <p className="text-electro-text">Try adjusting your search or category filter.</p>
                            <Link to="/" className="inline-block mt-6 text-electro-blue hover:underline">Clear all filters</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-electro-border bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                            {products.map((p, idx) => (
                                <Link to={`/product/${p.slug}`} key={p._id} className="electro-product-card group relative overflow-hidden">
                                    
                                    {/* Badges */}
                                    {idx < 2 && (
                                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                                            <span className="bg-red-600 text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-widest">SALE</span>
                                            {idx === 0 && <span className="bg-electro-yellow text-electro-dark text-[9px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-widest">HOT</span>}
                                        </div>
                                    )}

                                    {/* Category */}
                                    <div className="electro-product-category">
                                        {p.category?.name || p.category || 'Electronics'}
                                    </div>
                                    
                                    {/* Title */}
                                    <h3 className="electro-product-title" title={p.name}>
                                        {p.name}
                                    </h3>

                                    {/* Image */}
                                    <div className="relative flex-grow flex items-center justify-center my-4 overflow-hidden">
                                        <img 
                                            src={p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `${BASE_URL}${p.images[0]}`) : 'https://placehold.co/400x400/FFFFFF/333e48?text=Product'}
                                            alt={p.name}
                                            className="electro-product-img mix-blend-multiply group-hover:scale-110 transition-transform duration-700 p-2"
                                        />
                                    </div>

                                    {/* Price & Rating */}
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} className={i < Math.round(p.rating || 0) ? 'fill-electro-yellow text-electro-yellow' : 'text-gray-200'} />
                                            ))}
                                            <span className="text-[10px] text-gray-400 ml-1 font-bold">({p.numReviews || 0})</span>
                                        </div>

                                        <div className="electro-product-price mb-4 italic">
                                            ৳{p.price}
                                        </div>
                                        
                                        {/* Hover Cart Action */}
                                        <div className="electro-cart-action">
                                            <button 
                                                className="w-full btn-electro-pill text-[10px] flex items-center justify-center py-2.5 shadow-md"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // Add to cart dispatch
                                                }}
                                            >
                                                <ShoppingBag size={14} className="mr-2" strokeWidth={2.5} /> Add to Cart
                                            </button>
                                        </div>
                                    </div>

                                </Link>
                            ))}
                        </div>
                    )}

                </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
