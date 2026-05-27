import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Loader from '../../Loader/Loader';

const AUTOPLAY_DELAY = 4000;

const Banner = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    const [paused, setPaused] = useState(false);
    const timerRef = useRef(null);

    // ── Fetch ──
    const fetchBanners = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`${base_url}/banners`);
            const active = data.filter(b => b.status === 'active');
            setBanners(active);
            setCurrent(0);
        } catch (err) {
            console.error('Failed to fetch banners:', err);
            setError('Failed to load banners.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    // ── Navigate ──
    const goTo = useCallback((index, dir) => {
        setDirection(dir);
        setCurrent(index);
    }, []);

    const prev = useCallback(() => {
        if (!banners.length) return;
        const idx = (current - 1 + banners.length) % banners.length;
        goTo(idx, -1);
    }, [current, banners.length, goTo]);

    const next = useCallback(() => {
        if (!banners.length) return;
        const idx = (current + 1) % banners.length;
        goTo(idx, 1);
    }, [current, banners.length, goTo]);

    // ── Autoplay ──
    useEffect(() => {
        if (banners.length <= 1 || paused) return;
        timerRef.current = setInterval(() => {
            setDirection(1);
            setCurrent(c => (c + 1) % banners.length);
        }, AUTOPLAY_DELAY);
        return () => clearInterval(timerRef.current);
    }, [banners.length, paused]);

    // ── Swipe support ──
    const touchStart = useRef(null);
    const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStart.current === null) return;
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
        touchStart.current = null;
    };

    // ── Slide variants ──
    const variants = {
        enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0.6 }),
        center: { x: 0, opacity: 1 },
        exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0.6 }),
    };

    // ── States ──
    if (loading) return (
        <Loader />
    );

    if (error) return (
        <div className="w-full h-40 flex flex-col items-center justify-center gap-3 bg-[#0c0400]">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={fetchBanners}
                className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors">
                Retry
            </button>
        </div>
    );

    if (!banners.length) return (
        <div className="w-full h-40 flex items-center justify-center bg-[#0c0400]">
            <p className="text-white/20 text-sm">No banners available</p>
        </div>
    );

    return (
        <div
            className="relative w-full  overflow-hidden bg-[#0c0400]"
            style={{ maxHeight: 400 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* ── Slides ── */}
            <div className="relative w-full" style={{ height: 'min(400px, 56vw)', minHeight: 180 }}>
                <AnimatePresence custom={direction} initial={false} mode="sync">
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                    >
                        <img
                            src={banners[current]?.image}
                            alt={`Banner ${current + 1}`}
                            className="w-full h-full object-fill"
                            draggable={false}
                            onError={e => { e.target.src = 'https://placehold.co/1200x400/0c0400/f97316?text=Banner'; }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Prev / Next arrows (only if > 1 banner) ── */}
            {banners.length > 1 && (
                <>
                    {/* Prev */}
                    <motion.button
                        onClick={prev}
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20
                            w-9 h-9 rounded-full
                            bg-black/35 hover:bg-green-500/80
                            border border-white/10 hover:border-green-400/50
                            text-white backdrop-blur-sm
                            flex items-center justify-center
                            transition-colors duration-200 shadow-lg"
                        aria-label="Previous"
                    >
                        <HiChevronLeft size={20} />
                    </motion.button>

                    {/* Next */}
                    <motion.button
                        onClick={next}
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20
                            w-9 h-9 rounded-full
                            bg-black/35 hover:bg-green-500/80
                            border border-white/10 hover:border-green-400/50
                            text-white backdrop-blur-sm
                            flex items-center justify-center
                            transition-colors duration-200 shadow-lg"
                        aria-label="Next"
                    >
                        <HiChevronRight size={20} />
                    </motion.button>
                </>
            )}

            {/* ── Dot indicators ── */}
            {banners.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                    {banners.map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => goTo(i, i > current ? 1 : -1)}
                            animate={{
                                width: i === current ? 22 : 6,
                                opacity: i === current ? 1 : 0.4,
                            }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-[6px] rounded-full transition-colors duration-200
                                ${i === current ? 'bg-green-500' : 'bg-white hover:bg-green-300'}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default Banner;