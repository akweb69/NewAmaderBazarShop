import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// ── Firebase ──────────────────────────────────────────────────────────────────
import app from './Firebase';
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

// ── react-icons ───────────────────────────────────────────────────────────────
import { FiMail, FiPhone, FiLock, FiArrowRight, FiLoader, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaStore, FaShieldAlt, FaTachometerAlt } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import { BsCheckCircleFill, BsLightningChargeFill } from 'react-icons/bs';
import { HiSparkles } from 'react-icons/hi';

const auth = getAuth(app);
const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
};
const slideIn = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ size = 16 }) => (
    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }} className="inline-flex">
        <FiLoader size={size} />
    </motion.span>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ Icon, label, name, type = 'text', value, onChange, placeholder, required, delay, rightEl }) => (
    <motion.div variants={fadeUp} custom={delay} className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-orange-300 uppercase tracking-widest">{label}</label>
        <div className="relative">
            {Icon && (
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
                    <Icon size={14} />
                </span>
            )}
            <input type={type} name={name} value={value} onChange={onChange}
                placeholder={placeholder} required={required}
                className="w-full bg-white/[0.04] border border-orange-500/20 focus:border-orange-500
                    rounded-xl pl-10 pr-11 py-3 text-white placeholder-white/20 text-sm outline-none
                    transition-all duration-300 focus:bg-orange-950/25 focus:ring-2 focus:ring-orange-500/20" />
            {rightEl && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</span>
            )}
        </div>
    </motion.div>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = ({ label }) => (
    <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-orange-500/15" />
        <span className="text-orange-400/40 text-[11px] font-medium whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-orange-500/15" />
    </div>
);

// ─── Feature Row ──────────────────────────────────────────────────────────────
const Feature = ({ Icon, text, delay }) => (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={delay} className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400 flex-shrink-0">
            <Icon size={13} />
        </span>
        <span className="text-orange-200/50 text-sm">{text}</span>
    </motion.div>
);

