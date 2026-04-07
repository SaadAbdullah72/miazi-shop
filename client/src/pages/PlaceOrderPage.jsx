import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartItems } from '../slices/cartSlice';
import api, { BASE_URL } from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { CheckCircle, Loader, ShieldCheck, MapPin, Phone, Mail, Zap, CreditCard, ChevronRight, PackageCheck, ShoppingCart, Truck, Receipt } from 'lucide-react';

const PlaceOrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const [paymentStep, setPaymentStep] = useState('review'); // review -> paying -> success
    const [loading, setLoading] = useState(false);

    if (!cart.shippingAddress?.address) {
        navigate('/shipping');
        return null;
    }
    if (!userInfo) {
        navigate('/login?redirect=/placeorder');
        return null;
    }

    const simulatePayment = async () => {
        setPaymentStep('paying');
        setLoading(true);
        // Simulate payment processing (2.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 2500));
        setLoading(false);
        
        // Now place the actual order
        try {
            const res = await api.post('/api/orders', {
                orderItems: cart.cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.images?.[0] || '',
                    price: item.discountPrice > 0 ? item.discountPrice : item.price,
                    product: item._id,
                    slug: item.slug
                })),
                shippingAddress: cart.shippingAddress,
                paymentMethod: 'Online Payment',
                itemsPrice: Number(cart.itemsPrice),
                shippingPrice: Number(cart.shippingPrice),
                taxPrice: Number(cart.taxPrice),
                totalPrice: Number(cart.totalPrice),
            });

            // Mark as paid immediately
            await api.put(`/api/orders/${res.data._id}/pay`, {
                id: 'PAY_' + Date.now(),
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                email_address: cart.shippingAddress.email,
            });

            dispatch(clearCartItems());
            setPaymentStep('success');
            toast.success('Order placed successfully!');
            
            // Redirect to order details after 3 seconds
            setTimeout(() => {
                navigate(`/order/${res.data._id}`);
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
            setPaymentStep('review');
        }
    };

    const steps = [
        { name: 'Shopping Cart', status: 'complete', icon: <ShoppingCart size={18} /> },
        { name: 'Shipping', status: 'complete', icon: <Truck size={18} /> },
        { name: 'Payment & Review', status: 'active', icon: <CreditCard size={18} /> },
        { name: 'Confirmation', status: 'pending', icon: <CheckCircle size={18} /> },
    ];

    if (paymentStep === 'paying') {
        return (
            <div className="min-h-screen bg-electro-bg flex flex-col items-center justify-center p-6 bg-[url('/hero_bg.png')] bg-cover">
                <div className="bg-white/80 backdrop-blur-xl p-16 rounded-3xl shadow-2xl border border-white flex flex-col items-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-electro-yellow/20 blur-2xl rounded-full animate-pulse"></div>
                        <Loader size={80} className="animate-spin text-electro-yellow relative z-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-electro-dark tracking-tight mb-4">Processing Payment</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center max-w-xs leading-loose">Securely communicating with your bank via SSL encryption...</p>
                </div>
            </div>
        );
    }

    if (paymentStep === 'success') {
        return (
            <div className="min-h-screen bg-electro-bg flex flex-col items-center justify-center p-6">
                <div className="bg-white border-2 border-green-100 p-16 shadow-2xl rounded-3xl flex flex-col items-center max-w-lg w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-3 bg-green-500"></div>
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                        <PackageCheck size={48} strokeWidth={2.5} className="animate-bounce" />
                    </div>
                    <h2 className="text-4xl font-bold text-electro-dark tracking-tight mb-4">Order Confirmed!</h2>
                    <p className="text-sm font-medium text-gray-500 mb-10 leading-relaxed max-w-xs">Transaction validated. Professional dispatch initialized. An invoice has been sent to your email.</p>
                    <div className="flex items-center gap-4 py-4 px-8 bg-gray-50 rounded-full border border-gray-100">
                        <Loader size={16} className="animate-spin text-electro-yellow" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Redirecting to Order Tracking...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-electro-bg pb-32">
            {/* BREADCRUMB */}
            <div className="border-b border-gray-200 bg-white shadow-sm mb-12">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-electro-blue transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/shipping" className="hover:text-electro-blue transition-colors">Shipping</Link>
                    <ChevronRight size={14} />
                    <span className="text-electro-dark font-bold">Review Order</span>
                </div>
            </div>

            <div className="container-custom">
                {/* PROGRESS BAR */}
                <div className="max-w-4xl mx-auto mb-16 px-4">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block"></div>
                        {steps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                                    step.status === 'active' ? 'bg-electro-yellow border-white shadow-lg text-electro-dark scale-110' : 
                                    step.status === 'complete' ? 'bg-electro-dark border-white text-white' : 
                                    'bg-white border-gray-100 text-gray-300'
                                }`}>
                                    {step.status === 'complete' ? <CheckCircle size={20} /> : step.icon}
                                </div>
                                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center max-w-[80px] ${
                                    step.status === 'active' ? 'text-electro-dark' : 'text-gray-400'
                                }`}>
                                    {step.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* LEFT SIDE: REVIEW DETAILS */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Shipping Details Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-electro-dark flex items-center gap-3">
                                    <Truck size={20} className="text-electro-blue" /> Shipping Address
                                </h2>
                                <Link to="/shipping" className="text-xs font-bold text-electro-blue hover:underline uppercase tracking-widest">Change</Link>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">Full Name</p>
                                    <p className="text-base font-bold text-electro-dark">{cart.shippingAddress.fullName}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">Email Address</p>
                                    <p className="text-base font-bold text-electro-dark">{cart.shippingAddress.email}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">Phone Number</p>
                                    <p className="text-base font-bold text-electro-dark">{cart.shippingAddress.phone}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">Delivery address</p>
                                    <p className="text-base font-bold text-electro-dark italic leading-relaxed">
                                        {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-electro-dark flex items-center gap-3">
                                    <ShoppingCart size={20} className="text-electro-blue" /> Order Items ({cart.cartItems.length})
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100 px-8">
                                {cart.cartItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 py-6 group">
                                        <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                            <img src={item.images?.[0]?.startsWith('http') ? item.images[0] : `${BASE_URL}${item.images?.[0]}`} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/product/${item.slug}`} className="font-bold text-electro-dark hover:text-electro-blue transition-colors block truncate">{item.name}</Link>
                                            <div className="text-xs font-bold text-gray-400 mt-2">
                                                {item.qty} × <span className="text-electro-dark font-black">৳{(item.discountPrice > 0 ? item.discountPrice : item.price).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-electro-dark font-bold text-xl italic tracking-tighter">৳{((item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: SUMMARY BOX */}
                    <div className="lg:col-span-4 h-fit sticky top-32">
                        <div className="bg-white border-2 border-electro-dark p-8 md:p-10 shadow-xl rounded-2xl overflow-hidden relative">
                            {/* Security Badge Ribbon */}
                            <div className="absolute top-0 right-0 bg-electro-dark text-electro-yellow px-6 py-2 rotate-45 translate-x-8 translate-y-2 shadow-lg border-b border-white/10 z-10">
                                <ShieldCheck size={24} />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-electro-dark tracking-tight mb-10 flex items-center gap-4">
                                <Receipt size={24} className="text-electro-blue" /> Order Summary
                            </h2>
                            
                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Items Total</span>
                                    <span className="text-electro-dark italic">৳{cart.itemsPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Shipping cost</span>
                                    <span className="text-electro-dark italic">৳{cart.shippingPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Applied Tax</span>
                                    <span className="text-electro-dark italic">৳{cart.taxPrice.toLocaleString()}</span>
                                </div>
                                <div className="pt-8 border-t border-gray-100 flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <p className="text-[10px] font-black text-electro-blue uppercase tracking-[0.3em] mb-1">Grand Total</p>
                                        <p className="text-4xl md:text-5xl font-bold text-electro-dark tracking-tighter italic leading-none drop-shadow-sm">৳{cart.totalPrice.toLocaleString()}</p>
                                    </div>
                                    <Zap size={28} className="text-electro-yellow fill-electro-yellow mb-2 animate-pulse" />
                                </div>
                            </div>

                            <button
                                onClick={simulatePayment}
                                disabled={cart.cartItems.length === 0 || loading}
                                className="group w-full bg-electro-yellow text-electro-dark hover:bg-black hover:text-white py-6 rounded-full font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                            >
                                Confirm & Hire Post <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <div className="mt-8 flex items-center justify-center gap-4 opacity-30">
                                <CreditCard size={20} />
                                <div className="h-4 w-px bg-gray-300"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Instant Activation Card</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl text-center shadow-inner">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-relaxed italic">By confirming, you agree to our terms of service and the structural integrity of the shipping data provided.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;
