import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { ShoppingBag, Search, Menu, User, MapPin, Truck, RefreshCw, Heart, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const Header = () => {
    const [keyword, setKeyword] = useState('');
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate('/');
        }
    };

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
        toast.info('Signed out successfully.');
    };

    const departments = ['Smartphones & Tablets', 'Computers & Laptops', 'Cameras & Photo', 'Audio & Music', 'Smartwatches', 'Accessories'];

    return (
        <header className="w-full bg-white font-sans">
            {/* TIER 1: TOP BAR */}
            <div className="border-b border-electro-border hidden md:block">
                <div className="container-custom flex justify-between items-center py-2 text-[12px] text-electro-text-light">
                    <div>Welcome to Worldwide Electronics Store</div>
                    <div className="flex items-center gap-5">
                        <Link to="#" className="flex items-center gap-1 hover:text-electro-yellow transition-colors"><MapPin size={12} /> Store Locator</Link>
                        <div className="w-[1px] h-3 bg-electro-border"></div>
                        <Link to="/orders" className="flex items-center gap-1 hover:text-electro-yellow transition-colors"><Truck size={12} /> Track Your Order</Link>
                        <div className="w-[1px] h-3 bg-electro-border"></div>
                        <Link to="/" className="flex items-center gap-1 hover:text-electro-yellow transition-colors"><ShoppingBag size={12} /> Shop</Link>
                        <div className="w-[1px] h-3 bg-electro-border"></div>
                        <Link to="/profile" className="flex items-center gap-1 hover:text-electro-yellow transition-colors"><User size={12} /> My Account</Link>
                    </div>
                </div>
            </div>

            {/* TIER 2: MAIN SEARCH BAR */}
            <div className="bg-emerald-50/50 backdrop-blur-md border-b border-gray-200 shadow-sm relative z-20">
                <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Logo */}
                <Link to="/" className="flex items-center w-auto group">
                    <div className="bg-white h-20 w-20 rounded-full shadow-lg flex flex-col items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform">
                        <div className="flex items-baseline tracking-tighter">
                            <span className="text-3xl font-black text-orange-500 drop-shadow-sm">M</span>
                            <span className="text-2xl font-extrabold text-blue-700 drop-shadow-sm">iazi</span>
                        </div>
                        <div className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-inner -mt-1 tracking-widest z-10">
                            SHOP
                        </div>
                    </div>
                    {/* Mobile Menu Trigger */}
                    <button 
                        onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(true); }}
                        className="md:hidden text-electro-dark ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Menu size={28} />
                    </button>
                </Link>

                {/* Massive Electro Search */}
                <div className="flex-1 w-full max-w-3xl hidden md:block">
                    <form onSubmit={handleSearch} className="flex border-2 border-electro-yellow rounded-full overflow-hidden">
                        <input 
                            type="text" 
                            className="bg-white w-full py-3 px-5 text-sm text-electro-text focus:outline-none"
                            placeholder="Enter keyword or product name..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit" className="bg-electro-yellow px-6 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                            <Search size={22} className="text-current" />
                        </button>
                    </form>
                </div>

                {/* Right Actions (Compare, Wishlist, Cart) */}
                <div className="hidden md:flex items-center justify-end gap-8">
                    <div className="flex items-center gap-1 cursor-pointer group">
                        <RefreshCw size={26} strokeWidth={1.5} className="text-electro-dark group-hover:text-electro-yellow transition-colors" />
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer group">
                        <Heart size={26} strokeWidth={1.5} className="text-electro-dark group-hover:text-electro-yellow transition-colors" />
                    </div>
                    
                    {/* User Auth Dropdown */}
                    <div className="relative group">
                        {userInfo ? (
                            <div className="flex items-center gap-2 cursor-pointer text-electro-dark group-hover:text-electro-yellow transition-colors">
                                <User size={26} strokeWidth={1.5} />
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] text-electro-text-light leading-none">Welcome</span>
                                    <span className="text-[13px] font-bold leading-none">{userInfo.name.split(' ')[0]}</span>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 text-electro-dark hover:text-electro-yellow transition-colors">
                                <User size={26} strokeWidth={1.5} />
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] text-electro-text-light leading-none">Sign In</span>
                                    <span className="text-[13px] font-bold leading-none">Register</span>
                                </div>
                            </Link>
                        )}

                        {userInfo && (
                             <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-electro-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[110]">
                                <Link to="/profile" className="block px-4 py-3 text-sm text-electro-text hover:bg-gray-50 border-b border-electro-border">My Account</Link>
                                <Link to="/orders" className="block px-4 py-3 text-sm text-electro-text hover:bg-gray-50 border-b border-electro-border">Orders</Link>
                                {userInfo.isAdmin && (
                                    <Link to="/admin/dashboard" className="block px-4 py-3 text-sm font-bold text-electro-blue hover:bg-gray-50 border-b border-electro-border">Admin Config</Link>
                                )}
                                <button onClick={logoutHandler} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50">Sign Out</button>
                            </div>
                        )}
                    </div>

                    {/* Cart Info */}
                    <Link to="/cart" className="flex items-center gap-3 group">
                        <div className="relative">
                            <ShoppingBag size={28} strokeWidth={1.5} className="text-electro-dark group-hover:text-electro-yellow transition-colors" />
                            <span className="absolute -top-1 -right-2 bg-electro-yellow text-electro-dark text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        </div>
                        <div className="flex flex-col text-left hidden lg:flex">
                            <span className="text-[13px] font-bold text-electro-dark group-hover:text-electro-yellow transition-colors">
                                ৳{cartItems.reduce((a, c) => a + c.price * c.qty, 0).toLocaleString()}
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
            </div>

            {/* TIER 3: ELECTRO NAVIGATION BAR */}
            <div className="border-t border-electro-border relative hidden md:block">
                <div className="container-custom flex">
                    
                    {/* Vertical Department Menu */}
                    <div className="relative w-64 xl:w-72" onMouseEnter={() => setIsDeptOpen(true)} onMouseLeave={() => setIsDeptOpen(false)}>
                        <button className="w-full bg-electro-yellow text-electro-dark font-bold text-[14px] flex items-center gap-3 py-4 px-5 h-full rounded-t-sm">
                            <Menu size={20} /> All Departments
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className={`absolute top-full left-0 w-full bg-white border-l border-r border-b border-electro-border shadow-md z-[200] transition-all duration-300 ${isDeptOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                            <ul className="py-2">
                                {departments.map(dept => (
                                    <li key={dept}>
                                        <Link to={`/?category=${dept}`} className="block px-5 py-2.5 text-[14px] text-electro-text hover:text-electro-blue hover:bg-gray-50 flex justify-between items-center">
                                            {dept} 
                                        </Link>
                                    </li>
                                ))}
                                <li className="border-t border-electro-border mt-2 pt-2">
                                    <Link to="/" className="block px-5 py-2.5 text-[14px] font-bold text-electro-text hover:text-electro-blue">Value of the Day</Link>
                                </li>
                                <li>
                                    <Link to="/" className="block px-5 py-2.5 text-[14px] font-bold text-electro-text hover:text-electro-blue">Top 100 Offers</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Horizontal Nav Links */}
                    <div className="flex-1 flex justify-between items-center pl-8">
                        <nav className="flex items-center gap-8">
                            <Link to="/" className="text-[14px] font-bold text-red-500 flex items-center gap-1"><span className="text-xl leading-none">🔥</span> Super Deals</Link>
                            <Link to="/" className="text-[14px] font-bold text-electro-text hover:text-electro-blue transition-colors">Featured Brands</Link>
                            <Link to="/" className="text-[14px] font-bold text-electro-text hover:text-electro-blue transition-colors">Trending Styles</Link>
                            <Link to="/" className="text-[14px] font-bold text-electro-text hover:text-electro-blue transition-colors">Gift Cards</Link>
                        </nav>
                        
                        <div className="hidden lg:block text-[14px] font-bold text-electro-text">
                            Free Shipping on Orders <span className="text-red-500">৳50,000+</span>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* MOBILE NAVIGATION DRAWER */}
            <div 
                className={`fixed inset-0 bg-black/50 z-[300] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div 
                    className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-electro-yellow">
                        <span className="font-bold text-electro-dark uppercase tracking-widest text-xs">Categories</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-electro-dark p-2 hover:bg-white/20 rounded-full">
                            <Menu size={20} className="rotate-90" />
                        </button>
                    </div>
                    
                    <div className="overflow-y-auto h-[calc(100%-80px)]">
                        <ul className="py-4">
                            {departments.map((dept) => (
                                <li key={dept}>
                                    <Link 
                                        to={`/?category=${dept}`} 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-8 py-4 text-sm font-bold text-electro-dark border-b border-gray-50 active:bg-gray-50 flex justify-between items-center"
                                    >
                                        {dept} <ChevronDown size={14} className="-rotate-90 opacity-20" />
                                    </Link>
                                </li>
                            ))}
                            <li className="mt-8 px-8 space-y-4">
                                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-sm font-bold text-electro-text hover:text-electro-blue transition-colors">
                                    <Truck size={18} /> Track Your Order
                                </Link>
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-sm font-bold text-electro-text hover:text-electro-blue transition-colors">
                                    <User size={18} /> My Account
                                </Link>
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-sm font-bold text-red-500 hover:text-electro-blue transition-colors">
                                    <RefreshCw size={18} /> Super Deals
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* MOBILE SEARCH BAR */}
            <div className="md:hidden px-4 pb-6">
                 <form onSubmit={handleSearch} className="flex border-2 border-electro-yellow rounded-full overflow-hidden">
                    <input 
                        type="text" 
                        className="bg-white w-full py-2.5 px-4 text-sm text-electro-text focus:outline-none"
                        placeholder="Search for products"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit" className="bg-electro-yellow px-5 flex items-center justify-center">
                        <Search size={18} className="text-electro-dark" />
                    </button>
                </form>
            </div>
        </header>
    );
};

export default Header;
