import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, PhoneCall, HeadphonesIcon } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full font-sans">
            {/* NEWSLETTER STRIP (ELECTRO YELLOW) */}
            <div className="bg-electro-yellow py-8 border-b border-black/5">
                <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                         <Mail size={40} className="text-electro-dark hidden lg:block" strokeWidth={1} />
                         <div>
                             <h3 className="text-2xl font-bold text-electro-text">Sign up to Newsletter</h3>
                             <p className="text-sm text-electro-text-light font-medium">...and receive <strong>৳5,000 coupon for first shopping.</strong></p>
                         </div>
                    </div>
                    
                    <div className="w-full max-w-lg">
                        <form className="flex border-2 border-white rounded-full overflow-hidden bg-white shadow-sm">
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="w-full px-6 py-3 text-sm text-electro-text outline-none"
                                required
                            />
                            <button className="bg-electro-dark text-white px-8 font-bold text-sm hover:bg-black transition-colors rounded-r-full">
                                SignUp
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* MAIN FOOTER DIRECTORY (GREY BACKGROUND) */}
            <div className="bg-white py-16">
                <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                    
                    {/* Brand & Support Contact (Span 4) */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="inline-block mb-8 group">
                            <div className="bg-white h-24 w-24 rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-gray-50 group-hover:scale-105 transition-transform">
                                <div className="flex items-baseline tracking-tighter">
                                    <span className="text-4xl font-black text-orange-500 drop-shadow-sm">M</span>
                                    <span className="text-3xl font-extrabold text-blue-700 drop-shadow-sm">iazi</span>
                                </div>
                                <div className="bg-red-600 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded shadow-inner -mt-1 tracking-widest z-10">
                                    SHOP
                                </div>
                            </div>
                        </Link>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <HeadphonesIcon size={46} className="text-electro-yellow" strokeWidth={1.5} />
                            <div>
                                <p className="text-[11px] text-electro-text-light mb-1 uppercase tracking-wider">Got Questions? Call us 24/7!</p>
                                <p className="text-2xl font-bold text-electro-dark">01 800 900 1256</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-[13px] font-bold text-electro-dark mb-2">Contact Info</h4>
                            <p className="text-[13px] text-electro-text-light leading-relaxed">
                                17 Princess Road, London, Greater London NW1 8JR, UK
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            {['Facebook', 'Twitter', 'Google+', 'LinkedIn'].map(social => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-electro-bg flex items-center justify-center text-electro-text-light hover:bg-electro-yellow hover:text-white transition-colors text-xs font-bold">
                                    {social.charAt(0)}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links (Span 8 split into 3 cols) */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 pt-4">
                         {/* Column 1 */}
                         <div>
                            <h4 className="text-[16px] font-bold text-electro-dark mb-6">Find In Fast</h4>
                            <ul className="flex flex-col gap-3">
                                {['Accessories', 'Gaming Consoles', 'Smartwatches', 'Computers', 'Audio Equipment'].map(link => (
                                    <li key={link}><Link to="/" className="text-[14px] text-electro-text-light hover:text-electro-yellow transition-colors">{link}</Link></li>
                                ))}
                            </ul>
                        </div>

                         {/* Column 2 */}
                         <div>
                            <h4 className="text-[16px] font-bold text-electro-dark mb-6">Information</h4>
                            <ul className="flex flex-col gap-3">
                                {['About Us', 'Shipping Info', 'Delivery Info', 'Returns', 'Terms & Conditions'].map(link => (
                                    <li key={link}><Link to="/" className="text-[14px] text-electro-text-light hover:text-electro-yellow transition-colors">{link}</Link></li>
                                ))}
                            </ul>
                        </div>

                         {/* Column 3 */}
                         <div>
                            <h4 className="text-[16px] font-bold text-electro-dark mb-6">Customer Care</h4>
                            <ul className="flex flex-col gap-3">
                                {['My Account', 'Order Tracking', 'Wishlist', 'Customer Service', 'Site Map'].map(link => (
                                    <li key={link}><Link to="/" className="text-[14px] text-electro-text-light hover:text-electro-yellow transition-colors">{link}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="bg-electro-bg py-5 border-t border-electro-border">
                <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[13px] text-electro-text-light">
                        &copy; <span className="font-bold">MIAZI</span> - All Rights Reserved
                    </p>
                    
                    <div className="flex gap-2">
                        {/* Electro payment badges */}
                        <div className="w-12 h-8 bg-white border border-electro-border rounded-sm flex items-center justify-center text-[9px] font-bold text-blue-800">VISA</div>
                        <div className="w-12 h-8 bg-white border border-electro-border rounded-sm flex items-center justify-center text-[9px] font-bold text-red-500">MC</div>
                        <div className="w-12 h-8 bg-white border border-electro-border rounded-sm flex items-center justify-center text-[9px] font-bold text-blue-500">PP</div>
                        <div className="w-12 h-8 bg-pink-600 rounded-sm flex items-center justify-center text-[9px] font-bold text-white">bKash</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
