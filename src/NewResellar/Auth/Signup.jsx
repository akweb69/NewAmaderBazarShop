import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// ── Firebase ──────────────────────────────────────────────────────────────────
import app from './Firebase';
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

// ── react-icons ───────────────────────────────────────────────────────────────
import { FiUser, FiMail, FiPhone, FiLock, FiKey, FiUploadCloud, FiArrowRight, FiLoader, FiCheck, FiX } from 'react-icons/fi';
import { FaGoogle, FaStore, FaUserAlt, FaShieldAlt, FaGlobe, FaTachometerAlt } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import { BsCheckCircleFill } from 'react-icons/bs';

const auth = getAuth(app);
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
};
const slideIn = {
    hidden: { opacity: 0, x: 36 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -36, transition: { duration: 0.28 } },
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ size = 16 }) => (
    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }} className="inline-flex">
        <FiLoader size={size} />
    </motion.span>
);

// ─── ImgBB Upload ─────────────────────────────────────────────────────────────
const uploadToImgBB = (file, onProgress) =>
    new Promise((resolve, reject) => {
        const fd = new FormData();
        fd.append('image', file);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText);
                res.success ? resolve(res.data.url) : reject(new Error('ImgBB error'));
            } else reject(new Error(`HTTP ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(fd);
    });

const defaultUpload = () => ({ file: null, preview: '', status: 'idle', progress: 0, url: '' });

// ─── Image Upload Card ────────────────────────────────────────────────────────
const ImageUpload = ({ label, name, onChange, preview, progress, status, onRemove }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-orange-300 uppercase tracking-widest">{label}</span>
        <label
            htmlFor={status === 'done' || status === 'uploading' ? undefined : name}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 group
                ${status === 'done' ? 'border-green-500/50 cursor-default'
                    : status === 'error' ? 'border-red-500/50 cursor-pointer bg-red-950/10 hover:bg-red-950/20'
                        : status === 'uploading' ? 'border-orange-400/50 cursor-not-allowed bg-orange-950/25'
                            : 'border-orange-500/40 cursor-pointer bg-orange-950/20 hover:bg-orange-950/40'}`}
            style={{ minHeight: 128 }}
        >
            {preview && (
                <img src={preview} alt={label}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${status === 'uploading' ? 'opacity-35' : 'opacity-100'}`} />
            )}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-4 px-3 gap-2">
                {status === 'idle' && (
                    <>
                        <FiUploadCloud size={28} className="text-orange-500/55 group-hover:text-orange-400 transition-colors duration-300" />
                        <span className="text-orange-300/55 text-[11px] text-center leading-snug">
                            Click to upload<br /><span className="text-orange-400 font-semibold">{label}</span>
                        </span>
                    </>
                )}
                {status === 'uploading' && (
                    <div className="flex flex-col items-center gap-2 w-full px-5">
                        <Spinner size={22} />
                        <span className="text-orange-300 text-[11px] font-semibold tracking-wide">Uploading…</span>
                        <div className="w-full h-1.5 rounded-full bg-orange-900/60 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                                initial={{ width: '0%' }} animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.25, ease: 'easeOut' }} />
                        </div>
                        <span className="text-orange-400 text-[10px] font-bold tabular-nums">{progress}%</span>
                    </div>
                )}
                {status === 'error' && (
                    <>
                        <FiX size={24} className="text-red-400" />
                        <span className="text-red-400 text-[11px] font-semibold text-center leading-snug">
                            Upload failed<br /><span className="text-red-300/70 font-normal">Tap to retry</span>
                        </span>
                    </>
                )}
            </div>
            {status === 'done' && (
                <span className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                    <FiCheck size={13} className="text-white" />
                </span>
            )}
            {status === 'done' && (
                <button type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
                    className="absolute top-2 left-2 z-20 w-6 h-6 rounded-full bg-black/55 hover:bg-red-600/80 flex items-center justify-center transition-colors duration-200">
                    <FiX size={11} className="text-white" />
                </button>
            )}
            <input id={name} name={name} type="file" accept="image/*"
                className="absolute inset-0 opacity-0"
                style={{ cursor: status === 'uploading' || status === 'done' ? 'not-allowed' : 'pointer' }}
                onChange={onChange}
                disabled={status === 'uploading' || status === 'done'} />
        </label>
        <AnimatePresence mode="wait">
            {status === 'done' && (
                <motion.span key="ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-green-400 text-[10px] font-semibold">
                    <FiCheck size={10} /> Uploaded successfully
                </motion.span>
            )}
            {status === 'error' && (
                <motion.span key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-red-400 text-[10px] font-semibold">
                    <FiX size={10} /> Upload failed — tap to retry
                </motion.span>
            )}
        </AnimatePresence>
    </div>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ Icon, label, name, type = 'text', value, onChange, placeholder, required, delay }) => (
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
                    rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 text-sm outline-none
                    transition-all duration-300 focus:bg-orange-950/25 focus:ring-2 focus:ring-orange-500/20" />
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

// ─── Save user to DB ──────────────────────────────────────────────────────────
const saveUserToDB = async (userCredential, extraData = {}) => {
    const { uid, email, phoneNumber, displayName, photoURL } = userCredential.user;
    const user = {
        uid,
        email: email || null,
        phone: phoneNumber || extraData.phone || null,
        displayName: displayName || extraData.username || null,
        photoURL: photoURL || null,
        accountType: extraData.accountType || 'user',
        signupMethod: extraData.signupMethod || 'email',
        ...(extraData.nidFrontUrl ? { nidFrontUrl: extraData.nidFrontUrl } : {}),
        ...(extraData.nidBackUrl ? { nidBackUrl: extraData.nidBackUrl } : {}),
        createdAt: new Date().toISOString(),
    };
    // POST to your Express API — matches { user, MyRefferCode, active, refferUsers, refferIncome }
    const { data } = await axios.post(`${BASE_URL}/users`, user);
    return data;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Signup = () => {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState('user');
    const [signupMethod, setSignupMethod] = useState('email');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: '', email: '', phone: '', password: '', confirmPassword: '',
    });
    const [nidFront, setNidFront] = useState(defaultUpload());
    const [nidBack, setNidBack] = useState(defaultUpload());

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // ── ImgBB image select + upload ──
    const handleImageSelect = async (e, setter) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () =>
            setter({ file, preview: reader.result, status: 'uploading', progress: 0, url: '' });
        reader.readAsDataURL(file);
        try {
            const url = await uploadToImgBB(file, (pct) =>
                setter(prev => ({ ...prev, progress: pct }))
            );
            setter(prev => ({ ...prev, status: 'done', progress: 100, url }));
            toast.success('Image uploaded!', { icon: '🖼️' });
        } catch {
            setter(prev => ({ ...prev, status: 'error', progress: 0 }));
            toast.error('Image upload failed. Please retry.');
        }
    };

    const resetUpload = (setter) => setter(defaultUpload());

    // ── Validation ──
    const validate = () => {
        if (!form.username.trim()) { toast.error('Username is required.'); return false; }
        if (signupMethod === 'email') {
            if (!form.email.includes('@')) { toast.error('Enter a valid email address.'); return false; }
        } else {
            if (form.phone.length < 10) { toast.error('Enter a valid phone number.'); return false; }
        }
        if (form.password.length < 6) { toast.error('Password must be at least 6 chars.'); return false; }
        if (form.password !== form.confirmPassword) { toast.error('Passwords do not match.'); return false; }
        if (accountType === 'reseller') {
            if (nidFront.status !== 'done') { toast.error('Please upload NID front image.'); return false; }
            if (nidBack.status !== 'done') { toast.error('Please upload NID back image.'); return false; }
        }
        return true;
    };

    // ── Email/Password Signup ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        const t = toast.loading('Creating your account…');
        try {
            // 1. Firebase auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                signupMethod === 'email' ? form.email : `${form.phone}@phone.local`,
                form.password
            );

            // 2. Update Firebase display name
            await updateProfile(userCredential.user, { displayName: form.username });

            // 3. Save to DB via axios
            const dbResult = await saveUserToDB(userCredential, {
                username: form.username,
                phone: signupMethod === 'phone' ? form.phone : null,
                accountType,
                signupMethod,
                nidFrontUrl: nidFront.url || null,
                nidBackUrl: nidBack.url || null,
            });

            console.log('🚀 DB Result:', dbResult);
            toast.success(`Welcome, ${form.username}! Account created.`, { id: t, duration: 4000 });
            navigate('/');
        } catch (err) {
            console.error(err);
            const msg = err.code === 'auth/email-already-in-use'
                ? 'Email already in use.'
                : err.code === 'auth/weak-password'
                    ? 'Password is too weak.'
                    : 'Signup failed. Please try again.';
            toast.error(msg, { id: t });
        } finally { setLoading(false); }
    };

    // ── Google Signup ──
    const handleGoogleSignup = async () => {
        setLoading(true);
        const t = toast.loading('Connecting to Google…');
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);

            // Save to DB (Google gives displayName, email, photoURL automatically)
            const dbResult = await saveUserToDB(userCredential, {
                accountType,
                signupMethod: 'google',
            });

            console.log('✅ Google Signup DB Result:', dbResult);
            toast.success(`Welcome, ${userCredential.user.displayName}!`, { id: t, duration: 4000 });
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error('Google sign-up failed. Try again.', { id: t });
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-orange-600/5 blur-[90px]" />
                    <div className="absolute inset-0 opacity-[0.022]"
                        style={{ backgroundImage: 'linear-gradient(#f97316 1px,transparent 1px),linear-gradient(90deg,#f97316 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
                </div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-5xl bg-white/[0.025] backdrop-blur-2xl border border-orange-500/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="flex flex-col lg:flex-row min-h-[640px]">

                        {/* ════ LEFT PANEL ════ */}
                        <motion.div
                            initial={{ opacity: 0, x: -44 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="relative lg:w-5/12 flex flex-col justify-between p-8 lg:p-12
                                bg-gradient-to-br from-orange-600/15 via-orange-900/8 to-transparent
                                border-b lg:border-b-0 lg:border-r border-orange-500/10"
                        >
                            <div>
                                {/* Logo */}
                                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                                    className="flex items-center gap-3 mb-10">
                                    <div className="w-10 h-10 hidden md:flex rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 items-center justify-center shadow-lg shadow-orange-600/30">
                                        <FaStore size={15} className="text-white" />
                                    </div>
                                    <span className="text-white font-black text-3xl md:text-2xl tracking-tight">AmaderBazarShop</span>
                                </motion.div>

                                <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                                    className="text-3xl lg:text-[2.35rem] font-black text-white leading-tight mb-4">
                                    Start your<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                        journey today.
                                    </span>
                                </motion.h1>

                                <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                                    className="text-orange-200/45 text-sm leading-relaxed mb-8">
                                    Join thousands of users and resellers on the platform built for growth, speed, and reliability.
                                </motion.p>

                                <Feature Icon={BsCheckCircleFill} text="Instant account activation" delay={3} />
                                <Feature Icon={FaShieldAlt} text="Secure & encrypted platform" delay={4} />
                                <Feature Icon={FaGlobe} text="Global access, 24/7 uptime" delay={5} />
                                <Feature Icon={FaTachometerAlt} text="Reseller dashboard & analytics" delay={6} />
                            </div>
                        </motion.div>

                        {/* ════ RIGHT PANEL ════ */}
                        <div className="lg:w-7/12 flex flex-col justify-center p-8 lg:p-12">

                            {/* Account type toggle */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                                className="flex gap-2 mb-7 p-1 bg-white/[0.04] rounded-2xl border border-orange-500/10">
                                {[
                                    { key: 'user', Icon: FaUserAlt, label: 'User' },
                                    { key: 'reseller', Icon: FaStore, label: 'Reseller' },
                                ].map(({ key, Icon, label }) => (
                                    <button key={key} type="button" onClick={() => setAccountType(key)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${accountType === key
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                            : 'text-orange-300/40 hover:text-orange-300/70'
                                            }`}>
                                        <Icon size={13} /> {label}
                                    </button>
                                ))}
                            </motion.div>

                            {/* Method tabs */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
                                className="flex gap-5 mb-6">
                                {[
                                    { key: 'email', Icon: MdEmail, label: 'Email' },
                                    { key: 'phone', Icon: MdPhone, label: 'Phone' },
                                ].map(({ key, Icon, label }) => (
                                    <button key={key} type="button" onClick={() => setSignupMethod(key)}
                                        className={`flex items-center gap-1.5 text-sm font-semibold pb-1 border-b-2 transition-all duration-300 ${signupMethod === key
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

                                    {/* Username */}
                                    <Field Icon={FiUser} label="Username *" name="username" value={form.username}
                                        onChange={handleChange} placeholder="your_username" required delay={0} />

                                    {/* Email / Phone swap */}
                                    <AnimatePresence mode="wait">
                                        {signupMethod === 'email' ? (
                                            <motion.div key="email" variants={slideIn} initial="hidden" animate="visible" exit="exit">
                                                <Field Icon={FiMail} label="Email Address *" name="email" type="email"
                                                    value={form.email} onChange={handleChange} placeholder="you@example.com" required delay={1} />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="phone" variants={slideIn} initial="hidden" animate="visible" exit="exit">
                                                <Field Icon={FiPhone} label="Phone Number *" name="phone" type="tel"
                                                    value={form.phone} onChange={handleChange} placeholder="+880 1XXXXXXXXX" required delay={1} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Password row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field Icon={FiLock} label="Password *" name="password" type="password"
                                            value={form.password} onChange={handleChange} placeholder="Min 6 characters" required delay={2} />
                                        <Field Icon={FiKey} label="Confirm Password *" name="confirmPassword" type="password"
                                            value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required delay={3} />
                                    </div>

                                    {/* Reseller NID */}
                                    <AnimatePresence>
                                        {accountType === 'reseller' && (
                                            <motion.div key="nid"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-4">
                                                    <p className="text-orange-300 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                        <HiOutlineBadgeCheck size={15} className="text-orange-400" />
                                                        NID Verification — Required for Resellers
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ImageUpload label="NID Front Side" name="nidFront"
                                                            preview={nidFront.preview} progress={nidFront.progress} status={nidFront.status}
                                                            onChange={(e) => handleImageSelect(e, setNidFront)}
                                                            onRemove={() => resetUpload(setNidFront)} />
                                                        <ImageUpload label="NID Back Side" name="nidBack"
                                                            preview={nidBack.preview} progress={nidBack.progress} status={nidBack.status}
                                                            onChange={(e) => handleImageSelect(e, setNidBack)}
                                                            onRemove={() => resetUpload(setNidBack)} />
                                                    </div>
                                                    <AnimatePresence>
                                                        {nidFront.status === 'done' && nidBack.status === 'done' && (
                                                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                                className="flex items-center gap-2 text-green-400 text-[11px] font-semibold">
                                                                <BsCheckCircleFill size={13} />
                                                                Both NID images uploaded successfully
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

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
                                        ? <><Spinner /> Creating Account…</>
                                        : <>Create {accountType === 'reseller' ? 'Reseller' : 'User'} Account <FiArrowRight size={15} /></>
                                    }
                                </motion.button>

                                <Divider label="or continue with" />

                                {/* Google */}
                                {accountType !== 'reseller' && (
                                    <motion.button type="button" disabled={loading} onClick={handleGoogleSignup}
                                        whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.975 }}
                                        className="w-full py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08]
                                        border border-orange-500/15 hover:border-orange-500/35
                                        text-white font-semibold text-sm transition-all duration-300
                                        flex items-center justify-center gap-3 disabled:opacity-50">
                                        <FaGoogle size={15} className="text-orange-400" />
                                        Continue with Google
                                    </motion.button>
                                )}

                                <p className="text-center text-orange-300/30 text-xs pt-1">
                                    Already have an account?{' '}
                                    <Link to="/signin" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200">
                                        Sign in
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

export default Signup;