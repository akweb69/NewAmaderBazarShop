import React from 'react';
import { motion } from 'framer-motion';
import useCategories from '../Hooks/Categories';

const TopCategories = () => {
    const {
        categories = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useCategories();

    // Framer Motion Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 120, damping: 14 }
        },
    };

    // 1. Loading State (Skeleton Loader)
    if (isLoading) {
        return (
            <div className="w-full p-4 bg-slate-50/50 min-h-[200px] flex items-center justify-center">
                <div className="w-full max-w-7xl mx-auto bg-white shadow-sm border border-slate-100 rounded-2xl p-6">
                    <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, idx) => (
                            <div key={idx} className="w-full h-20 border border-slate-100 rounded-xl p-3 flex gap-3 items-center animate-pulse bg-slate-50">
                                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 2. Error State
    if (isError) {
        return (
            <div className="w-full p-4 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 text-center max-w-md shadow-sm">
                    <p className="font-semibold mb-2">Failed to load categories</p>
                    <p className="text-sm text-red-600 mb-4">{error?.message || "Something went wrong."}</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // 3. Main Render
    return (
        <div className="w-full p-4 bg-slate-50/30">
            <div className="max-w-7xl mx-auto bg-white border border-emerald-100/60 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.05)] rounded-2xl p-6 text-slate-800">

                {/* Header Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block"></span>
                        Top Categories
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Explore our most popular categories</p>
                </div>

                <div className="hidden md:block">
                    {categories.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                        >
                            {categories.map((cat, idx) => (
                                <motion.div
                                    key={cat?._id || idx}
                                    variants={itemVariants}
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -4px rgba(16, 185, 129, 0.1)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-20 border border-emerald-100 bg-emerald-50/10 hover:bg-white hover:border-emerald-400 rounded-xl p-3 flex gap-3 items-center cursor-pointer transition-colors duration-200 group"
                                >
                                    {/* Thumbnail Wrapper */}
                                    <div className="w-12 h-12 flex-shrink-0 bg-emerald-50 rounded-lg overflow-hidden border border-emerald-100/50 group-hover:border-emerald-200 transition-colors">
                                        {cat?.thumbnail ? (
                                            <img
                                                src={cat.thumbnail}
                                                alt={cat?.category_name || "Category thumbnail"}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-sm">
                                                {cat?.category_name?.charAt(0) || "C"}
                                            </div>
                                        )}
                                    </div>

                                    {/* Category Name */}
                                    <div className="font-medium text-sm text-slate-700 group-hover:text-emerald-700 transition-colors line-clamp-2 pr-1">
                                        {cat?.category_name}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <p className="text-center text-sm text-slate-400 font-medium">No categories found.</p>
                        </div>
                    )}
                    <div className="block md:hidden">
                        {categories.length > 0 ? (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                            >
                                {categories.slice(0, 6).map((cat, idx) => (
                                    <motion.div
                                        key={cat?._id || idx}
                                        variants={itemVariants}
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -4px rgba(16, 185, 129, 0.1)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-20 border border-emerald-100 bg-emerald-50/10 hover:bg-white hover:border-emerald-400 rounded-xl p-3 flex gap-3 items-center cursor-pointer transition-colors duration-200 group"
                                    >
                                        {/* Thumbnail Wrapper */}
                                        <div className="w-12 h-12 flex-shrink-0 bg-emerald-50 rounded-lg overflow-hidden border border-emerald-100/50 group-hover:border-emerald-200 transition-colors">
                                            {cat?.thumbnail ? (
                                                <img
                                                    src={cat.thumbnail}
                                                    alt={cat?.category_name || "Category thumbnail"}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-sm">
                                                    {cat?.category_name?.charAt(0) || "C"}
                                                </div>
                                            )}
                                        </div>

                                        {/* Category Name */}
                                        <div className="font-medium text-sm text-slate-700 group-hover:text-emerald-700 transition-colors line-clamp-2 pr-1">
                                            {cat?.category_name}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <p className="text-center text-sm text-slate-400 font-medium">No categories found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopCategories;