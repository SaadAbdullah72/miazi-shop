import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, UserPlus, CheckCircle2, ShieldCheck, Zap, ChevronRight, Loader } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo, loading, error } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="bg-electro-bg min-h-screen py-20 px-4">
            <div className="container-custom max-w-5xl mx-auto">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-electro-dark tracking-tight">My Account</h1>
                    <div className="w-20 h-1 bg-electro-yellow mt-4 mx-auto"></div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                    
                    {/* LOGIN SECTION */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-electro-yellow rounded-full flex items-center justify-center text-electro-dark shadow-sm">
                                <LogIn size={20} strokeWidth={2.5}/>
                            </div>
                            <h2 className="text-2xl font-bold text-electro-dark">Login</h2>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-10 leading-relaxed font-bold uppercase tracking-widest opacity-60">Already a member? Sign in to access your dashboard and save your preferences.</p>

                        <form onSubmit={submitHandler} className="space-y-8">
                            <div className="relative">
                                <label className="text-[10px] uppercase font-bold text-gray-400 absolute -top-2 left-6 bg-white px-2 z-10 transition-all">Username or email address *</label>
                                <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl focus-within:border-electro-yellow focus-within:bg-white transition-all overflow-hidden group">
                                    <div className="pl-6 pr-4 text-gray-300 group-focus-within:text-electro-yellow transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        type="email" 
                                        className="w-full py-5 pr-6 bg-transparent outline-none text-electro-dark font-bold text-sm"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-[10px] uppercase font-bold text-gray-400 absolute -top-2 left-6 bg-white px-2 z-10 transition-all">Password *</label>
                                <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl focus-within:border-electro-yellow focus-within:bg-white transition-all overflow-hidden group">
                                    <div className="pl-6 pr-4 text-gray-300 group-focus-within:text-electro-yellow transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        type="password" 
                                        className="w-full py-5 pr-6 bg-transparent outline-none text-electro-dark font-bold text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded border-2 border-gray-200 text-electro-yellow focus:ring-electro-yellow transition-all cursor-pointer" />
                                    <span className="text-xs font-bold text-gray-500 group-hover:text-electro-dark transition-colors">Remember me</span>
                                </label>
                                <Link to="#" className="text-xs font-bold text-electro-blue hover:underline">Lost your password?</Link>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-electro-yellow text-electro-dark hover:bg-black hover:text-white py-5 rounded-full font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin" size={20}/> : <><LogIn size={18} /> Log In</>}
                            </button>
                        </form>
                    </div>

                    {/* REGISTER COLUMN */}
                    <div className="bg-electro-dark rounded-2xl shadow-xl p-8 md:p-12 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                           <UserPlus size={200} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-electro-yellow shadow-sm">
                                    <UserPlus size={20} strokeWidth={2.5}/>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Register</h2>
                            </div>
                            
                            <p className="text-sm text-gray-400 mb-10 leading-relaxed font-bold uppercase tracking-widest opacity-80">Creating an account is free and easy. By registering, you unlock exclusive deals, tracking and more.</p>

                            <ul className="space-y-6 mb-12">
                                {[
                                    'Access to exclusive member discounts',
                                    'Track your orders in real-time',
                                    'Save your shipping details for fast checkout',
                                    'Get early access to flash sales',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-300">
                                        <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                to={redirect ? `/register?redirect=${redirect}` : '/register'}
                                className="w-full inline-flex bg-white/10 text-white hover:bg-electro-yellow hover:text-electro-dark py-5 rounded-full font-bold uppercase tracking-widest border border-white/20 transition-all duration-300 items-center justify-center gap-4"
                            >
                                Register Now <ChevronRight size={18} />
                            </Link>

                            <div className="mt-16 flex items-center gap-6 py-8 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-electro-yellow" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Secure</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={20} className="text-blue-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Fast</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
