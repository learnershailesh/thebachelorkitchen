import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, UtensilsCrossed, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileOpen(false);
    };

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const NavLink = ({ to, children, onClick }) => (
        <Link
            to={to}
            onClick={() => {
                if (onClick) onClick();
                setIsMobileOpen(false);
            }}
            className="block py-2 hover:text-[var(--primary)] transition-colors duration-200"
        >
            {children}
        </Link>
    );

    const checkScroll = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMobileOpen(false);
    }

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-6 py-3 shadow-sm transition-all duration-300">
            <div className="container flex justify-between items-center max-w-7xl mx-auto relative">
                <Link to="/" className="flex items-center gap-2 group z-50">
                    <img src="/TBKLogo1.png" alt="The Bachelor's Kitchen" className="h-14 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
                    <Link to="/" className="hover:text-[var(--primary)] transition-colors duration-200">Home</Link>
                    <Link to="/about-us" className="hover:text-[var(--primary)] transition-colors duration-200">About Us</Link>
                    <button onClick={() => checkScroll('kitchen')} className="hover:text-[var(--primary)] transition-colors duration-200">Kitchen Stories</button>
                    <button onClick={() => checkScroll('plans')} className="hover:text-[var(--primary)] transition-colors duration-200">Our Plans</button>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden z-50 flex items-center gap-4">
                    {/* Show simple auth status on mobile header? Or keep it in menu */}
                    {user && <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full">{user.name.split(' ')[0]}</span>}
                    <button onClick={toggleMobile} className="text-gray-700">
                        {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/admin" className="font-medium text-[var(--primary)] hover:text-[var(--primary-dark)] transition">Dashboard</Link>
                            ) : (
                                <Link to="/dashboard" className="font-medium text-[var(--primary)] hover:text-[var(--primary-dark)] transition">My Tiffin</Link>
                            )}

                            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                <span className="text-sm font-semibold text-gray-700 hidden sm:inline-block">
                                    {user.name}
                                </span>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all duration-200" title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <Link to="/login" className="font-medium text-gray-600 hover:text-[var(--primary)] px-4 py-2 rounded-lg hover:bg-green-50 transition-all duration-200">Login</Link>
                            <Link to="/signup" className="btn btn-primary px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">Get Started</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col p-6 gap-4 md:hidden animate-fade-in z-40">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/about-us">About Us</NavLink>
                        <button onClick={() => checkScroll('kitchen')} className="text-left py-2 hover:text-[var(--primary)]">Kitchen Stories</button>
                        <button onClick={() => checkScroll('plans')} className="text-left py-2 hover:text-[var(--primary)]">Our Plans</button>

                        <div className="h-px bg-gray-100 my-2"></div>

                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <NavLink to="/admin">Admin Dashboard</NavLink>
                                ) : (
                                    <NavLink to="/dashboard">My Dashboard</NavLink>
                                )}
                                <button onClick={handleLogout} className="text-left py-2 text-red-500 font-semibold flex items-center gap-2">
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 mt-2">
                                <Link to="/login" onClick={() => setIsMobileOpen(false)} className="w-full text-center py-3 border border-gray-200 rounded-lg font-medium text-gray-600">Login</Link>
                                <Link to="/signup" onClick={() => setIsMobileOpen(false)} className="btn btn-primary w-full py-3">Get Started</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
