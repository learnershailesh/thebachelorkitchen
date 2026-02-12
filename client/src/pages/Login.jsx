import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, Phone, Lock, Home, ShieldCheck, KeyRound } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../config/firebase';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loginMethod, setLoginMethod] = useState('otp'); // Default to Mobile OTP
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [resendCountdown, setResendCountdown] = useState(0);

    const recaptchaVerifierRef = useRef(null);
    const { login, firebaseLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (resendCountdown > 0) {
            timer = setInterval(() => {
                setResendCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCountdown]);

    useEffect(() => {
        // Cleanup function for recaptcha
        const cleanupRecaptcha = () => {
            if (recaptchaVerifierRef.current) {
                try {
                    recaptchaVerifierRef.current.clear();
                    recaptchaVerifierRef.current = null;
                } catch (e) {
                    console.error("Error clearing recaptcha:", e);
                }
            }
        };

        if (!auth || loginMethod !== 'otp') {
            cleanupRecaptcha();
            return;
        }

        // Initialize recaptcha if not already done
        if (!recaptchaVerifierRef.current) {
            try {
                const verifier = new RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    {
                        size: "invisible",
                        callback: (response) => {
                            console.log("Recaptcha verified (invisible).");
                        },
                        'expired-callback': () => {
                            console.log("Recaptcha expired");
                            cleanupRecaptcha();
                        }
                    }
                );
                recaptchaVerifierRef.current = verifier;
            } catch (err) {
                console.error("Failed to initialize ReCAPTCHA:", err);
            }
        }

        return cleanupRecaptcha;
    }, [auth, loginMethod]);

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();

        if (!phone) {
            setError("Please enter your mobile number");
            return;
        }

        // Format phone number to E.164 (remove spaces, ensure + prefix)
        let formattedPhone = phone.trim().replace(/\s+/g, '');
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = `+91${formattedPhone}`;
        }

        console.log("Sending OTP to:", formattedPhone);

        setLoading(true);
        setError("");

        try {
            const appVerifier = recaptchaVerifierRef.current;
            if (!appVerifier) {
                throw new Error("reCAPTCHA not initialized. Please refresh the page.");
            }

            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            console.log("Firebase Confirmation Result:", confirmation);
            setConfirmationResult(confirmation);
            setOtpSent(true);
            setResendCountdown(30); // 30 seconds cooldown for resend
        } catch (err) {
            console.error("OTP Send Error:", err);

            if (err.code === 'auth/invalid-app-credential') {
                setError("Firebase verification failed. Please check if your domain (e.g., localhost) is authorized in Firebase Console.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many requests. Please try again later.");
            } else {
                setError(err.message || "Failed to send OTP");
            }

            // Reset reCAPTCHA so user can try again
            if (recaptchaVerifierRef.current) {
                try {
                    const widgetId = await recaptchaVerifierRef.current.render();
                    if (window.grecaptcha) {
                        window.grecaptcha.reset(widgetId);
                    }
                } catch (resetErr) {
                    console.error("Error resetting recaptcha:", resetErr);
                }
            }
        } finally {
            setLoading(false);
        }
    };


    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Please enter the 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const result = await confirmationResult.confirm(otp);
            const idToken = await result.user.getIdToken();
            console.log("Firebase ID Token:", idToken);
            console.log("Firebase User Object:", result);

            const loggedInUser = await firebaseLogin(idToken);

            if (loggedInUser.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            console.error("OTP Verification Error:", err);
            if (err.code === 'auth/code-expired') {
                setError("OTP has expired. Please request a new one.");
            } else if (err.code === 'auth/invalid-verification-code') {
                setError("Invalid OTP. Please check the 6-digit code.");
            } else {
                setError(err.message || 'Invalid OTP or User not found.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const user = await login(phone, password);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.toString());
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--light)] p-4 md:p-6 overflow-x-hidden">
            <div className="bg-white rounded-[20px] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl min-h-[500px] md:min-h-[600px] transform-gpu">

                {/* Left Side - Brand & Hero (Hidden on Mobile) */}
                <div className="hidden md:flex md:w-1/2 p-10 flex-col items-center justify-center bg-[var(--light)] relative overflow-hidden text-center animate-fade-in">
                    <img
                        src="/TBKlogo.png"
                        alt="The Bachelor's Kitchen"
                        className="w-full max-w-xl object-contain mb-8 transition-transform duration-700 hover:scale-110 hover:rotate-3 drop-shadow-2xl"
                    />
                    <div className="relative z-10 max-w-md space-y-4">
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-yellow-600 mb-3 tracking-wide">
                            Taste Trust Together
                        </h2>
                        <p className="text-gray-600 text-xl font-medium leading-relaxed opacity-90">
                            Welcome back! Log in to manage your meals and enjoy fresh tiffins.
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white">
                    {/* Home Button */}
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors mb-6 group w-fit">
                        <Home size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[var(--dark)] mb-1">Welcome Back! 👋</h1>
                        <p className="text-gray-500 text-sm">Please login to your account</p>
                    </div>

                    <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                        <button
                            onClick={() => { setLoginMethod('otp'); setError(''); setOtpSent(false); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${loginMethod === 'otp' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}
                        >
                            Mobile OTP
                        </button>
                        <button
                            onClick={() => { setLoginMethod('password'); setError(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${loginMethod === 'password' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}
                        >
                            Password
                        </button>
                    </div>


                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    {loginMethod === 'password' ? (
                        <form onSubmit={handlePasswordLogin}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-gray-400"><Phone size={18} /></span>
                                    <input
                                        type="text"
                                        name="phone"
                                        autoComplete="username"
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--light)] border border-transparent rounded-lg focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50 transition outline-none font-medium"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                                    <a href="#" className="text-xs text-[var(--primary)] font-semibold hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-gray-400"><Lock size={18} /></span>
                                    <input
                                        type="password"
                                        name="password"
                                        autoComplete="current-password"
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--light)] border border-transparent rounded-lg focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50 transition outline-none font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold py-3 rounded-lg transition shadow-lg shadow-yellow-200 flex justify-center items-center gap-2 group disabled:opacity-50">
                                {loading ? 'Logging in...' : 'Login'}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-gray-400"><Phone size={18} /></span>
                                    <input
                                        type="tel"
                                        disabled={otpSent}
                                        placeholder="Enter 10-digit number"
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--light)] border border-transparent rounded-lg focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50 transition outline-none font-medium disabled:opacity-50"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div id="recaptcha-container"></div>
                            </div>

                            {otpSent && (
                                <div className="mb-6 animate-fade-in">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Enter 6-digit OTP</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-gray-400"><KeyRound size={18} /></span>
                                        <input
                                            type="text"
                                            maxLength="6"
                                            className="w-full pl-10 pr-4 py-3 bg-[var(--light)] border border-transparent rounded-[12px] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50 transition outline-none font-bold tracking-[0.5em] text-lg text-center"
                                            placeholder="••••••"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setOtpSent(false); setOtp(''); }}
                                            className="text-xs text-gray-500 font-bold hover:underline"
                                        >
                                            Change Number
                                        </button>

                                        {resendCountdown > 0 ? (
                                            <span className="text-xs text-gray-400 font-bold">
                                                Resend OTP in {resendCountdown}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                className="text-xs text-[var(--primary)] font-bold hover:underline"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold py-3 rounded-lg transition shadow-lg shadow-yellow-200 flex justify-center items-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : (otpSent ? 'Verify & Login' : 'Send OTP')}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account? <Link to="/signup" className="text-[var(--primary)] font-bold hover:underline">Sign Up</Link>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-green-500" />
                        Secure Firebase Phone Auth
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
