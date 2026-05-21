import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCategories from '../Hooks/Categories';
import { FiChevronRight, FiGrid } from 'react-icons/fi';
import { RiFireFill } from 'react-icons/ri';

const AsideBar = () => {
    const { isLoading, categories } = useCategories();
    const [activeCategory, setActiveCategory] = useState(null);
    const [hoveredSub, setHoveredSub] = useState(null);

    const handleToggle = (id) => {
        setActiveCategory(prev => prev === id ? null : id);
    };

    return (
        <div className="relative w-full h-full bg-white overflow-hidden select-none flex flex-col ">

            {/* Ambient glow - softened for light theme */}
            <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full bg-orange-500/10 blur-[60px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-32 h-32 rounded-full bg-amber-500/8 blur-[50px]" />

            {/* Header */}
            <div className="px-5 py-5 border-b border-slate-200 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center">
                        <FiGrid size={13} className="text-orange-600" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em]">
                        Categories
                    </span>
                </div>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5
                scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">

                {isLoading ? (
                    // Skeleton
                    Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 py-3 px-3 animate-pulse">
                            <div className="w-7 h-7 rounded-lg bg-slate-200 flex-shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-2.5 bg-slate-200 rounded-full w-3/4" />
                            </div>
                            <div className="w-3 h-3 rounded bg-slate-200 flex-shrink-0" />
                        </div>
                    ))
                ) : (
                    categories?.map((category, catIndex) => {
                        const isOpen = activeCategory === category?._id;
                        const hasSubcategories = category?.subcategories?.length > 0;

                        return (
                            <div key={category?._id} className="relative">

                                {/* Category Button */}
                                <motion.button
                                    onClick={() => handleToggle(category?._id)}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl
                                        transition-all duration-200 group relative overflow-hidden
                                        ${isOpen
                                            ? 'bg-orange-50 border border-orange-200 text-orange-700 shadow-sm'
                                            : 'border border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    {/* Active background glow */}
                                    {isOpen && (
                                        <motion.span
                                            layoutId={`cat-glow-${category._id}`}
                                            className="absolute inset-0 bg-gradient-to-r from-orange-100 to-transparent rounded-xl pointer-events-none"
                                        />
                                    )}

                                    {/* Left Side */}
                                    <div className="flex items-center gap-2.5 relative z-10 min-w-0">
                                        <div className={`w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 border transition-all duration-200
                                            ${isOpen
                                                ? 'border-orange-300 ring-1 ring-orange-200'
                                                : 'border-slate-200 group-hover:border-orange-200'
                                            }`}>
                                            <img
                                                className="w-full h-full object-cover"
                                                src={category?.thumbnail}
                                                alt=""
                                                loading="lazy"
                                            />
                                        </div>

                                        <span className="text-[12.5px] font-semibold tracking-wide truncate">
                                            {category?.category_name}
                                        </span>

                                        {/* Hot badge */}
                                        {catIndex < 2 && (
                                            <motion.span
                                                animate={{ scale: [1, 1.15, 1] }}
                                                transition={{ duration: 1.6, repeat: Infinity }}
                                                className="text-orange-500"
                                            >
                                                <RiFireFill size={11} />
                                            </motion.span>
                                        )}
                                    </div>

                                    {/* Right Side */}
                                    <div className="flex items-center gap-1.5 relative z-10 flex-shrink-0">
                                        {hasSubcategories && (
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all duration-200
                                                ${isOpen
                                                    ? 'bg-orange-100 text-orange-600'
                                                    : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500'
                                                }`}>
                                                {category.subcategories.length}
                                            </span>
                                        )}
                                        <motion.span
                                            animate={{ rotate: isOpen ? 90 : 0 }}
                                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                            className={`transition-colors ${isOpen ? 'text-orange-500' : 'text-slate-300 group-hover:text-slate-400'}`}
                                        >
                                            <FiChevronRight size={13} />
                                        </motion.span>
                                    </div>
                                </motion.button>

                                {/* Subcategories */}
                                <AnimatePresence initial={false}>
                                    {isOpen && hasSubcategories && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="relative pl-[2.6rem] pr-2 py-1.5 flex flex-col gap-0.5 mb-1">
                                                {/* Vertical line */}
                                                <span className="absolute left-[1.55rem] top-0 bottom-2 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent" />

                                                {category.subcategories.map((sub, idx) => (
                                                    <motion.button
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -8 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.04 }}
                                                        onHoverStart={() => setHoveredSub(`${category._id}-${idx}`)}
                                                        onHoverEnd={() => setHoveredSub(null)}
                                                        className="relative text-left text-[12px] font-medium py-1.5 px-2.5 rounded-lg
                                                            text-slate-600 hover:text-orange-700 hover:bg-orange-50
                                                            transition-all duration-150 group/sub"
                                                    >
                                                        {/* Connector dot */}
                                                        <span className="absolute -left-[17px] top-1/2 -translate-y-1/2">
                                                            <motion.span
                                                                animate={{
                                                                    scale: hoveredSub === `${category._id}-${idx}` ? 1 : 0.65,
                                                                    backgroundColor: hoveredSub === `${category._id}-${idx}` ? '#f97316' : '#94a3b8',
                                                                }}
                                                                className="w-[5px] h-[5px] rounded-full block"
                                                            />
                                                        </span>

                                                        <span className="relative">
                                                            {sub}
                                                            <span className="absolute bottom-0 left-0 h-px bg-orange-400 w-0 group-hover/sub:w-full transition-all duration-200" />
                                                        </span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Bottom fade - light version */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white to-transparent" />
        </div>
    );
};

export default AsideBar;