// ─── Floating Orb ─────────────────────────────────────────────────────────────
const FloatingOrb = ({ className, delay = 0, duration = 6 }) => (
    <motion.div
        className={`absolute rounded-full pointer-events-none ${className}`}
        animate={{ y: [0, -18, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
);

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const StatPill = ({ value, label, delay }) => (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={delay}
        className="flex flex-col items-center px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/15">
        <span className="text-orange-400 font-black text-lg leading-none">{value}</span>
        <span className="text-orange-200/40 text-[10px] mt-0.5 whitespace-nowrap">{label}</span>
    </motion.div>
);

// ─── Save / upsert user to DB after Google login ──────────────────────────────
// For Google signin, we try to save — your API should handle duplicate uid gracefully
// (e.g. upsert). If it always inserts, you can skip this on signin.
const saveUserToDB = async (userCredential, extra = {}) => {
    const { uid, email, phoneNumber, displayName, photoURL } = userCredential.user;
    const user = {
        uid,
        email: email || null,
        phone: phoneNumber || extra.phone || null,
        displayName: displayName || null,
        photoURL: photoURL || null,
        accountType: extra.accountType || 'user',
        signupMethod: extra.signupMethod || 'google',
        createdAt: new Date().toISOString(),
    };
    const { data } = await axios.post(`${BASE_URL}/users`, user);
    return data;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Signin = () => {
    const navigate = useNavigate();
    const [loginMethod, setLoginMethod] = useState('email');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const [form, setForm] = useState({ email: '', phone: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // ── Validation ──
    const validate = () => {
        if (loginMethod === 'email') {
            if (!form.email.includes('@')) { toast.error('Enter a valid email address.'); return false; }
        } else {
            if (form.phone.length < 10) { toast.error('Enter a valid phone number.'); return false; }
        }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return false; }
        return true;
    };

    // ── Email/Password Sign-in ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        const t = toast.loading('Signing you in…');
        try {
            // Firebase sign-in
            // Phone tab uses the same email+password method (phone-as-email)
            const emailToUse = loginMethod === 'email'
                ? form.email
                : `${form.phone}@phone.local`;

            const userCredential = await signInWithEmailAndPassword(auth, emailToUse, form.password);
            const { uid, email, phoneNumber, displayName, photoURL } = userCredential.user;

            const finalData = {
                uid,
                email: email || null,
                phone: phoneNumber || (loginMethod === 'phone' ? form.phone : null),
                displayName: displayName || null,
                photoURL: photoURL || null,
                method: loginMethod,
            };

            console.log('✅ Signin Data:', finalData);
            toast.success(`Welcome back, ${displayName || 'User'}!`);
            navigate('/');
        } catch (err) {
            console.error(err);
            const msg =
                err.code === 'auth/user-not-found' ? 'No account found with this credential.' :
                    err.code === 'auth/wrong-password' ? 'Incorrect password. Try again.' :
                        err.code === 'auth/invalid-credential' ? 'Invalid email or password.' :
                            err.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.' :
                                'Sign-in failed. Check your credentials.';
            toast.error(msg, { id: t });
        } finally { setLoading(false); }
    };

    // ── Google Sign-in ──
    const handleGoogleSignin = async () => {
        setLoading(true);
        const t = toast.loading('Connecting to Google…');
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);

            // Attempt to save/upsert in DB (new Google users only)
            try {
                const dbResult = await saveUserToDB(userCredential, { signupMethod: 'google' });
                console.log('✅ Google Signin DB Result:', dbResult);
            } catch (dbErr) {
                // Already exists in DB — not a critical error, continue
                console.warn('DB save skipped (user may already exist):', dbErr.message);
            }

            const { displayName, email, uid, photoURL } = userCredential.user;
            const finalData = { uid, email, displayName, photoURL, method: 'google' };
            console.log('✅ Google Signin Data:', finalData);

            toast.success(`Welcome back, ${displayName || 'User'}!`, { id: t, duration: 3500 });
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error('Google sign-in failed. Try again.', { id: t });
        } finally { setLoading(false); }
    };

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1a0800', color: '#fff',
                        border: '1px solid rgba(249,115,22,0.35)',
                        borderRadius: '12px', fontSize: '13px',
                    },
                    success: { iconTheme: { primary: '#f97316', secondary: '#1a0800' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#1a0800' } },
                    loading: { iconTheme: { primary: '#f97316', secondary: '#1a0800' } },
                }}
            />

            <div className="min-h-screen w-full bg-[#0c0400] flex items-center justify-center relative overflow-hidden px-4 py-10">

                {/* Atmosphere */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-60 -left-60 w-[640px] h-[640px] rounded-full bg-orange-700/8 blur-[140px]" />
                    <div className="absolute -bottom-60 -right-60 w-[640px] h-[640px] rounded-full bg-orange-900/10 blur-[140px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-orange-600/5 blur-[100px]" />
                    <div className="absolute inset-0 opacity-[0.022]"
                        style={{ backgroundImage: 'linear-gradient(#f97316 1px,transparent 1px),linear-gradient(90deg,#f97316 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
                    <FloatingOrb className="w-3 h-3 bg-orange-500/30 top-1/4 left-16" delay={0} duration={5} />
                    <FloatingOrb className="w-2 h-2 bg-orange-400/20 top-1/3 left-1/3" delay={1.5} duration={7} />
                    <FloatingOrb className="w-4 h-4 bg-orange-600/20 bottom-1/4 right-24" delay={0.8} duration={6} />
                    <FloatingOrb className="w-2 h-2 bg-orange-300/25 bottom-1/3 right-1/3" delay={2} duration={5.5} />
                </div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-5xl bg-white/[0.025] backdrop-blur-2xl border border-orange-500/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="flex flex-col lg:flex-row min-h-[580px]">

                        {/* ════ LEFT PANEL ════ */}
                        <motion.div
                            initial={{ opacity: 0, x: -44 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="relative lg:w-5/12 flex flex-col justify-between p-8 lg:p-12
                                bg-gradient-to-br from-orange-600/15 via-orange-900/8 to-transparent
                                border-b lg:border-b-0 lg:border-r border-orange-500/10 overflow-hidden"
                        >
                            {/* Decorative rings */}
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full border border-orange-500/10 pointer-events-none" />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-orange-500/8 pointer-events-none" />

                            <div>
                                {/* Logo */}
                                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                                    className="flex items-center gap-3 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-600/30">
                                        <FaStore size={15} className="text-white" />
                                    </div>
                                    <span className="text-white font-black text-xl tracking-tight">AmaderBazarShop</span>
                                </motion.div>

                                <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                                    className="text-3xl lg:text-[2.2rem] font-black text-white leading-tight mb-3">
                                    Welcome<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                        back.
                                    </span>
                                </motion.h1>

                                <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                                    className="text-orange-200/45 text-sm leading-relaxed mb-8">
                                    Sign in to access your dashboard, manage your services, and grow your business.
                                </motion.p>

                                <Feature Icon={BsCheckCircleFill} text="Instant dashboard access" delay={3} />
                                <Feature Icon={FaShieldAlt} text="Secure session management" delay={4} />
                                <Feature Icon={BsLightningChargeFill} text="Real-time order tracking" delay={5} />
                                <Feature Icon={FaTachometerAlt} text="Advanced reseller analytics" delay={6} />
                            </div>

                            {/* Stats */}
                            <div>
                                <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={7}
                                    className="text-orange-300/30 text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                                    <HiSparkles size={11} /> Trusted by thousands
                                </motion.p>
                                <div className="flex gap-3">
                                    <StatPill value="50K+" label="Active Users" delay={8} />
                                    <StatPill value="99.9%" label="Uptime" delay={9} />
                                    <StatPill value="4.9★" label="User Rating" delay={10} />
                                </div>
                            </div>
                        </motion.div>

                        {/* ════ RIGHT PANEL ════ */}
                        <div className="lg:w-7/12 flex flex-col justify-center p-8 lg:p-12">

                            {/* Header */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-7">
                                <h2 className="text-2xl font-black text-white mb-1">Sign In</h2>
                                <p className="text-orange-300/40 text-sm">
                                    New here?{' '}
                                    <Link to="/signup" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200">
                                        Create an account →
                                    </Link>
                                </p>
                            </motion.div>

                            {/* Method tabs */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
                                className="flex gap-5 mb-6">
                                {[
                                    { key: 'email', Icon: MdEmail, label: 'Email' },
                                    { key: 'phone', Icon: MdPhone, label: 'Phone' },
                                ].map(({ key, Icon, label }) => (
                                    <button key={key} type="button" onClick={() => setLoginMethod(key)}
                                        className={`flex items-center gap-1.5 text-sm font-semibold pb-1 border-b-2 transition-all duration-300 ${loginMethod === key
                                            ? 'border-orange-500 text-orange-400'
                                            : 'border-transparent text-orange-300/30 hover:text-orange-300/55'
                                            }`}>
                                        <Icon size={15} /> {label}
                                    </button>
                                ))}
                            </motion.div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <motion.div className="grid gap-4" initial="hidden" animate="visible"
                                    variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>

                                    {/* Email / Phone swap */}
                                    <AnimatePresence mode="wait">
                                        {loginMethod === 'email' ? (
                                            <motion.div key="email" variants={slideIn} initial="hidden" animate="visible" exit="exit">
                                                <Field Icon={FiMail} label="Email Address *" name="email" type="email"
                                                    value={form.email} onChange={handleChange}
                                                    placeholder="you@example.com" required delay={0} />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="phone" variants={slideIn} initial="hidden" animate="visible" exit="exit">
                                                <Field Icon={FiPhone} label="Phone Number *" name="phone" type="tel"
                                                    value={form.phone} onChange={handleChange}
                                                    placeholder="+880 1XXXXXXXXX" required delay={0} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Password with show/hide */}
                                    <Field
                                        Icon={FiLock}
                                        label="Password *"
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Your password"
                                        required
                                        delay={1}
                                        rightEl={
                                            <button type="button" onClick={() => setShowPass(p => !p)}
                                                className="text-orange-400/60 hover:text-orange-400 transition-colors duration-200">
                                                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                            </button>
                                        }
                                    />
                                </motion.div>

                                {/* Forgot password */}
                                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
                                    className="flex justify-end">
                                    <button type="button"
                                        className="text-orange-400/60 hover:text-orange-400 text-xs font-semibold transition-colors duration-200">
                                        Forgot password?
                                    </button>
                                </motion.div>

                                {/* Remember me */}
                                <motion.label variants={fadeUp} initial="hidden" animate="visible" custom={3}
                                    className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox"
                                        className="w-4 h-4 rounded accent-orange-500 bg-white/5 border border-orange-500/30 cursor-pointer" />
                                    <span className="text-orange-300/45 text-xs group-hover:text-orange-300/65 transition-colors duration-200">
                                        Keep me signed in
                                    </span>
                                </motion.label>

                                {/* Submit */}
                                <motion.button type="submit" disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.015 }}
                                    whileTap={{ scale: loading ? 1 : 0.975 }}
                                    className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600
                                        text-white font-bold text-sm shadow-lg shadow-orange-500/25
                                        hover:shadow-orange-500/45 transition-all duration-300
                                        disabled:opacity-55 disabled:cursor-not-allowed
                                        flex items-center justify-center gap-2">
                                    {loading
                                        ? <><Spinner /> Signing In…</>
                                        : <>Sign In <FiArrowRight size={15} /></>
                                    }
                                </motion.button>

                                <Divider label="or continue with" />

                                {/* Google */}
                                <motion.button type="button" disabled={loading} onClick={handleGoogleSignin}
                                    whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.975 }}
                                    className="w-full py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08]
                                        border border-orange-500/15 hover:border-orange-500/35
                                        text-white font-semibold text-sm transition-all duration-300
                                        flex items-center justify-center gap-3 disabled:opacity-50">
                                    <FaGoogle size={15} className="text-orange-400" />
                                    Continue with Google
                                </motion.button>

                                <p className="text-center text-orange-300/30 text-xs pt-1">
                                    Don't have an account?{' '}
                                    <Link to="/signup"
                                        className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200">
                                        Sign up free
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Signin;