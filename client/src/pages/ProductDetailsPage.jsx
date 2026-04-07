import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { Star, ShoppingBag, ArrowLeft, Loader, ChevronRight, ShieldCheck, Truck, Zap, Heart, Share2, Info } from 'lucide-react';
import api, { BASE_URL } from '../utils/axiosConfig';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    const { loading, error, productDetails: product } = useSelector((state) => state.product);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getProductDetails(id));
        window.scrollTo(0, 0);
    }, [dispatch, id]);

    const addToCartHandler = () => {
        if (product && product.countInStock > 0) {
            dispatch(addToCart({ ...product, qty }));
            toast.success('Product added to cart!');
            navigate('/cart');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!rating) {
            toast.error('Please select a rating');
            return;
        }
        try {
            setReviewLoading(true);
            await api.post(`/api/products/${id}/reviews`, { rating, comment });
            dispatch(getProductDetails(id));
            toast.success('Review submitted successfully!');
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center py-64 bg-white h-screen">
            <Loader size={40} className="animate-spin text-electro-yellow mb-4" />
            <span className="text-electro-text font-bold animate-pulse">Loading Product Details...</span>
        </div>
    );
    
    if (error) return (
        <div className="container-custom py-20 text-center">
            <div className="bg-red-50 text-red-600 p-10 rounded-lg border border-red-100 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Error Loading Product</h2>
                <p className="mb-8">{error}</p>
                <Link to="/" className="btn-electro bg-electro-yellow text-electro-dark px-10 py-3 rounded-full font-bold">Return Home</Link>
            </div>
        </div>
    );

    if (!product) return null;

    return (
        <div className="bg-electro-bg min-h-screen pb-20">
            {/* BREADCRUMB */}
            <div className="border-b border-gray-200 bg-white shadow-sm mb-10">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-electro-blue">Home</Link>
                    <ChevronRight size={14} />
                    <Link to={`/?category=${product.category?.slug}`} className="hover:text-electro-blue">{product.category?.name || 'Category'}</Link>
                    <ChevronRight size={14} />
                    <span className="text-electro-dark font-bold truncate max-w-[200px] md:max-w-none">{product.name}</span>
                </div>
            </div>

            <div className="container-custom">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-10 mb-10 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        
                        {/* LEFT: IMAGE GALLERY */}
                        <div className="space-y-6">
                            <div className="relative group bg-white border border-gray-100 rounded-lg p-4 md:p-12 flex items-center justify-center overflow-hidden h-[400px] md:h-[550px]">
                                <img 
                                    src={product.images?.[selectedImage]?.startsWith('http') ? product.images[selectedImage] : `${BASE_URL}${product.images?.[selectedImage]}`} 
                                    alt={product.name} 
                                    className="max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-105 mix-blend-multiply" 
                                />
                                {product.discountPrice > 0 && (
                                    <div className="absolute top-6 right-6 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        SALE! -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                                    </div>
                                )}
                            </div>
                            
                            {/* THUMBNAILS */}
                            {product.images?.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar justify-center">
                                    {product.images.map((img, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => setSelectedImage(idx)}
                                            className={`w-20 h-20 md:w-24 md:h-24 bg-white border-2 rounded-lg transition-all p-2 flex items-center justify-center shrink-0 ${selectedImage === idx ? 'border-electro-yellow shadow-md scale-105' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img?.startsWith('http') ? img : `${BASE_URL}${img}`} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: CONTENT */}
                        <div className="flex flex-col">
                            <div className="mb-8">
                                <Link to={`/?category=${product.category?.slug}`} className="text-electro-blue text-sm uppercase font-bold mb-2 inline-block hover:underline">{product.category?.name}</Link>
                                <h1 className="text-3xl md:text-5xl font-bold text-electro-dark leading-tight mb-4">{product.name}</h1>
                                
                                <div className="flex items-center gap-6 mb-8 py-4 border-y border-gray-100">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-electro-yellow text-electro-yellow' : 'text-gray-300'} />
                                        ))}
                                        <span className="text-sm font-bold text-gray-500 ml-2">({product.numReviews} Reviews)</span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-200"></div>
                                    <div className="text-sm text-gray-500">
                                        Brand: <span className="text-electro-dark font-bold uppercase">{product.brand}</span>
                                    </div>
                                </div>

                                <p className="text-base text-gray-600 leading-relaxed max-w-lg mb-10">
                                    {product.description}
                                </p>
                            </div>

                            {/* PRICE BOX & ACTIONS */}
                            <div className="bg-gray-50/50 rounded-xl p-8 border border-gray-100 mb-8">
                                <div className="flex flex-wrap items-baseline gap-4 mb-6">
                                    {product.discountPrice > 0 ? (
                                        <>
                                            <span className="text-4xl md:text-5xl font-bold text-electro-dark">৳{product.discountPrice.toLocaleString()}</span>
                                            <span className="text-xl text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
                                        </>
                                    ) : (
                                        <span className="text-4xl md:text-5xl font-bold text-electro-dark">৳{product.price.toLocaleString()}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-sm mb-8 text-gray-600">
                                    <div className={`flex items-center gap-2 font-bold px-3 py-1 rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        <div className={`w-2 h-2 rounded-full ${product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </div>
                                    <span>Availability: <span className="font-bold text-electro-dark">{product.countInStock} Units left</span></span>
                                </div>

                                {product.countInStock > 0 && (
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex items-center bg-white border border-gray-200 rounded-full h-14 w-full sm:w-auto px-4 overflow-hidden">
                                            <button onClick={() => qty > 1 && setQty(qty - 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition">-</button>
                                            <span className="w-12 text-center font-bold text-lg">{qty}</span>
                                            <button onClick={() => qty < product.countInStock && setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition">+</button>
                                        </div>
                                        <button 
                                            onClick={addToCartHandler}
                                            className="w-full sm:flex-1 h-14 bg-electro-yellow text-electro-dark hover:bg-black hover:text-white transition-all duration-300 font-bold uppercase tracking-widest flex items-center justify-center gap-3 rounded-full shadow-md active:scale-95"
                                        >
                                            <ShoppingBag size={20} /> Add to Cart
                                        </button>
                                        <button className="h-14 w-14 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
                                            <Heart size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* EXTRA INFO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                                    <Truck size={24} className="text-electro-blue" />
                                    <div>
                                        <p className="text-xs font-bold text-electro-dark">Free Delivery</p>
                                        <p className="text-[10px] text-gray-500">Available for orders over ৳50,000</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                                    <ShieldCheck size={24} className="text-green-600" />
                                    <div>
                                        <p className="text-xs font-bold text-electro-dark">Official Warranty</p>
                                        <p className="text-[10px] text-gray-500">100% genuine products only</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS / REVIEWS */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        <button className="px-8 py-5 border-b-2 border-electro-yellow text-electro-dark font-bold text-sm bg-gray-50/50">Customer Reviews ({product.reviews.length})</button>
                        <button className="px-8 py-5 text-gray-500 font-medium text-sm hover:text-electro-blue transition">Product Description</button>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            
                            {/* REVIEW FEED */}
                            <div className="lg:col-span-12 space-y-8">
                                {product.reviews.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <div className="flex justify-center mb-4"><Info size={40} className="text-gray-100" /></div>
                                        <p className="text-sm font-bold">No reviews for this product yet. Be the first to share your experience!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {product.reviews.map((review) => (
                                            <div key={review._id} className="bg-gray-50 rounded-xl p-6 border border-gray-100 relative group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="font-bold text-electro-dark">{review.name}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < review.rating ? 'fill-electro-yellow text-electro-yellow' : 'text-gray-300'} />)}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* WRITE REVIEW BOX */}
                                {userInfo ? (
                                    <div className="mt-16 pt-16 border-t border-gray-100">
                                        <div className="max-w-2xl bg-white border-2 border-dashed border-gray-100 p-8 rounded-2xl">
                                            <h3 className="text-xl font-bold text-electro-dark mb-2">Write a Customer Review</h3>
                                            <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest font-bold">Your email address will not be published.</p>
                                            
                                            <form onSubmit={submitHandler} className="space-y-6">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase text-gray-400">Your Rating</label>
                                                    <select 
                                                        className="bg-gray-50 border border-gray-200 text-electro-dark p-3 rounded-lg outline-none focus:border-electro-yellow transition-colors font-bold" 
                                                        value={rating} 
                                                        onChange={(e) => setRating(Number(e.target.value))}
                                                    >
                                                        <option value="">Select Score...</option>
                                                        <option value="5">5 - Excellent</option>
                                                        <option value="4">4 - Good</option>
                                                        <option value="3">3 - Average</option>
                                                        <option value="2">2 - Poor</option>
                                                        <option value="1">1 - Terrible</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold uppercase text-gray-400">Your Review</label>
                                                    <textarea 
                                                        className="bg-gray-50 border border-gray-200 text-electro-dark p-4 rounded-lg outline-none h-32 focus:border-electro-yellow transition-colors text-sm resize-none" 
                                                        value={comment} 
                                                        onChange={(e) => setComment(e.target.value)} 
                                                        placeholder="Share your experience here..."
                                                    ></textarea>
                                                </div>
                                                <button 
                                                    disabled={reviewLoading} 
                                                    className="w-full sm:w-auto bg-electro-dark text-white font-bold uppercase tracking-widest px-12 py-4 rounded-full hover:bg-electro-yellow hover:text-electro-dark transition-all disabled:opacity-50"
                                                >
                                                    {reviewLoading ? 'Submitting...' : 'Post Review'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-12 bg-electro-dark p-10 rounded-xl text-center shadow-lg group">
                                        <Zap size={32} className="mx-auto text-electro-yellow mb-4 group-hover:scale-110 transition-transform" />
                                        <p className="text-white font-bold mb-6">Want to write a review? Please log in first.</p>
                                        <Link to="/login" className="inline-block bg-electro-yellow text-electro-dark font-bold uppercase tracking-widest py-3 px-10 rounded-full hover:bg-white transition-colors">Log In To Account</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
