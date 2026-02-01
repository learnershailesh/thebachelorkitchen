import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Heart, Users, Award, Target, Leaf, Clock, Home, Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[var(--light)]">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[var(--primary)] to-green-700 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                <div className="container relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group">
                        <Home size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-green-200">About Us</h1>
                    <p className="text-xl md:text-2xl max-w-3xl opacity-90 leading-relaxed">
                        We're not just a tiffin service. We're your home away from home, serving authentic,
                        wholesome meals with love and care.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-[var(--primary-dark)]">Our Story 📖</h2>

                        <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                            <p className="text-xl md:text-2xl font-semibold text-[var(--primary)] text-center mb-8">
                                The Bachelor's Kitchens is more than just a food startup—it's a feeling of home for those living away from it.
                            </p>

                            <p>
                                Born from the everyday struggles of bachelors, students, and working professionals, we exist to solve one simple problem: <strong>good, homely food should always be accessible.</strong> Long workdays, busy schedules, and empty kitchens often push people toward unhealthy outside food. We wanted to change that.
                            </p>

                            <p>
                                We serve freshly cooked meals every day, delivered on a subscription basis, so you never have to worry about cooking, groceries, or cleaning. Just honest food, prepared with care, and served on time.
                            </p>

                            {/* What Makes Us Special */}
                            <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-3xl p-8 my-10 border-l-4 border-[var(--primary)]">
                                <h3 className="text-2xl font-bold mb-4 text-[var(--primary-dark)] flex items-center gap-2">
                                    🍽️ What makes us special?
                                </h3>
                                <p className="mb-4">
                                    At The Bachelor's Kitchens, you'll find dishes from every corner of India. From comforting North Indian meals to soulful South Indian flavors, from the simplicity of the East to the bold tastes of the West—<strong>each meal is designed to remind you of home, no matter where you are.</strong>
                                </p>
                                <p>
                                    Every dish is cooked with hygiene, balance, and taste in mind—because we believe food should not only fill your stomach, but also comfort your heart.
                                </p>
                            </div>

                            {/* Emotional Message */}
                            <div className="text-center py-8">
                                <p className="text-xl font-medium text-gray-800 mb-3">
                                    This is not just a subscription meal service.
                                </p>
                                <p className="text-lg text-gray-600 mb-2">
                                    It's for the nights you miss home.
                                </p>
                                <p className="text-lg text-gray-600 mb-2">
                                    It's for the days you're too tired to cook.
                                </p>
                                <p className="text-lg text-gray-600 mb-6">
                                    It's for everyone who believes that food should feel personal.
                                </p>

                                <div className="inline-block bg-[var(--primary)] text-white px-8 py-4 rounded-2xl shadow-lg">
                                    <p className="text-2xl font-bold mb-2">Welcome to The Bachelor's Kitchens</p>
                                    <p className="text-lg opacity-90">Home-style meals. Everyday comfort. Delivered with care. 🍲✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-[var(--light)]">
                <div className="container">
                    <h2 className="text-4xl font-bold text-center mb-4">Our Core Values 💚</h2>
                    <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
                        These principles guide everything we do, from sourcing ingredients to delivering your meal.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Value 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-orange-100 text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart size={32} className="text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Made with Love</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Every meal is prepared with the same care and affection as a mother's cooking.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Leaf size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Fresh & Healthy</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We source fresh vegetables daily from local farmers. Zero frozen ingredients.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-100 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Award size={32} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Quality First</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                5-star hygiene standards. WHO-compliant protocols. No shortcuts, ever.
                            </p>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-purple-100 text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock size={32} className="text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Always On Time</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Hot meals delivered right on schedule. Punctuality is our promise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-white">
                <div className="container">
                    <h2 className="text-4xl font-bold text-center mb-4">Meet Our Team 👨‍🍳</h2>
                    <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
                        The passionate people behind your delicious meals.
                    </p>

                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
                        {/* Co-Founder 1 */}
                        <div className="text-center group">
                            <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                                <img src="/Pradeep.jpeg" alt="Pradeep Kumar" className="w-full h-full object-cover" style={{ objectPosition: 'center -15%', transform: 'scale(1.15)' }} />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Pradeep Kumar</h3>
                            <p className="text-sm text-[var(--primary)] font-semibold mb-2">Co-Founder</p>
                            <p className="text-gray-600 text-sm">Visionary leader driving our mission forward</p>
                        </div>

                        {/* Co-Founder 2 */}
                        <div className="text-center group">
                            <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                                <img src="/Alok.jpeg" alt="Alok Ranjan" className="w-full h-full object-cover" style={{ objectPosition: 'center -35%', transform: 'scale(1.20)' }} />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Alok Ranjan</h3>
                            <p className="text-sm text-[var(--primary)] font-semibold mb-2">Co-Founder</p>
                            <p className="text-gray-600 text-sm">Passionate about delivering quality meals</p>
                        </div>

                        {/* Co-Founder 3 */}
                        <div className="text-center group">
                            <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                                <img src="/Vikas.jpeg" alt="Vikash Rao" className="w-full h-full object-cover" style={{ objectPosition: 'center -15%', transform: 'scale(1.15)' }} />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Vikas Rao</h3>
                            <p className="text-sm text-[var(--primary)] font-semibold mb-2">Co-Founder</p>
                            <p className="text-gray-600 text-sm">Expert in operations and customer satisfaction</p>
                        </div>

                        {/* Tech Lead */}
                        <div className="text-center group">
                            <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                                <img src="/Skm.jpeg" alt="Shailesh Kumar Maurya" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Shailesh Kumar Maurya</h3>
                            <p className="text-sm text-[var(--primary)] font-semibold mb-2">Tech Lead</p>
                            <p className="text-gray-600 text-sm">Building smart tech to make your tiffin experience seamless</p>
                        </div>

                        {/* Operations Manager */}
                        <div className="text-center group">
                            <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                                <img src="/surendra.jpeg" alt="Surendra kumar" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Surendra kumar</h3>
                            <p className="text-sm text-[var(--primary)] font-semibold mb-2">Operations Manager</p>
                            <p className="text-gray-600 text-sm">Ensures every delivery is perfect, every single time</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[var(--primary)] text-white">
                <div className="container">
                    <h2 className="text-4xl font-bold text-center mb-16">Our Impact 📊</h2>

                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-extrabold mb-2">100+</div>
                            <div className="text-lg opacity-90">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold mb-2">5K+</div>
                            <div className="text-lg opacity-90">Meals Delivered Monthly</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold mb-2">4.8★</div>
                            <div className="text-lg opacity-90">Average Rating</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold mb-2">100%</div>
                            <div className="text-lg opacity-90">Fresh Ingredients</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-yellow-50 to-green-50">
                <div className="container text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Join Our Family? 🍽️</h2>
                    <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                        Experience the taste of home-cooked meals. Start your healthy food journey today.
                    </p>
                    <Link
                        to="/signup"
                        className="btn btn-primary text-lg px-10 py-4 shadow-xl inline-block"
                    >
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer className="bg-[var(--primary-dark)] text-white py-12">
                <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
                    <div>
                        <h3 className="text-white text-xl mb-4 font-bold">The Bachelor's Kitchen</h3>
                        <p className="opacity-70 text-sm">Delivering happiness, one tiffin at a time.</p>
                    </div>
                    <div>
                        <h4 className="text-white mb-4 font-bold">Quick Links</h4>
                        <ul className="space-y-2 opacity-70 text-sm">
                            <li><Link to="/about-us" className="hover:text-[var(--secondary)] transition">About Us</Link></li>
                            <li><Link to="/cancellation-policy" className="hover:text-[var(--secondary)] transition">Cancellation Policy</Link></li>
                            <li><Link to="/" className="hover:text-[var(--secondary)] transition">Home</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-4 font-bold">Contact</h4>
                        <ul className="space-y-2 opacity-70 text-sm">
                            <li><a href="tel:+917307191299" className="hover:text-[var(--secondary)] transition">+91 73071 91299</a></li>
                            <li>reachus@thebachelorskitchens.com</li>
                            <li>Varanasi, Uttar Pradesh</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-4 font-bold">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/company/the-bachelor-s-kitchens/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#0077b5] transition-all flex items-center justify-center group">
                                <Linkedin size={20} className="text-white group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://www.instagram.com/thebachelors.kitchens?igsh=bHcybHUxeGpoZmM3&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] transition-all flex items-center justify-center group">
                                <Instagram size={20} className="text-white group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://youtube.com/@thebachelors.kitchens?si=Q_d7zVvpyD9dBF4t" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ff0000] transition-all flex items-center justify-center group">
                                <Youtube size={20} className="text-white group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://x.com/tbkbharat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-black transition-all flex items-center justify-center group">
                                <Twitter size={20} className="text-white group-hover:scale-110 transition-transform" />
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

export default AboutUs;
