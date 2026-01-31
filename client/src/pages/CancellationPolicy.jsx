import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Home, CheckCircle, XCircle, AlertCircle, Calendar, Clock, RefreshCw, Phone, Gift, ShieldCheck, FileText, Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';

const CancellationPolicy = () => {
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

                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-green-200">Cancellation, Refund & Adjustment Policy</h1>
                    <p className="text-xl md:text-2xl max-w-3xl opacity-90 leading-relaxed">
                        For Monthly Tiffin Subscription
                    </p>
                </div>
            </section>

            {/* Quick Summary */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
                            <h3 className="text-xl font-bold text-red-700 mb-3 flex items-center gap-2">
                                <AlertCircle size={24} />
                                Important Notice
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <XCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                                    <span><strong>No Refund Policy:</strong> Monthly subscriptions are non-refundable and non-transferable</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                                    <span><strong>Adjustment Allowed:</strong> Up to 5 days can be carried forward to next cycle</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Clock size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                                    <span><strong>24 Hours Notice:</strong> Must inform about skip/absence at least 24 hours in advance</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Policy */}
            <section className="py-20 bg-white">
                <div className="container max-w-4xl">
                    <div className="space-y-8">
                        {/* 1. No Refund Policy */}
                        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <XCircle size={24} className="text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">1. No Refund Policy</h3>
                                </div>
                            </div>

                            <div className="space-y-3 text-gray-700 leading-relaxed ml-16">
                                <p>Once a customer purchases a monthly tiffin subscription, <strong>no refund shall be provided under any circumstances.</strong></p>
                                <p>Subscription amount is <strong>non-refundable</strong> and <strong>non-transferable.</strong></p>
                            </div>
                        </div>

                        {/* 2. Adjustment Policy */}
                        <div className="bg-white border-2 border-green-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Calendar size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">2. Adjustment Policy (Maximum 5 Days Only)</h3>
                                </div>
                            </div>

                            <div className="space-y-4 text-gray-700 leading-relaxed ml-16">
                                <p>Customers are eligible for adjustment of up to a maximum of <strong className="text-[var(--primary)]">five (5) tiffin days only</strong> within a monthly subscription cycle.</p>

                                <div>
                                    <h4 className="font-bold text-[var(--primary)] mb-2">Adjustment means:</h4>
                                    <p>If a customer is unable to avail tiffin service for up to five (5) days or less during an active monthly subscription, for any reason, such unused tiffins shall be carried forward and added to the customer's next subscription cycle.</p>
                                    <p className="mt-2">The next subscription cycle shall commence only after the adjusted (carried-forward) tiffins are fully utilized.</p>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-bold text-gray-800 mb-2">Important Conditions:</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[var(--primary)] font-bold">•</span>
                                            <span>Adjustment of tiffin service is strictly limited to a maximum of five (5) days only per subscription cycle.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[var(--primary)] font-bold">•</span>
                                            <span>Adjustment beyond five (5) days shall not be permitted under any circumstances.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[var(--primary)] font-bold">•</span>
                                            <span>Any unused tiffins exceeding the allowed five (5) days shall automatically lapse and shall not be eligible for refund, credit, or further carry forward.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 3. Mandatory Prior Intimation */}
                        <div className="bg-white border-2 border-orange-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Clock size={24} className="text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">3. Mandatory Prior Intimation</h3>
                                </div>
                            </div>

                            <div className="space-y-3 text-gray-700 leading-relaxed ml-16">
                                <p>Customer must inform about skip/absence <strong>at least 24 hours in advance.</strong></p>
                                <p>Same-day or post-delivery skip requests will <strong>not be considered</strong> for adjustment.</p>
                            </div>
                        </div>

                        {/* 4. No Pause or Freeze Beyond Policy */}
                        <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <RefreshCw size={24} className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">4. No Pause or Freeze Beyond Policy</h3>
                                </div>
                            </div>

                            <div className="space-y-3 text-gray-700 leading-relaxed ml-16">
                                <p>Monthly subscriptions <strong>cannot be paused, frozen, or extended</strong> beyond the allowed 5-day adjustment.</p>
                                <p>Any unused tiffins beyond this policy will stand <strong>forfeited.</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Free Trial & Weekly Plan */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                        <Gift size={32} className="text-[var(--primary)]" />
                        Free Trial & Weekly Plan Policy
                    </h2>

                    <div className="space-y-8">
                        {/* 5. Free One-Day Trial */}
                        <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-sm">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-blue-600">5.</span> Free One-Day Trial
                            </h3>

                            <div className="space-y-3 text-gray-700 leading-relaxed">
                                <p>The Bachelor's Kitchens offers <strong>one (1) free tiffin trial</strong> for first-time customers.</p>
                                <ul className="space-y-2 ml-4">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--primary)] font-bold">•</span>
                                        <span>Free trial is subject to availability and management approval.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--primary)] font-bold">•</span>
                                        <span>No monetary compensation or refund shall be applicable for free trial.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 6. Paid Weekly Trial */}
                        <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-sm">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-purple-600">6.</span> Paid Weekly Trial Option
                            </h3>

                            <div className="space-y-3 text-gray-700 leading-relaxed">
                                <p>Customers who wish to evaluate our service further may opt for a <strong>paid weekly trial plan.</strong></p>
                                <p>Weekly plan pricing shall be decided and communicated by The Bachelor's Kitchens from time to time.</p>

                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-3">
                                    <p className="font-bold mb-2">Weekly trial plans are:</p>
                                    <ul className="space-y-1 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-purple-600 mt-0.5" />
                                            <span>Fully paid in advance</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-purple-600 mt-0.5" />
                                            <span>Non-refundable</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-purple-600 mt-0.5" />
                                            <span>Non-adjustable</span>
                                        </li>
                                    </ul>
                                </div>

                                <p className="mt-3">After completion of the weekly plan, customer may opt for a monthly subscription.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* General Service Terms */}
            <section className="py-20 bg-white">
                <div className="container max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                        <FileText size={32} className="text-[var(--primary)]" />
                        General Service Terms
                    </h2>

                    <div className="space-y-6">
                        {/* 7. Food Preparation & Delivery */}
                        <div className="bg-gray-50 border-l-4 border-[var(--primary)] rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-3">7. Food Preparation & Delivery</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">•</span>
                                    <span>Once food preparation has started, no cancellation or modification shall be allowed.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">•</span>
                                    <span>Delivery timing is approximate and may vary due to traffic, weather, or operational reasons.</span>
                                </li>
                            </ul>
                        </div>

                        {/* 8. Quality & Complaint Policy */}
                        <div className="bg-gray-50 border-l-4 border-[var(--primary)] rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-3">8. Quality & Complaint Policy</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">•</span>
                                    <span>Any food-related complaint must be reported <strong>within 2 hours of delivery.</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">•</span>
                                    <span>Valid proof (photo/video) may be requested.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">•</span>
                                    <span>Repeated misuse of complaints may lead to service termination without refund.</span>
                                </li>
                            </ul>
                        </div>

                        {/* 9. Management Rights */}
                        <div className="bg-gray-50 border-l-4 border-[var(--primary)] rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-3">9. Management Rights</h3>
                            <p className="text-gray-700 mb-3">The Bachelor's Kitchens reserves the right to:</p>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">•</span>
                                    <span>Modify menu, pricing, or policies</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">•</span>
                                    <span>Refuse service in case of misuse or policy violation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">•</span>
                                    <span>Update terms without prior notice (latest version applicable on website)</span>
                                </li>
                            </ul>
                        </div>

                        {/* 10. Acceptance of Terms */}
                        <div className="bg-gradient-to-br from-green-50 to-yellow-50 border-2 border-[var(--primary)] rounded-xl p-8">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <ShieldCheck size={24} className="text-[var(--primary)]" />
                                10. Acceptance of Terms
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                By purchasing any subscription or placing an order, the customer agrees to abide by all the <strong>Terms & Conditions, Cancellation & Refund Policy</strong> of The Bachelor's Kitchens.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-[var(--primary)] text-white">
                <div className="container text-center">
                    <Phone size={48} className="mx-auto mb-4" />
                    <h3 className="text-3xl font-bold mb-4">Have Questions About Our Policy?</h3>
                    <p className="text-xl mb-6 opacity-90">Our customer support team is here to help</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <a href="tel:+919999000000" className="text-lg font-bold hover:underline">
                            📞 +91 73071 91299
                        </a>
                        <span className="hidden md:inline">|</span>
                        <a href="mailto:support@thebachelorskitchen.com" className="text-lg font-bold hover:underline">
                            ✉️ reachus@thebachelorskitchens.com
                        </a>
                    </div>
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
                            <li>+91 73071 91299</li>
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

export default CancellationPolicy;
