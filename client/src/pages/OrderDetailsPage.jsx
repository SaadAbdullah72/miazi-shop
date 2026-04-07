import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api, { BASE_URL } from '../utils/axiosConfig';
import { Loader, ChevronRight, Package, Truck, CreditCard, Calendar, User, MapPin, Receipt, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/api/orders/${id}`);
                setOrder(data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchOrder();
        }
    }, [id, userInfo]);

    if (loading) return (
        <div className="flex flex-col justify-center items-center py-64 bg-electro-bg h-screen">
            <Loader size={40} className="animate-spin text-electro-yellow mb-4" />
            <span className="text-electro-text font-bold animate-pulse">Fetching Order Data...</span>
        </div>
    );
    
    if (error) return (
        <div className="container-custom py-20 text-center">
            <div className="bg-red-50 text-red-600 p-10 rounded-2xl border border-red-100 max-w-2xl mx-auto shadow-sm">
                <AlertCircle size={48} className="mx-auto mb-6 opacity-20" />
                <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Order Recognition Failed</h2>
                <p className="mb-10 text-sm font-medium">{error}</p>
                <Link to="/myorders" className="bg-electro-dark text-white px-10 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors">Return To History</Link>
            </div>
        </div>
    );

    if (!order) return null;

    return (
        <div className="bg-electro-bg min-h-screen pb-32">
            {/* BREADCRUMB */}
            <div className="border-b border-gray-200 bg-white shadow-sm mb-12">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-electro-blue transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/myorders" className="hover:text-electro-blue transition-colors">My Orders</Link>
                    <ChevronRight size={14} />
                    <span className="text-electro-dark font-bold">Order #{order._id.slice(-8).toUpperCase()}</span>
                </div>
            </div>

            <div className="container-custom">
                {/* STATUS BAR OVERWRITE */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-2 h-full bg-electro-yellow"></div>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-electro-dark shadow-inner border border-gray-100 italic">
                           <Package size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order Identifier</p>
                            <h1 className="text-2xl md:text-3xl font-bold text-electro-dark tracking-tighter">#{order._id.toUpperCase()}</h1>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 border-2 ${order.isPaid ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                            {order.isPaid ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            {order.isPaid ? `Payment Received: ${new Date(order.paidAt).toLocaleDateString()}` : 'Payment Pending'}
                        </div>
                        <div className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 border-2 ${order.isDelivered ? 'bg-blue-50 border-blue-100 text-electro-blue' : 'bg-yellow-50 border-yellow-100 text-electro-dark'}`}>
                           <Truck size={14} />
                           {order.isDelivered ? `Delivered: ${new Date(order.deliveredAt).toLocaleDateString()}` : 'In Logistics Pipeline'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* LEFT SIDE: DETAILS */}
                    <div className="lg:col-span-8 space-y-10">
                        
                        {/* CUSTOMER INFO LEDGER */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-electro-dark flex items-center gap-3">
                                   <Receipt size={20} className="text-electro-blue" /> Transaction Particulars
                                </h2>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 shrink-0"><User size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recipient</p>
                                            <p className="text-base font-bold text-electro-dark">{order.user.name} ({order.user.email})</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 shrink-0"><MapPin size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Coordinates</p>
                                            <p className="text-sm font-bold text-electro-dark leading-relaxed">
                                                {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 shrink-0"><Calendar size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initialization Date</p>
                                            <p className="text-base font-bold text-electro-dark">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 shrink-0"><CreditCard size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</p>
                                            <p className="text-base font-bold text-electro-dark">{order.paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ORDER ITEMS TABLE */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                            <table className="w-full text-left min-w-[500px]">
                                <thead>
                                    <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                        <th className="py-5 px-8">Unit Deployment</th>
                                        <th className="py-5 px-8">Unit Price</th>
                                        <th className="py-5 px-8">Qty</th>
                                        <th className="py-5 px-8 text-right">Total Credits</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.orderItems.map((item, i) => (
                                        <tr key={i} className="group hover:bg-gray-50/30 transition-colors">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl p-2 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                        <img src={item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                                    </div>
                                                    <Link to={`/product/${item.slug}`} className="text-sm font-bold text-electro-dark hover:text-electro-blue transition-colors line-clamp-1">{item.name}</Link>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-sm font-bold text-gray-500">৳{item.price.toLocaleString()}</td>
                                            <td className="py-6 px-8 text-sm font-bold text-electro-dark uppercase">x{item.qty}</td>
                                            <td className="py-6 px-8 text-right font-bold text-electro-dark italic">৳{(item.qty * item.price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT SIDE: SUMMARY LEDGER */}
                    <div className="lg:col-span-4 h-fit sticky top-32">
                        <div className="bg-electro-dark text-white p-8 md:p-12 rounded-2xl shadow-xl overflow-hidden relative group">
                            {/* Security Decoration */}
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                               <ShieldCheck size={200} />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white tracking-tight mb-10 pb-6 border-b border-white/10 uppercase italic flex items-center gap-4">
                                <Receipt size={24} className="text-electro-yellow" /> Statement
                            </h2>
                            
                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/30">
                                    <span>Inventory Value</span>
                                    <span className="text-white">৳{order.itemsPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/30">
                                    <span>Transport Fee</span>
                                    <span className="text-white">৳{order.shippingPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/30">
                                    <span>Global Tax</span>
                                    <span className="text-white">৳{order.taxPrice.toLocaleString()}</span>
                                </div>
                                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-bold text-electro-yellow uppercase tracking-[0.3em] mb-1">Total Paid</p>
                                        <p className="text-4xl md:text-5xl font-bold text-white tracking-tighter italic leading-none">৳{order.totalPrice.toLocaleString()}</p>
                                    </div>
                                    <Zap size={28} className="text-electro-yellow fill-electro-yellow mb-2 animate-pulse" />
                                </div>
                            </div>

                            <button onClick={() => window.print()} className="w-full bg-white/10 text-white hover:bg-white hover:text-electro-dark py-4 rounded-full font-bold uppercase tracking-widest text-xs border border-white/20 transition-all duration-300">
                                Download Invoice PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
