import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ChevronRight, Zap, ShieldCheck, Truck, ArrowRight, Info } from 'lucide-react';
import { BASE_URL } from '../utils/axiosConfig';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((state) => state.cart);

    const updateQtyHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/shipping');
    };

    return (
        <div className="bg-electro-bg min-h-screen pb-32">
            {/* BREADCRUMB */}
            <div className="border-b border-gray-200 bg-white shadow-sm mb-12">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-electro-blue">Home</Link>
                    <ChevronRight size={14} />
                    <span className="text-electro-dark font-bold">Shopping Cart</span>
                </div>
            </div>

            <div className="container-custom">
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-electro-dark tracking-tight">Shopping Cart</h1>
                    <div className="w-20 h-1 bg-electro-yellow mt-4"></div>
                </header>
                
                {cartItems.length === 0 ? (
                    <div className="text-center py-24 bg-white border border-gray-200 rounded-xl shadow-sm px-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                            <ShoppingBag size={48} className="text-gray-200" strokeWidth={1.5}/>
                        </div>
                        <h2 className="text-2xl font-bold text-electro-dark mb-4">Your cart is currently empty!</h2>
                        <p className="text-gray-500 mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our latest tech deals and find something amazing!</p>
                        <Link to="/" className="btn-electro bg-electro-yellow text-electro-dark px-12 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition flex items-center gap-4 mx-auto w-fit">
                            Return To Shop <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                                            <th className="py-5 px-6">Product</th>
                                            <th className="py-5 px-6">Price</th>
                                            <th className="py-5 px-6">Quantity</th>
                                            <th className="py-5 px-6 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {cartItems.map((item) => (
                                            <tr key={item._id} className="group hover:bg-gray-50/30 transition-colors">
                                                <td className="py-6 px-6">
                                                    <div className="flex gap-6 items-center">
                                                        <div className="w-24 h-24 bg-white border border-gray-100 rounded-lg p-2 flex items-center justify-center shrink-0">
                                                            <img 
                                                                src={item.images?.[0]?.startsWith('http') ? item.images[0] : `${BASE_URL}${item.images?.[0]}` || 'https://via.placeholder.com/200'} 
                                                                alt={item.name} 
                                                                className="max-w-full max-h-full object-contain mix-blend-multiply" 
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1 pr-4">
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.brand || 'Elite'}</div>
                                                            <Link to={`/product/${item.slug}`} className="text-base font-bold text-electro-dark hover:text-electro-blue transition-colors line-clamp-2">
                                                                {item.name}
                                                            </Link>
                                                            <button 
                                                                onClick={() => removeHandler(item._id)} 
                                                                className="text-red-500 hover:text-red-700 transition-colors text-xs font-bold flex items-center gap-1 mt-2 md:opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 size={12} /> Remove Item
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-6 font-bold text-electro-dark">
                                                    ৳{(item.discountPrice > 0 ? item.discountPrice : item.price).toLocaleString()}
                                                </td>
                                                <td className="py-6 px-6">
                                                    <div className="flex items-center bg-white border border-gray-200 rounded-full h-10 w-28 overflow-hidden">
                                                        <button 
                                                            onClick={() => item.qty > 1 && updateQtyHandler(item, item.qty - 1)} 
                                                            className="w-full h-full flex items-center justify-center hover:bg-gray-100 border-r border-gray-200 text-gray-400"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="px-4 font-bold text-electro-dark">{item.qty}</span>
                                                        <button 
                                                            onClick={() => item.qty < item.countInStock && updateQtyHandler(item, item.qty + 1)} 
                                                            className="w-full h-full flex items-center justify-center hover:bg-gray-100 border-l border-gray-200 text-gray-400"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-6 text-right font-bold text-electro-dark text-lg italic">
                                                    ৳{((item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between items-center px-4 py-2">
                                <Link to="/" className="text-sm font-bold text-electro-blue hover:underline flex items-center gap-2">
                                    <ArrowLeft size={16} /> Continue Shopping
                                </Link>
                                <button className="text-sm font-bold text-gray-400 hover:text-electro-dark transition-colors uppercase tracking-widest px-6 py-2 border-2 border-dashed border-gray-200 rounded-full hover:border-electro-dark">
                                    Update Cart
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Panel */}
                        <div className="lg:col-span-4 space-y-6 sticky top-32">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 md:p-10 relative overflow-hidden">
                                <h2 className="text-2xl font-bold text-electro-dark mb-8 border-b-2 border-electro-yellow pb-4 inline-block">Cart Totals</h2>
                                
                                <div className="space-y-6 mb-12">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
                                        <span className="font-bold text-electro-dark italic">৳{itemsPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-500 uppercase tracking-widest">Shipping</span>
                                            <span className="text-[10px] text-gray-400">Flat rate to doorstep</span>
                                        </div>
                                        <span className="font-bold text-electro-dark uppercase">৳{shippingPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-4">
                                        <span className="text-xl font-bold text-electro-dark uppercase tracking-tighter">Total Price</span>
                                        <span className="text-4xl font-bold text-electro-dark italic drop-shadow-sm">৳{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={checkoutHandler} 
                                    className="w-full bg-electro-yellow text-electro-dark hover:bg-black hover:text-white py-5 rounded-full font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-4 active:scale-95"
                                >
                                    Proceed to Checkout <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Trust badges */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4 shadow-inner">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"><Truck size={18} className="text-electro-blue" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-electro-dark">Express Delivery</p>
                                        <p className="text-[10px] text-gray-400 font-medium leading-tight">Same day dispatch on orders placed before 3PM.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"><ShieldCheck size={18} className="text-green-600" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-electro-dark">Secure Checkout</p>
                                        <p className="text-[10px] text-gray-400 font-medium leading-tight">100% Secure payments via SSL encryption.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
