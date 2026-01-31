import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowRight, User, Phone, Lock, MapPin, Home, Mail } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth(); // Use register from context
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.address) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            setError('');
            await register(formData);
            // On success, redirect to Dashboard (or Plans)
            navigate('/dashboard');
        } catch (err) {
            setError(err.toString());
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--light)] p-4">
            <div className="relative bg-white rounded-[20px] shadow-2xl overflow-hidden flex w-full max-w-4xl min-h-[500px]">

                {/* Left Side - Brand (Background on Mobile, Split on Desktop) */}
                <div className="absolute inset-0 md:static md:w-1/2 p-10 flex flex-col items-center justify-center bg-[var(--light)] text-center animate-fade-in z-0">
                    <img
                        src="/TBKLogo1.png"
                        alt="The Bachelor's Kitchen"
                        className="w-full max-w-xl object-contain mb-8 transition-transform duration-700 hover:scale-110 hover:rotate-3 drop-shadow-2xl opacity-20 md:opacity-100"
                    />
                    <div className="relative z-10 max-w-md space-y-4 hidden md:block">
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-yellow-600 mb-3 tracking-wide">
                            Taste Trust Together
                        </h2>
                        <p className="text-gray-600 text-xl font-medium leading-relaxed opacity-90">
                            Experience the warmth of home-cooked meals delivered fresh to your doorstep every single day.
                        </p>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="relative z-10 w-full md:w-1/2 p-10 flex flex-col justify-center bg-white/85 md:bg-white backdrop-blur-md md:backdrop-blur-none transition-all">
                    {/* Home Button */}
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors mb-6 group w-fit">
                        <Home size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[var(--dark)] mb-1">Create Account</h1>
                        <p className="text-gray-500 text-sm">Start your healthy food journey today.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400"><User size={18} /></span>
                                <input
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    className="w-full pl-10 pr-4 py-3 bg-[var(--light)] border border-gray-200 rounded-lg focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50 transition outline-none font-medium text-sm"
                                    placeholder="Rahul Sharma"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400"><Mail size={18} /></span>
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-3 bg-[var(--light)] border border-gray-200 rounded-lg focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50 transition outline-none font-medium text-sm"
                                    placeholder="rahul@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400"><Phone size={18} /></span>
                                <input
                                    name="phone"
                                    type="text"
                                    autoComplete="tel"
                                    className="w-full pl-10 pr-4 py-3 bg-[var(--light)] border border-gray-200 rounded-lg focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50 transition outline-none font-medium text-sm"
                                    placeholder="9990000000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Address</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400"><MapPin size={18} /></span>
                                <input
                                    name="address"
                                    type="text"
                                    autoComplete="street-address"
                                    className="w-full pl-10 pr-4 py-3 bg-[var(--light)] border border-gray-200 rounded-lg focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50 transition outline-none font-medium text-sm"
                                    placeholder="Flat No, Society, Sector..."
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400"><Lock size={18} /></span>
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    className="w-full pl-10 pr-4 py-3 bg-[var(--light)] border border-gray-200 rounded-lg focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50 transition outline-none font-medium text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold py-3 rounded-lg transition shadow-lg shadow-yellow-200 flex justify-center items-center gap-2 group">
                            Sign Up
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-[var(--primary)] font-bold hover:underline">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
