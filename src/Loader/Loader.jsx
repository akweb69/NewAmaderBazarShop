import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#0c0400] flex flex-col items-center justify-center gap-10 overflow-hidden">

            {/* ── Ambient glow ── */}
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* ── Logo / Brand mark ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-3"
            >
                {/* Icon mark */}
                <div className="relative w-14 h-14">
                    {/* Outer spinning ring */}
                    <motion.svg
                        viewBox="0 0 56 56"
                        className="absolute inset-0 w-full h-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                        <circle
                            cx="28" cy="28" r="25"
                            fill="none"
                            stroke="url(#ringGrad)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeDasharray="40 120"
                        />
                        <defs>
                            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                    </motion.svg>

                    {/* Inner counter-spinning ring */}
                    <motion.svg
                        viewBox="0 0 56 56"
                        className="absolute inset-0 w-full h-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    >
                        <circle
                            cx="28" cy="28" r="18"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="1"
                            strokeOpacity="0.2"
                            strokeDasharray="10 50"
                            strokeLinecap="round"
                        />
                    </motion.svg>

                    {/* Center dot */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_16px_4px_rgba(249,115,22,0.5)]" />
                    </motion.div>
                </div>

                {/* Brand name */}
                <motion.p
                    className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-400/60"
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    AmaderBazarShop
                </motion.p>
            </motion.div>

            {/* ── Progress bar ── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col items-center gap-3 w-full px-8 max-w-[220px]"
            >
                {/* Track */}
                <div className="w-full h-[2px] rounded-full bg-orange-500/10 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500/60 via-orange-400 to-orange-500/60"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            repeatDelay: 0.15,
                        }}
                        style={{ width: '60%' }}
                    />
                </div>

                {/* Status text */}
                <motion.p
                    className="text-[10px] text-orange-300/30 font-medium tracking-widest uppercase"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                    Loading…
                </motion.p>
            </motion.div>

            {/* ── Bottom grid texture ── */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.018]"
                style={{
                    backgroundImage: 'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)',
                    backgroundSize: '44px 44px',
                }}
            />
        </div>
    );
};

export default Loader;