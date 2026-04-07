import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import { Truck, MapPin, Phone, Mail, User, ChevronRight, Globe, ShieldCheck, ShoppingCart, CreditCard, CheckCircle2 } from 'lucide-react';

const ShippingPage = () => {
    const { shippingAddress } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        fullName: shippingAddress?.fullName || userInfo?.name || '',
        email: shippingAddress?.email || userInfo?.email || '',
        phone: shippingAddress?.phone || '',
        address: shippingAddress?.address || '',
        city: shippingAddress?.city || '',
        postalCode: shippingAddress?.postalCode || '',
        country: shippingAddress?.country || 'Bangladesh',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress(formData));
        navigate('/placeorder');
    };

    if (!userInfo) {
        navigate('/login?redirect=/shipping');
        return null;
    }

    const steps = [
        { name: 'Shopping Cart', status: 'complete', icon: <ShoppingCart size={18} /> },
        { name: 'Shipping', status: 'active', icon: <Truck size={18} /> },
        { name: 'Payment & Review', status: 'pending', icon: <CreditCard size={18} /> },
        { name: 'Confirmation', status: 'pending', icon: <CheckCircle2 size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-electro-bg pb-32">
            {/* BREADCRUMB */}
            <div className="border-b border-gray-200 bg-white shadow-sm mb-12">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-electro-blue transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/cart" className="hover:text-electro-blue transition-colors">Cart</Link>
                    <ChevronRight size={14} />
                    <span className="text-electro-dark font-bold">Shipping Details</span>
                </div>
            </div>

            <div className="container-custom">
                {/* PROGRESS BAR */}
                <div className="max-w-4xl mx-auto mb-16 px-4">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block"></div>
                        
                        {steps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                                    step.status === 'active' ? 'bg-electro-yellow border-white shadow-lg text-electro-dark scale-110' : 
                                    step.status === 'complete' ? 'bg-electro-dark border-white text-white' : 
                                    'bg-white border-gray-100 text-gray-300'
                                }`}>
                                    {step.status === 'complete' ? <CheckCircle2 size={20} /> : step.icon}
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

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT PANEL: INFO */}
                    <div className="lg:col-span-4 space-y-8">
                        <header className="space-y-4">
                            <h1 className="text-4xl font-bold text-electro-dark tracking-tight leading-none mb-2">Shipping Details</h1>
                            <div className="w-16 h-1 bg-electro-yellow"></div>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">Please provide your accurate delivery address to ensure your premium tech reaches you safely.</p>
                        </header>
                        
                        <div className="space-y-4 pt-6">
                            <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600"><ShieldCheck size={20} /></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure Checkout Active</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-electro-blue"><Globe size={20} /></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nationwide Delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: FORM */}
                    <div className="lg:col-span-8 bg-white border border-gray-200 p-8 md:p-12 rounded-2xl shadow-md relative group">
                        <form onSubmit={submitHandler} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Full Name *</label>
                                    <div className="relative group/input">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-electro-yellow transition-colors" />
                                        <input 
                                            type="text" 
                                            name="fullName" 
                                            required 
                                            value={formData.fullName} 
                                            onChange={handleChange} 
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-electro-yellow focus:bg-white transition-all font-bold text-electro-dark" 
                                            placeholder="Saad Abdullah" 
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Phone Number *</label>
                                    <div className="relative group/input">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-electro-yellow transition-colors" />
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            required 
                                            value={formData.phone} 
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-electro-yellow focus:bg-white transition-all font-bold text-electro-dark" 
                                            placeholder="+880 1XXX XXXXXX" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Delivery Address *</label>
                                <div className="relative group/input">
                                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-electro-yellow transition-colors" />
                                    <input 
                                        type="text" 
                                        name="address" 
                                        required 
                                        value={formData.address} 
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-electro-yellow focus:bg-white transition-all font-bold text-electro-dark" 
                                        placeholder="House No, Road No, Area Name" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">City *</label>
                                    <input 
                                        type="text" 
                                        name="city" 
                                        required 
                                        value={formData.city} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 px-6 outline-none focus:border-electro-yellow focus:bg-white transition-all font-bold text-electro-dark" 
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Postal Code</label>
                                    <input 
                                        type="text" 
                                        name="postalCode" 
                                        value={formData.postalCode} 
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 px-6 outline-none focus:border-electro-yellow focus:bg-white transition-all font-bold text-electro-dark" 
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Country *</label>
                                    <input 
                                        type="text" 
                                        name="country" 
                                        value={formData.country} 
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 px-6 outline-none focus:border-electro-yellow focus:bg-white transition-all font-bold text-electro-dark" 
                                    />
                                </div>
                            </div>

                            <div className="pt-8">
                                <button 
                                    type="submit" 
                                    className="w-full bg-electro-yellow text-electro-dark hover:bg-black hover:text-white py-6 rounded-full font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-500 flex items-center justify-center gap-4 active:scale-95"
                                >
                                    Review Your Order <ChevronRight size={20} />
                                </button>
                                <p className="text-[10px] text-gray-400 text-center mt-6 font-bold uppercase tracking-widest">Your data is protected by SSL encryption.</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
