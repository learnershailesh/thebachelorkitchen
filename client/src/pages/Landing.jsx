import Navbar from '../components/Navbar';
import { CheckCircle, Clock, Calendar, Star, Leaf, Flame, Play, Quote, ChevronRight, ChevronDown, Smartphone, ShieldCheck, Sprout, Instagram, Youtube, Linkedin, Twitter, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import heroTiffin from '../assets/hero_tiffin.png';
import SEO from '../components/SEO';

const Landing = () => {
    // Accordion State
    const [openFaq, setOpenFaq] = useState(null);
    const [plans, setPlans] = useState([]);
    const [videos, setVideos] = useState([]);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'trial'
    const { user, api } = useAuth();
    const navigate = useNavigate();

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const planMetadata = {
        "Focus Start Plan": {
            icon: <Flame size={32} className="text-orange-500" />,
            duration: "/ month",
            recommended: false,
            menuUrl: "/FocusStartPlan.pdf"
        },
        "Smart Study Plan": {
            icon: <Star size={32} className="text-yellow-500" />,
            duration: "/ month",
            recommended: true,
            menuUrl: "/SmartStudyPlan.pdf"
        },
        "Peak Performance Plan": {
            icon: <Leaf size={32} className="text-green-500" />,
            duration: "/ month",
            recommended: false,
            menuUrl: "/PeakPerformancePlan.pdf"
        },
        "Focus Start - Trial Pack": {
            icon: <Flame size={32} className="text-orange-400" />,
            duration: "/ 7 days",
            recommended: false,
            menuUrl: "/FocusStartPlan.pdf"
        },
        "Smart Study - Trial Pack": {
            icon: <Star size={32} className="text-yellow-400" />,
            duration: "/ 7 days",
            recommended: true,
            menuUrl: "/SmartStudyPlan.pdf"
        },
        "Peak Performance - Trial Pack": {
            icon: <Leaf size={32} className="text-green-400" />,
            duration: "/ 7 days",
            recommended: false,
            menuUrl: "/PeakPerformancePlan.pdf"
        }
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // Use api instance or axios. Use api for consistency if available
                // If api instance adds token, it's fine for public route too usually
                const { data } = await api.get('/plans');
                if (Array.isArray(data)) {
                    const mergedPlans = data.map(p => ({
                        ...p,
                        ...planMetadata[p.name],
                        priceDisplay: `₹${p.price.toLocaleString()}`
                    }));
                    setPlans(mergedPlans);
                } else {
                    throw new Error('Plans data is not an array');
                }
            } catch (error) {
                console.error("Failed to fetch plans", error);
                // Fallback to hardcoded if API fails (optional, but good for stability during dev)
                setPlans([
                    {
                        _id: '1',
                        name: "Focus Start Plan",
                        priceDisplay: "₹2,899",
                        description: "Basic Plan",
                        features: ["Homestyle Comfort Meals", "Freshly Prepared Daily", "Perfect Portion Sizes", "Lunch & Dinner Included"],
                        ...planMetadata["Focus Start Plan"]
                    },
                    {
                        _id: '2',
                        name: "Smart Study Plan",
                        priceDisplay: "₹3,299",
                        description: "Standard Plan",
                        features: ["Includes Focus Start Benefits", "Weekend Special Treats", "Daily Sweet & Savory Sides", "Brain-Boosting Nutrition"],
                        ...planMetadata["Smart Study Plan"]
                    },
                    {
                        _id: '3',
                        name: "Peak Performance Plan",
                        priceDisplay: "₹3,699",
                        description: "Premium Plan",
                        features: ["High-Protein Power Meals", "Chef-Curated Healthy Menu", "Low-Oil & Wholesome", "Customized for Performance"],
                        ...planMetadata["Peak Performance Plan"]
                    }
                ]);
            }
        };

        const fetchVideos = async () => {
            try {
                const { data } = await api.get('/admin/videos');
                if (Array.isArray(data)) {
                    setVideos(data);
                } else {
                    console.error("Videos data is not an array:", data);
                    setVideos([]);
                }
            } catch (error) {
                console.error("Failed to fetch videos", error);
                setVideos([]);
            }
        };

        const loadAll = async () => {
            await Promise.all([fetchPlans(), fetchVideos()]);
            // After data is loaded and rendered, check if we need to scroll to a hash
            if (window.location.hash) {
                const id = window.location.hash.substring(1);
                setTimeout(() => {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        };

        loadAll();
    }, [api]);

    const handleSubscribe = (plan) => {
        if (!user) {
            navigate('/signup');
            return;
        }
        // Remove non-serializable icon before passing state to avoid DataCloneError
        const { icon, ...serializablePlan } = plan;
        navigate('/checkout', { state: { plan: serializablePlan } });
    };

    const testimonials = [
        { name: "Rahul S.", role: "Software Engineer", text: "The pause feature is a lifesaver! I travel a lot and never lose money now. Food is just like home." },
        { name: "Priya M.", role: "Student", text: "Healthy diet plan helped me lose 3kgs. The paneer salad is amazing!" },
        { name: "Amit K.", role: "Banker", text: "Timely delivery every single day. The packaging is spill-proof and hygienic." }
    ];

    const faqs = [
        { q: "Can I pause my meal for just one day?", a: "Yes! Use our Smart Calendar app to pause your meal before 10 PM the previous day. Your subscription validity will automatically extend by 1 day." },
        { q: "Is the packaging microwave safe?", a: "Absolutely. We use high-grade, BPA-free containers that can be directly safely heated in a microwave." },
        { q: "Do you deliver on Sundays?", a: "Yes, we deliver lunch on Sundays. Sunday Dinner is usually not included to allow our staff a break, but we offer special Sunday Lunch specials!" }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <SEO
                title="Home - Authentic Tiffin Service"
                description="The Bachelor's Kitchens serves freshly cooked, homely meals daily. Perfect subscription plans for students & professionals. Hygienic, tasty, and delivered on time."
            />
            <Navbar />

            {/* Hero Section - Redesigned */}
            <header className="container py-10 md:py-24 animate-fade-in flex flex-col-reverse md:flex-row items-center gap-12 relative">
                {/* Floating BG Blobs - Strengthened - Hidden on mobile for performance and clarity */}
                <div className="hidden lg:block bg-blob w-96 h-96 bg-yellow-400 rounded-full top-0 -left-20 animate-float opacity-40"></div>
                <div className="hidden lg:block bg-blob w-80 h-80 bg-green-300 rounded-full bottom-0 right-0 animate-float opacity-40" style={{ animationDelay: '2s' }}></div>

                <div className="flex-1 text-center md:text-left z-10">
                    <div className="inline-block bg-white/90 backdrop-blur-md border border-green-200 text-[var(--primary)] px-6 py-2 rounded-full text-sm font-bold mb-8 tracking-wide shadow-md transform hover:scale-105 transition cursor-default">
                        🚀 #1 Daily Indian Meal Brand in Varanasi
                        <span className="ml-2 text-xs text-gray-600">
                            (Expanding soon across India)</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl mb-6 leading-tight font-extrabold text-[var(--primary-dark)]">
                        Ghar Ka Khana <br />
                        <span className="text-gradient">India Ke Har Kone Se</span>,<br />
                    </h1>
                    <p className="text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
                        Taste, Trust, Together.
                        Healthy, hygienic Indian meals inspired by flavours from across India — delivered fresh to your doorstep.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                        <button
                            onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn btn-primary text-lg px-8 py-4 shadow-xl shadow-yellow-200/50 hover:shadow-yellow-200"
                        >
                            View Plans
                        </button>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/80 border border-green-50 shadow-sm backdrop-blur-sm">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm"></div>
                                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white shadow-sm"></div>
                                <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white shadow-sm"></div>
                            </div>
                            <span className="text-sm font-bold text-[var(--primary)]">100+ Happy Eaters</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <div className="relative z-10 w-full max-w-lg mx-auto transform hover:scale-[1.02] transition duration-500 hover:rotate-1 px-4 md:px-0">
                        <img src={heroTiffin} alt="Delicious Tiffin" className="rounded-[2rem] shadow-2xl border-4 border-white/50 w-full" />

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-bounce" style={{ animationDuration: '3s' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-bold text-[var(--dark)]">Hygiene Checked</span>
                            </div>
                            <div className="text-xs text-gray-500 pl-5">Temp: 65°C | Staff: Masked</div>
                        </div>
                    </div>
                    {/* Decorative blob behind */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-green-200/50 to-yellow-200/50 rounded-full blur-3xl -z-10 opacity-70"></div>
                </div>
            </header>

            {/* How It Works - Colorful & Interesting */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

                <div className="container text-center relative z-10">
                    <h2 className="mb-4 text-4xl">How It Works ⚡</h2>
                    <p className="text-gray-500 mb-20">3 Simple steps to get delicious food on your table.</p>

                    <div className="flex flex-col md:flex-row justify-between relative px-4 md:px-10 max-w-6xl mx-auto gap-12 md:gap-0">
                        {/* Connecting Gradient Line */}
                        <div className="hidden md:block absolute top-[60px] left-20 right-20 h-2 bg-gradient-to-r from-orange-200 via-yellow-200 to-green-200 -z-10 rounded-full"></div>

                        {/* Step 1 - Orange */}
                        <div className="flex flex-col items-center group">
                            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-8 border-4 border-orange-100 shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                                <div className="absolute inset-0 bg-orange-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                <span className="text-6xl z-10 filter drop-shadow-sm">👆</span>
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white">1</div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">Choose Plan</h3>
                            <p className="text-gray-500 max-w-[250px] leading-relaxed">Select from Focus, Smart, or Peak options designed for your lifestyle.</p>
                        </div>

                        {/* Step 2 - Yellow */}
                        <div className="flex flex-col items-center group md:-mt-8">
                            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-8 border-4 border-yellow-100 shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                                <div className="absolute inset-0 bg-yellow-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                <span className="text-6xl z-10 filter drop-shadow-sm">👨‍🍳</span>
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white">2</div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-yellow-500 transition-colors">We Cook Fresh</h3>
                            <p className="text-gray-500 max-w-[250px] leading-relaxed">Expert Chefs create healthy magic using fresh, locally sourced ingredients.</p>
                        </div>

                        {/* Step 3 - Green */}
                        <div className="flex flex-col items-center group">
                            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-8 border-4 border-green-100 shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                                <div className="absolute inset-0 bg-green-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                <span className="text-6xl z-10 filter drop-shadow-sm">🚀</span>
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white">3</div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-green-600 transition-colors">Fast Delivery</h3>
                            <p className="text-gray-500 max-w-[250px] leading-relaxed">Hot, spill-proof tiffins delivered to your doorstep. On time, everytime.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="kitchen" className="py-24 bg-green-50 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-yellow-200/30 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Live Kitchen Feed
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Unfiltered & Open 🔍</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            We have nothing to hide. See exactly how your food is prepared—clean, hygienic, and full of love.
                        </p>
                    </div>

                    {/* Reels Style Grid - Cinematic */}
                    <div className="flex flex-nowrap md:flex-wrap md:justify-center gap-6 md:gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide px-4">
                        {Array.isArray(videos) && videos.length > 0 ? (
                            videos.map((video) => {
                                // Helper to convert standard YouTube URL to Embed URL
                                const getEmbedUrl = (url) => {
                                    if (!url) return '';
                                    try {
                                        let videoId = null;
                                        if (url.includes('youtube.com/watch?v=')) {
                                            videoId = url.split('v=')[1].split('&')[0];
                                        } else if (url.includes('youtu.be/')) {
                                            videoId = url.split('youtu.be/')[1].split('?')[0];
                                        } else if (url.includes('youtube.com/shorts/')) {
                                            videoId = url.split('shorts/')[1].split('?')[0];
                                        }

                                        if (videoId) {
                                            return `https://www.youtube.com/embed/${videoId}`;
                                        }
                                        return url;
                                    } catch (e) {
                                        return url;
                                    }
                                };
                                return (
                                    <div key={video._id} className="group relative w-[240px] md:w-[280px] h-[450px] md:h-[500px] flex-shrink-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl transform hover:scale-105 transition-all duration-500 border-[6px] md:border-[8px] border-gray-800 bg-black snap-center ring-1 ring-white/10">
                                        {/* Phone Notch Mockup */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-30"></div>

                                        <div className="w-full h-full relative">
                                            <iframe
                                                src={getEmbedUrl(video.url)}
                                                title={video.title}
                                                className="w-full h-full object-cover"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none"></div>

                                            <div className="absolute bottom-6 left-5 right-5 z-20 text-white pointer-events-none">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full">
                                                        <Play size={12} className="fill-white" />
                                                    </div>
                                                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Now Playing</span>
                                                </div>
                                                <h3 className="font-bold text-xl leading-tight mb-2">{video.title}</h3>
                                                {video.description && <p className="text-xs text-gray-300 line-clamp-2">{video.description}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center w-full py-10 text-gray-400 italic">
                                Cooking up some new videos! Stay tuned.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Suggested Section: Sample Menu Carousel - Yellow Tint */}
            {/* Why Choose Us Section - Replaces Menu */}
            <section id="features" className="py-20 bg-yellow-50/50">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl mb-4">More Than Just A Meal 🥘</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">We don't just deliver food; we deliver an experience. Here is why 100+ bachelors trust us.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                                <Sprout size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Farm Fresh</h3>
                            <p className="text-gray-500 leading-relaxed">We source vegetables daily from local farmers. No frozen stuff, ever.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">No-Repeat Menu</h3>
                            <p className="text-gray-500 leading-relaxed">7 Days, 7 Different Dishes. We ensure you never get bored of the food.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                                <Smartphone size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Smart Tech</h3>
                            <p className="text-gray-500 leading-relaxed">Pause, cancel, or change your plan with one tap on our app.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">5-Star Hygiene</h3>
                            <p className="text-gray-500 leading-relaxed">Kitchens scrubbed twice daily. Staff follows strict WHO protocols.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-20 bg-[var(--primary)] text-white relative overflow-hidden">
                {/* Decorative Texture */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                <div className="container relative z-10">
                    <h2 className="text-center text-white mb-12">Why People Trust The Bachelor’s Kitchens ❤️</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                <Quote className="text-[var(--secondary)] mb-4" size={32} />
                                <p className="text-lg mb-6 leading-relaxed opacity-90">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-bold">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold">{t.name}</div>
                                        <div className="text-xs opacity-70 uppercase tracking-wide">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Plans Section */}
            <section id="plans" className="py-24 bg-[var(--light)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl -z-10"></div>

                <div className="container relative z-10">
                    <div className="text-center mb-12">
                        <span className="text-[var(--primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Flexible Pricing</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Choose Your Plan</h2>
                        <p className="text-gray-600 mb-10 max-w-xl mx-auto">Skip the hassle of cooking. Choose a plan that fits your lifestyle. Pause anytime, no questions asked.</p>

                        {/* Billing Cycle Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-16">
                            <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-[var(--primary)]' : 'text-gray-400'}`}>Monthly Subscription</span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'trial' : 'monthly')}
                                className="w-16 h-8 bg-[var(--primary)] rounded-full relative p-1 transition-all duration-300 shadow-inner"
                            >
                                <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${billingCycle === 'trial' ? 'translate-x-8' : 'translate-x-0'}`}></div>
                            </button>
                            <div className="flex flex-col items-start translate-y-1">
                                <span className={`text-sm font-bold transition-colors ${billingCycle === 'trial' ? 'text-[var(--primary)]' : 'text-gray-400'}`}>7-Day Trial Pack</span>
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase ring-1 ring-green-200">Start Small</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans
                            .filter(plan => billingCycle === 'trial' ? plan.name.includes('Trial') : !plan.name.includes('Trial'))
                            .map((plan) => (
                                <div key={plan.name} className={`group relative flex flex-col p-8 rounded-[2.5rem] bg-white transition-all duration-500 h-full ${plan.recommended ? 'ring-4 ring-[var(--secondary)] shadow-2xl scale-105 z-10' : 'border border-green-50 shadow-xl hover:shadow-2xl'}`}>
                                    {plan.recommended && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--secondary)] text-[var(--primary-dark)] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                                            Best Value
                                        </div>
                                    )}

                                    <div className="mb-6 flex justify-between items-start">
                                        <div className={`p-4 rounded-2xl ${plan.recommended ? 'bg-yellow-50' : 'bg-gray-50'} group-hover:scale-110 transition-transform`}>
                                            {plan.icon}
                                        </div>
                                        {billingCycle === 'trial' && (
                                            <span className="text-[10px] font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full uppercase tracking-tighter border border-green-100 italic">No Commitment</span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black mb-2 text-gray-900">{plan.name.replace(' - Trial Pack', '')}</h3>
                                    <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">{plan.description}</p>

                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-4xl font-black text-[var(--primary-dark)]">{plan.priceDisplay || `₹${plan.price}`}</span>
                                        <span className="text-gray-400 font-bold text-sm tracking-tight">{plan.duration}</span>
                                    </div>

                                    <div className="space-y-4 mb-10 flex-1">
                                        <div className="text-xs font-black text-[var(--primary)] uppercase tracking-widest opacity-40">What's Included</div>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                                        <CheckCircle size={12} className="text-green-600" />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {plan.menuUrl && (
                                        <a
                                            href={plan.menuUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mb-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-300 text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all font-bold text-sm bg-gray-50/50"
                                        >
                                            <FileText size={16} />
                                            View Menu
                                        </a>
                                    )}

                                    <button
                                        onClick={() => handleSubscribe(plan)}
                                        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 group/btn ${plan.recommended
                                            ? 'bg-[var(--primary)] text-white shadow-lg shadow-green-200 hover:bg-[var(--primary-dark)]'
                                            : 'bg-white border-2 border-gray-100 text-[var(--primary-dark)] hover:border-[var(--primary)] hover:bg-gray-50 shadow-sm'
                                            }`}>
                                        {billingCycle === 'trial' ? 'Start Trial Now' : 'Subscribe Now'}
                                        <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-sm font-bold text-gray-400 flex items-center justify-center gap-2">
                            <ShieldCheck size={16} className="text-green-500" />
                            Secure checkout powered by Razorpay
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-3xl">
                    <h2 className="text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition bg-[var(--light)]">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex justify-between items-center p-6 text-left font-semibold text-[var(--dark)]"
                                >
                                    {faq.q}
                                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 text-gray-600 animate-fade-in">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8 text-gray-500 text-sm">
                        Still have questions? <a href="https://wa.me/917307191299?text=Hi!%20I%20have%20a%20question%20about%20your%20tiffin%20service." target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] font-bold hover:underline">Chat with us on WhatsApp</a>
                    </div>
                </div>
            </section>

            <footer className="bg-[var(--primary-dark)] text-white py-12">
                <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-white text-xl mb-4">The Bachelor's Kitchen</h3>
                        <p className="opacity-70 text-sm">Delivering happiness, one tiffin at a time.</p>
                    </div>
                    <div>
                        <h4 className="text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 opacity-70 text-sm">
                            <li><Link to="/about-us" className="hover:text-[var(--secondary)] transition">About Us</Link></li>
                            <li><Link to="/cancellation-policy" className="hover:text-[var(--secondary)] transition">Cancellation Policy</Link></li>
                            <li><button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[var(--secondary)] transition">Plans</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-4">Contact</h4>
                        <ul className="space-y-2 opacity-70 text-sm">
                            <li><a href="tel:+917307191299" className="hover:text-[var(--secondary)] transition">+91 73071 91299</a></li>
                            <li>reachus@thebachelorskitchens.com</li>
                            <li>Kabir Nagar, Durgakund, Lanka, Varanasi, Uttar Pradesh</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/company/the-bachelor-s-kitchens/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#0077b5] hover:scale-110 transition-all duration-300 flex items-center justify-center group">
                                <Linkedin size={20} className="text-white group-hover:animate-pulse" />
                            </a>
                            <a href="https://www.instagram.com/thebachelors.kitchens?igsh=bHcybHUxeGpoZmM3&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:scale-110 transition-all duration-300 flex items-center justify-center group">
                                <Instagram size={20} className="text-white group-hover:animate-pulse" />
                            </a>
                            <a href="https://youtube.com/@thebachelors.kitchens?si=Q_d7zVvpyD9dBF4t" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ff0000] hover:scale-110 transition-all duration-300 flex items-center justify-center group">
                                <Youtube size={20} className="text-white group-hover:animate-pulse" />
                            </a>
                            <a href="https://x.com/tbkbharat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-black hover:scale-110 transition-all duration-300 flex items-center justify-center group">
                                <Twitter size={20} className="text-white group-hover:animate-pulse" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-white/10 opacity-50 text-xs">
                    © 2025 The Bachelor's Kitchen. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
