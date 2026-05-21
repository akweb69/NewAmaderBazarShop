import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { BsPlayCircleFill } from 'react-icons/bs';
import { FiLoader } from 'react-icons/fi';
import Loader from '../../Loader/Loader';

// ── YouTube embed URL ─────────────────────────────────────────────────────────
const getEmbedUrl = (url) => {
    if (!url) return null;
    const patterns = [
        /youtu\.be\/([^?&\s]+)/,
        /youtube\.com\/watch\?v=([^?&\s]+)/,
        /youtube\.com\/embed\/([^?&\s]+)/,
    ];
    for (const re of patterns) {
        const m = url.match(re);
        if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
    }
    return null;
};

// ── Use window width hook ─────────────────────────────────────────────────────
const useIsMobile = () => {
    const [mobile, setMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 768 : false
    );
    useEffect(() => {
        const fn = () => setMobile(window.innerWidth < 768);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);
    return mobile;
};

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spin = () => (
    <motion.span
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
        className="inline-flex"
    >
        <FiLoader size={26} className="text-orange-400" />
    </motion.span>
);

// ── Video Modal ───────────────────────────────────────────────────────────────
const VideoModal = ({ item, onClose }) => {
    const embedUrl = item ? getEmbedUrl(item.video_link) : null;

    useEffect(() => {
        if (!item) return;
        const fn = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [item, onClose]);

    return (
        <AnimatePresence>
            {item && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/88 backdrop-blur-lg"
                        onClick={onClose}
                    />

                    {/* Card */}
                    <motion.div
                        className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden border border-orange-500/20 shadow-2xl shadow-orange-500/15"
                        initial={{ scale: 0.87, y: 28, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.87, y: 28, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Header bar */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#0c0400] border-b border-orange-500/15">
                            <p className="text-white font-bold text-sm truncate pr-4">{item.title}</p>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.88 }}
                                className="flex-shrink-0 w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-400 hover:bg-orange-500/30 flex items-center justify-center transition-colors"
                            >
                                <HiX size={16} />
                            </motion.button>
                        </div>

                        {/* Embed */}
                        <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title={item.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm">
                                    Invalid video URL
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ── Slider Card ───────────────────────────────────────────────────────────────
// position: desktop → -2,-1,0,1,2  |  mobile → -1,0,1
const SliderCard = ({ item, position, isMobile, onClick }) => {
    const isCenter = position === 0;
    const absPos = Math.abs(position);

    // ── Per-position visual values ──
    // Desktop: 5 cards → positions -2,-1,0,1,2
    // Mobile:  3 cards → positions -1,0,1
    const cfgDesktop = {
        0: { scale: 1, opacity: 1, rotateY: 0, xPx: 0, zIndex: 20, maxW: 420 },
        1: { scale: 0.80, opacity: 0.80, rotateY: 6, xPx: 300, zIndex: 16, maxW: 340 },
        2: { scale: 0.62, opacity: 0.50, rotateY: 10, xPx: 490, zIndex: 12, maxW: 270 },
    };
    const cfgMobile = {
        0: { scale: 1, opacity: 1, rotateY: 0, xPx: 0, zIndex: 20, maxW: 280 },
        1: { scale: 0.72, opacity: 0.55, rotateY: 8, xPx: 195, zIndex: 14, maxW: 200 },
    };

    const cfg = isMobile
        ? (cfgMobile[absPos] ?? { scale: 0, opacity: 0, rotateY: 0, xPx: 0, zIndex: 0, maxW: 0 })
        : (cfgDesktop[absPos] ?? { scale: 0, opacity: 0, rotateY: 0, xPx: 0, zIndex: 0, maxW: 0 });

    const xFinal = position < 0 ? -cfg.xPx : cfg.xPx;

    return (
        <motion.div
            onClick={() => onClick(position)}
            animate={{
                x: xFinal,
                scale: cfg.scale,
                opacity: cfg.opacity,
                rotateY: position < 0 ? -cfg.rotateY : cfg.rotateY,
                zIndex: cfg.zIndex,
            }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                translateX: '-50%',
                width: '100%',
                maxWidth: cfg.maxW,
                aspectRatio: '16 / 10',
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                willChange: 'transform',
                transformStyle: 'preserve-3d',
                border: isCenter
                    ? '1.5px solid rgba(249,115,22,0.35)'
                    : '1px solid rgba(255,255,255,0.05)',
                boxShadow: isCenter
                    ? '0 20px 60px rgba(249,115,22,0.2), 0 4px 16px rgba(0,0,0,0.5)'
                    : '0 8px 24px rgba(0,0,0,0.4)',
            }}
        >
            {/* Thumbnail */}
            <img
                src={item.thumbnail}
                alt={item.title}
                draggable={false}
                className="w-full h-full object-cover select-none"
                onError={e => { e.target.src = 'https://placehold.co/420x262/0c0400/f97316?text=Video'; }}
            />

            {/* Dark overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: isCenter
                        ? 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)'
                        : 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.18) 100%)',
                }}
            />

            {/* Center — pulsing play icon */}
            {isCenter && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.18 }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.82, 1, 0.82] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ filter: 'drop-shadow(0 0 18px rgba(249,115,22,0.75))' }}
                    >
                        <BsPlayCircleFill size={isMobile ? 40 : 52} className="text-orange-500" />
                    </motion.div>
                </motion.div>
            )}

            {/* Side cards — faint play */}
            {!isCenter && absPos === 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <BsPlayCircleFill size={isMobile ? 22 : 28} className="text-white/25" />
                </div>
            )}

            {/* Title at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-3"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                <p
                    className="font-bold text-white leading-snug"
                    style={{
                        fontSize: isCenter ? (isMobile ? 12 : 14) : (isMobile ? 9 : 11),
                        opacity: isCenter ? 1 : 0.7,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {item.title}
                </p>
            </div>
        </motion.div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const HeroVideoSlider = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const isMobile = useIsMobile();

    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [active, setActive] = useState(0);
    const [modalItem, setModalItem] = useState(null);
    const [paused, setPaused] = useState(false);
    const touchX = useRef(null);

    // ── Fetch ──
    const fetchSliders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`${base_url}/video`);
            setSliders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError('Failed to load videos.');
        } finally {
            setLoading(false);
        }
    }, [base_url]);

    useEffect(() => { fetchSliders(); }, [fetchSliders]);

    // ── Autoplay ──
    useEffect(() => {
        if (sliders.length <= 1 || paused) return;
        const id = setInterval(() => setActive(i => (i + 1) % sliders.length), 4200);
        return () => clearInterval(id);
    }, [sliders.length, paused]);

    const prev = () => setActive(i => (i - 1 + sliders.length) % sliders.length);
    const next = () => setActive(i => (i + 1) % sliders.length);

    // ── Touch swipe ──
    const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchX.current === null) return;
        const d = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(d) > 38) d > 0 ? next() : prev();
        touchX.current = null;
    };

    // ── Card click ──
    const handleClick = (position, item) => {
        if (position === 0) {
            setModalItem(item);
        } else {
            setActive(i => {
                const shift = position > 0 ? 1 : -1;
                return (i + shift + sliders.length) % sliders.length;
            });
        }
    };

    // ── Visible positions ──
    const POSITIONS = isMobile ? [-1, 0, 1] : [-2, -1, 0, 1, 2];

    // ── States ──
    if (loading) return (
        <Loader />
    );

    if (error) return (
        <div className="w-full flex flex-col items-center justify-center py-14 gap-3 bg-white">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={fetchSliders}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors">
                Retry
            </button>
        </div>
    );

    if (!sliders.length) return (
        <div className="w-full flex items-center justify-center py-14 bg-white">
            <p className="text-white/20 text-sm">No videos available</p>
        </div>
    );

    const stageH = isMobile
        ? 'clamp(150px, 46vw, 200px)'
        : 'clamp(220px, 28vw, 320px)';

    return (
        <>
            <VideoModal item={modalItem} onClose={() => setModalItem(null)} />

            <section
                className="relative m-4  rounded-xl shadow bg-white overflow-hidden"
                style={{ paddingTop: isMobile ? 24 : 10, paddingBottom: isMobile ? 24 : 0 }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {/* Ambient glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                            width: 600,
                            height: 340,
                            background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)',
                        }}
                    />
                </div>

                {/* Subtle grid */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.016]"
                    style={{
                        backgroundImage: 'linear-gradient(#f97316 1px,transparent 1px),linear-gradient(90deg,#f97316 1px,transparent 1px)',
                        backgroundSize: '44px 44px',
                    }}
                />

                {/* ── Stage ── */}
                <div
                    className="relative mx-auto w-full"
                    style={{
                        height: stageH,
                        maxWidth: isMobile ? 480 : 1100,
                        perspective: 1400,
                    }}
                >
                    {POSITIONS.map(pos => {
                        const idx = ((active + pos) % sliders.length + sliders.length) % sliders.length;
                        const item = sliders[idx];
                        return (
                            <SliderCard
                                key={`${idx}-${pos}`}
                                item={item}
                                position={pos}
                                isMobile={isMobile}
                                onClick={(p) => handleClick(p, item)}
                            />
                        );
                    })}
                </div>


            </section>
        </>
    );
};

export default HeroVideoSlider;