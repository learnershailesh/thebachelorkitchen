import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ShieldCheck, Copy, Check, ChevronLeft, CreditCard, Smartphone, Info } from 'lucide-react';
import SEO from '../components/SEO';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, api } = useAuth();
    const [plan, setPlan] = useState(location.state?.plan || null);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Redirect if no plan selected
    useEffect(() => {
        if (!plan) {
            navigate('/#plans');
        }
    }, [plan, navigate]);

    const upiId = "7521908477@sbi";

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!transactionId && paymentMethod === 'upi') {
            alert("Please enter the UTR / Transaction ID");
            return;
        }

        setLoading(true);
        try {
            await api.post('/subscription', {
                planId: plan._id,
                paymentMethod: paymentMethod,
                transactionId: transactionId
            });
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to process subscription");
        } finally {
            setLoading(false);
        }
    };

    if (!plan) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO title="Checkout - Finalize Your Plan" />
            <Navbar />

            <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-0">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-[var(--primary)] font-bold mb-8 transition"
                >
                    <ChevronLeft size={20} />
                    Back to Plans
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Plan Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl mb-6">
                                <div>
                                    <div className="font-bold text-gray-800">{plan.name}</div>
                                    <div className="text-sm text-gray-500">{plan.description || "Monthly Plan"}</div>
                                </div>
                                <div className="text-xl font-black text-[var(--primary-dark)]">
                                    {plan.priceDisplay || `₹${plan.price}`}
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features?.slice(0, 3).map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-lg font-bold">
                                <span>Total to Pay</span>
                                <span className="text-2xl text-[var(--primary)]">{plan.priceDisplay || `₹${plan.price}`}</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                            <Info className="text-blue-500 shrink-0" size={24} />
                            <p className="text-sm text-blue-700 leading-relaxed">
                                <strong>Note:</strong> Since we are currently updating our payment gateway, we are accepting manual payments via UPI or Cash. Your subscription will be activated after admin verification.
                            </p>
                        </div>
                    </div>

                    {/* Right: Payment Method */}
                    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-bold mb-8">Payment Method</h2>

                        <div className="space-y-4 mb-10">
                            <button
                                onClick={() => setPaymentMethod('upi')}
                                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition ${paymentMethod === 'upi' ? 'border-[var(--primary)] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'upi' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <Smartphone size={24} />
                                    </div>
                                    <span className="font-bold text-gray-800">UPI / QR Code</span>
                                </div>
                                {paymentMethod === 'upi' && <div className="w-5 h-5 bg-[var(--primary)] rounded-full border-4 border-white shadow-sm"></div>}
                            </button>

                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition ${paymentMethod === 'cash' ? 'border-[var(--primary)] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <CreditCard size={24} />
                                    </div>
                                    <span className="font-bold text-gray-800">Pay on Delivery</span>
                                </div>
                                {paymentMethod === 'cash' && <div className="w-5 h-5 bg-[var(--primary)] rounded-full border-4 border-white shadow-sm"></div>}
                            </button>
                        </div>

                        {paymentMethod === 'upi' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-gray-50 rounded-3xl p-6 text-center border-2 border-dashed border-gray-200">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Scan QR Code to Pay</div>
                                    <div className="w-48 h-48 bg-white mx-auto rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 overflow-hidden p-2">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}%26pn=The%20Bachelors%20Kitchen%26am=${plan.price}%26cu=INR`}
                                            alt="UPI QR Code"
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-3 bg-white py-3 px-6 rounded-full shadow-sm max-w-xs mx-auto">
                                        <span className="text-sm font-bold text-gray-600 truncate">{upiId}</span>
                                        <button onClick={handleCopy} className="text-[var(--primary)] hover:scale-110 transition">
                                            {copied ? <Check size={18} /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Transaction ID / UTR</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--primary)] focus:bg-white transition font-medium text-gray-700"
                                            placeholder="Enter 12-digit UTR number"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-[var(--primary-dark)] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-200 hover:bg-black transition active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? "Processing..." : "Submit Transaction ID"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {paymentMethod === 'cash' && (
                            <div className="space-y-6 animate-fade-in text-center py-8">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-4">
                                    <Smartphone size={40} />
                                </div>
                                <h3 className="text-xl font-bold">Great Choice!</h3>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-[250px] mx-auto">
                                    You can pay for your subscription when we deliver your first meal. Your plan will be activated after admin verification.
                                </p>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full py-4 bg-[var(--primary-dark)] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-200 hover:bg-black transition active:scale-95"
                                >
                                    {loading ? "Processing..." : "Confirm Subscription"}
                                </button>
                            </div>
                        )}

                        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold">
                            <ShieldCheck size={16} className="text-green-500" />
                            100% Safe & Secure Payment process
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
