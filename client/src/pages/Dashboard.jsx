import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SmartCalendar from '../components/SmartCalendar';
import { format, addDays, isSameDay, setHours, setMinutes, isAfter, differenceInDays } from 'date-fns';
import { Edit2, MapPin, X, Utensils, UtensilsCrossed, Clock, Calendar, ChevronRight, HelpCircle, Package, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const Dashboard = () => {
    const { user, api, updateProfile } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [loadingSub, setLoadingSub] = useState(true);

    // Address Modal State
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState('');
    const [updatingAddress, setUpdatingAddress] = useState(false);

    // Skip Meal Modal State
    const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [skippingLoading, setSkippingLoading] = useState(false);

    const [menuData, setMenuData] = useState(null);

    // Fetch Menu
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // Fix: Generate YYYY-MM-DD in local time
                const now = new Date();
                const offset = now.getTimezoneOffset();
                const localDate = new Date(now.getTime() - (offset * 60 * 1000));
                const today = localDate.toISOString().split('T')[0];

                const { data } = await api.get(`/admin/menu?date=${today}`);
                if (data && data.items) {
                    setMenuData({
                        lunch: Array.isArray(data.items.lunch) ? data.items.lunch : [],
                        dinner: Array.isArray(data.items.dinner) ? data.items.dinner : []
                    });
                }
            } catch (error) {
                console.log("No menu found");
            }
        };
        fetchMenu();
    }, [api]);

    // Fetch Subscription Data
    const fetchSubscription = async () => {
        try {
            const { data } = await api.get('/subscription/me');
            setSubscription(data);
        } catch (error) {
            setSubscription(null);
        } finally {
            setLoadingSub(false);
        }
    };

    useEffect(() => {
        if (user) {
            setNewAddress(user.address || '');
            fetchSubscription();
        }
    }, [user, api]);

    const handleDateClick = (date) => {
        const cutoffTime = setMinutes(setHours(new Date(), 22), 0); // 10 PM
        const today = new Date();
        const isTomorrow = isSameDay(date, addDays(today, 1));

        if (isTomorrow && isAfter(new Date(), cutoffTime)) {
            alert("It's past 10 PM. You can't change tomorrow's order.");
            return;
        }

        setSelectedDate(date);
        setIsSkipModalOpen(true);
    };

    const handleSkipMeal = async (mealType) => {
        if (!selectedDate) return;
        setSkippingLoading(true);
        try {
            // Check if already skipped -> Then Undo
            const currentlySkipped = isSkipped(selectedDate, mealType);

            const endpoint = currentlySkipped ? '/subscription/undo-skip' : '/subscription/skip';

            await api.post(endpoint, {
                date: format(selectedDate, 'yyyy-MM-dd'),
                meal: mealType
            });
            // Refresh
            await fetchSubscription();
            // Don't close modal immediately so they can see change
            // setIsSkipModalOpen(false); 
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update meal');
        } finally {
            setSkippingLoading(false);
        }
    };

    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        setUpdatingAddress(true);
        try {
            await updateProfile({ address: newAddress });
            setIsAddressModalOpen(false);
        } catch (error) {
            alert(error);
        } finally {
            setUpdatingAddress(false);
        }
    };

    // Calculate Greetings & Stats
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getNextMeal = () => {
        const hour = new Date().getHours();
        if (hour < 14) return { name: 'Lunch', time: '1:00 PM', icon: <Utensils /> };
        return { name: 'Dinner', time: '8:00 PM', icon: <UtensilsCrossed /> };
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading User...</div>;
    if (loadingSub) return <div className="min-h-screen flex items-center justify-center">Loading Subscription...</div>;

    // NO PLAN STATE
    if (!subscription) {
        return (
            <div className="min-h-screen pb-20 bg-gray-50">
                <Navbar />
                <div className="container py-20 text-center">
                    <h1 className="text-4xl mb-6 font-bold text-gray-800">{getGreeting()}, {user.name.split(' ')[0]}! 👋</h1>
                    <div className="card max-w-lg mx-auto bg-white border-0 shadow-xl rounded-3xl p-8">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
                            <Package size={32} />
                        </div>
                        <h2 className="text-2xl mb-3 font-bold text-gray-800">No Active Plan</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">You haven't subscribed to a tiffin plan yet. Start your healthy journey today!</p>
                        <a href="/#plans" className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-green-200">View Plans</a>
                    </div>
                </div>
            </div>
        );
    }

    // PENDING APPROVAL STATE
    if (subscription.status === 'pending_approval') {
        return (
            <div className="min-h-screen pb-20 bg-gray-50">
                <Navbar />
                <div className="container py-20 text-center">
                    <h1 className="text-4xl mb-6 font-bold text-gray-800">{getGreeting()}, {user.name.split(' ')[0]}! 🌤️</h1>
                    <div className="card max-w-2xl mx-auto bg-white border-0 shadow-2xl rounded-[2.5rem] p-10">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-500 relative">
                            <Clock size={48} />
                            <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                                <ShieldCheck size={18} className="text-[var(--primary)]" />
                            </div>
                        </div>
                        <h2 className="text-3xl mb-4 font-extrabold text-gray-800">Payment Verification Pending</h2>
                        <p className="text-gray-500 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                            We've received your <span className="text-[var(--primary)] font-bold">{subscription.paymentMethod?.toUpperCase()}</span> payment request.
                            Our team is verifying the transaction. Your healthy meals will start soon!
                        </p>

                        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-10 text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Info className="text-blue-500" size={18} />
                                </div>
                                <span className="font-bold text-blue-900">What's next?</span>
                            </div>
                            <ul className="space-y-3 text-sm text-blue-800">
                                <li className="flex gap-2"><span>-</span> Verification takes 2-4 hours during business hours.</li>
                                <li className="flex gap-2"><span>-</span> Once approved, your plan will show up here.</li>
                                <li className="flex gap-2"><span>-</span> You can then start skipping meals and managing your menu.</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://wa.me/917307191299"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-4 bg-[var(--primary)] text-white font-black rounded-2xl shadow-lg shadow-green-200 text-center"
                            >
                                Contact Support
                            </a>
                            <button onClick={() => window.location.reload()} className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50">
                                Refresh Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // HAS PLAN STATE
    const validUntil = new Date(subscription.endDate);
    const planName = subscription.planId?.name || 'Custom Plan';
    const startDate = new Date(subscription.startDate);
    const today = new Date();
    const totalDays = differenceInDays(validUntil, startDate);
    const daysPassed = differenceInDays(today, startDate);
    const progressPercent = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));
    const daysLeft = differenceInDays(validUntil, today);

    const nextMeal = getNextMeal();

    const isSkipped = (date, meal) => {
        if (!subscription.skippedMeals) return false;
        return subscription.skippedMeals.some(s =>
            isSameDay(new Date(s.date), date) && (s.meal === meal || s.meal === 'both')
        );
    };

    return (
        <div className="min-h-screen pb-20 bg-gray-50/50">
            <SEO title="My Dashboard" />
            <Navbar />

            {/* Top Section / Header */}
            <div className="bg-white border-b border-gray-100 pb-8 pt-6">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-auto">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{getGreeting()}, {user.name.split(' ')[0]}! 🌤️</h1>
                            <p className="text-gray-500 text-sm">Welcome back to your food dashboard.</p>
                        </div>

                        {/* Address Pill */}
                        <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-2 py-2 rounded-full border border-gray-100 hover:border-gray-200 transition cursor-pointer group" onClick={() => setIsAddressModalOpen(true)}>
                            <MapPin size={16} className="text-gray-400 group-hover:text-[var(--primary)] transition" />
                            <span className="text-sm text-gray-600 max-w-[150px] truncate font-medium">{user.address}</span>
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[var(--primary)]">
                                <Edit2 size={12} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container -mt-0 pt-8 px-4 md:px-0">
                {/* Key Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

                    {/* 1. Subscription Progress */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Calendar size={100} />
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Current Plan</h3>
                                <div className="text-lg sm:text-xl font-bold text-gray-800">{planName}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-[var(--primary)]">{daysLeft}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase">Days Left</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-2">
                            <div className="bg-[var(--primary)] h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 font-medium">
                            <span>Started {format(startDate, 'd MMM')}</span>
                            <span>Ends {format(validUntil, 'd MMM')}</span>
                        </div>

                        {/* Days Saved Indicator */}
                        <div className="mt-3 bg-green-50 rounded-xl p-2 flex justify-between items-center">
                            <span className="text-xs font-bold text-green-700 uppercase">Days Saved from Skips</span>
                            <span className="text-sm font-bold text-green-700">+{Math.max(0, totalDays - (subscription.planId?.durationDays || 30))} Days</span>
                        </div>
                    </div>

                    {/* 2. Next Meal Timer */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition"></div>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Up Next</span>
                        </div>

                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                                {nextMeal.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{nextMeal.name}</h3>
                                <p className="text-gray-400 text-sm">Arriving around {nextMeal.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Today's Menu */}
                    <div className="bg-orange-50 p-6 rounded-3xl shadow-sm border border-orange-100 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-orange-900/50 text-xs font-bold uppercase tracking-wider">Today's Special</h3>
                            <Utensils size={16} className="text-orange-400" />
                        </div>

                        {menuData ? (
                            <div className="space-y-3">
                                <div className="bg-white/60 p-3 rounded-xl">
                                    <div className="text-xs text-orange-600 font-bold mb-1 uppercase">Lunch</div>
                                    <div className="text-sm font-medium text-gray-800 line-clamp-1">
                                        {Array.isArray(menuData.lunch) ? menuData.lunch.join(', ') : 'Lunch Menu Not Available'}
                                    </div>
                                </div>
                                <div className="bg-white/60 p-3 rounded-xl">
                                    <div className="text-xs text-orange-600 font-bold mb-1 uppercase">Dinner</div>
                                    <div className="text-sm font-medium text-gray-800 line-clamp-1">
                                        {Array.isArray(menuData.dinner) ? menuData.dinner.join(', ') : 'Dinner Menu Not Available'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-orange-300 pb-4">
                                <AlertCircle size={32} className="mb-2" />
                                <span className="text-sm font-medium">Menu updating...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Row */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition whitespace-nowrap" onClick={() => document.getElementById('scheduler').scrollIntoView({ behavior: 'smooth' })}>
                        <Calendar size={18} className="text-[var(--primary)]" />
                        <span className="font-bold text-gray-700">Skip Meals</span>
                    </button>

                    <button className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition whitespace-nowrap cursor-default">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                            {Math.max(0, totalDays - (subscription.planId?.durationDays || 30)) + subscription.skipBalance}
                        </div>
                        <span className="font-bold text-gray-700">Days Saved</span>
                    </button>

                    <a
                        href="https://wa.me/917307191299"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition whitespace-nowrap ml-auto"
                    >
                        <HelpCircle size={18} className="text-blue-500" />
                        <span className="font-bold text-gray-700">Help & Support</span>
                    </a>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="scheduler">
                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Smart Schedule</h2>
                            <div className="text-xs bg-white px-3 py-1 rounded-full border shadow-sm text-gray-500">
                                Tap date to skip
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
                            <SmartCalendar userPlan={subscription} onDateClick={handleDateClick} />
                        </div>
                    </div>

                    <div>
                        <div className="bg-[var(--light)] p-8 rounded-3xl border border-blue-100/50 h-full">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 mb-6">
                                <HelpCircle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Need a break?</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                Going on a holiday? You can pause your subscription for up to 7 days. Your plan will be extended automatically.
                            </p>
                            <a
                                href="https://wa.me/917307191299"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold shadow-sm hover:shadow-md transition border border-blue-50 block text-center"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Edit Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold">Update Delivery Address</h3>
                            <button onClick={() => setIsAddressModalOpen(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                                <X size={16} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateAddress} className="p-8">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">New Address</label>
                            <textarea
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--primary)] focus:bg-white transition min-h-[120px] text-gray-700 font-medium resize-none"
                                placeholder="Enter your full address with landmart..."
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                required
                            />
                            <div className="flex gap-3 justify-end mt-8">
                                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition">Cancel</button>
                                <button type="submit" className="btn btn-primary px-8 rounded-xl shadow-lg shadow-green-200" disabled={updatingAddress}>
                                    {updatingAddress ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Skip Meal Modal */}
            {isSkipModalOpen && selectedDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl overflow-hidden animate-scale-up">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Skip Meal</div>
                                <h3 className="font-bold text-xl text-gray-800">{format(selectedDate, 'EEEE, d MMM')}</h3>
                            </div>
                            <button onClick={() => setIsSkipModalOpen(false)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition"><X size={16} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-500 mb-2">Select a meal to skip. <br /><span className="text-[var(--primary)] font-bold">You will get +0.5 day credit per skip.</span></p>

                            <button
                                onClick={() => handleSkipMeal('lunch')}
                                disabled={skippingLoading}
                                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition group ${isSkipped(selectedDate, 'lunch') ? 'bg-red-50 border-red-200' : 'border-gray-100 hover:bg-orange-50 hover:border-orange-200'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition ${isSkipped(selectedDate, 'lunch') ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-600 group-hover:scale-110'}`}><Utensils size={20} /></div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-800">{isSkipped(selectedDate, 'lunch') ? 'Unskip Lunch' : 'Skip Lunch'}</div>
                                        <div className="text-xs text-gray-500 font-medium">12:00 PM - 2:00 PM</div>
                                    </div>
                                </div>
                                {isSkipped(selectedDate, 'lunch') && <span className="text-[10px] font-bold bg-white text-red-500 px-3 py-1 rounded-full shadow-sm">SKIPPED</span>}
                            </button>

                            <button
                                onClick={() => handleSkipMeal('dinner')}
                                disabled={skippingLoading}
                                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition group ${isSkipped(selectedDate, 'dinner') ? 'bg-red-50 border-red-200' : 'border-gray-100 hover:bg-slate-50 hover:border-slate-200'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition ${isSkipped(selectedDate, 'dinner') ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-600 group-hover:scale-110'}`}><UtensilsCrossed size={20} /></div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-800">{isSkipped(selectedDate, 'dinner') ? 'Unskip Dinner' : 'Skip Dinner'}</div>
                                        <div className="text-xs text-gray-500 font-medium">7:00 PM - 9:00 PM</div>
                                    </div>
                                </div>
                                {isSkipped(selectedDate, 'dinner') && <span className="text-[10px] font-bold bg-white text-red-500 px-3 py-1 rounded-full shadow-sm">SKIPPED</span>}
                            </button>

                            <button
                                onClick={() => handleSkipMeal('both')}
                                disabled={isSkipped(selectedDate, 'both') || (isSkipped(selectedDate, 'lunch') && isSkipped(selectedDate, 'dinner')) || skippingLoading}
                                className="w-full py-3 text-sm text-red-400 font-bold hover:text-red-600 transition"
                            >
                                Skip Whole Day (+1 Day Credit)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
