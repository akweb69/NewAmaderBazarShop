import React from 'react';
import useCategories from '../Hooks/Categories';
import { useNavigate } from 'react-router-dom';

const BottomCategory = () => {
    const { categories, isLoading } = useCategories();
    const navigate = useNavigate();

    // প্রফেশনাল স্কেলেটন লোডিং অ্যানিমেশন (Shimmer Effect)
    if (isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 shadow-sm">
                            <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // navigate function to go to category products page with category id as state---->
    const handleNvagateToCategory = (cat) => {
        navigate(`/category/products`, { state: { cat_name: cat } });
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
            {/* রেসপনসিভ গ্রিড লেআউট */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                {categories?.map((cat) => {
                    const hasThumbnail = cat?.thumbnail && cat?.thumbnail.trim() !== "";
                    // নামের প্রথম অক্ষর (Uppercase)
                    const firstLetter = cat?.category_name ? cat.category_name.charAt(0).toUpperCase() : "?";

                    return (
                        <div
                            onClick={() => handleNvagateToCategory(cat?.category_name)}
                            key={cat?._id || cat?.id || cat?.category_name}
                            className="group relative bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center transition-all duration-300 ease-out hover:border-green-500/30 hover:shadow-[0_10px_25px_-5px_rgba(34,197,94,0.08)] hover:-translate-y-1 cursor-pointer"
                        >
                            {/* ক্যাটাগরি ইমেজ বা প্রথম অক্ষরের কন্টেইনার */}
                            <div className="h-14 w-14 md:h-16 md:w-16 rounded-full overflow-hidden flex items-center justify-center border border-gray-50 group-hover:border-green-100 transition-all duration-300">
                                {hasThumbnail ? (
                                    // থাম্বনেইল থাকলে ইমেজ দেখাবে
                                    <img
                                        src={cat?.thumbnail}
                                        className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                                        alt={cat?.category_name || "Category"}
                                        loading="lazy"
                                    />
                                ) : (
                                    // থাম্বনেইল না থাকলে প্রথম অক্ষর দেখাবে (মডার্ন মিনিমালিস্টিক ডিজাইন)
                                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100/60 text-green-600 font-semibold text-lg md:text-xl flex items-center justify-center select-none uppercase group-hover:from-green-500 group-hover:to-green-600 group-hover:text-white transition-all duration-300">
                                        {firstLetter}
                                    </div>
                                )}
                            </div>

                            {/* ক্যাটাগরি নাম */}
                            <h3 className="mt-3 text-xs md:text-sm font-medium text-gray-700 group-hover:text-green-600 text-center tracking-wide line-clamp-1 transition-colors duration-300">
                                {cat?.category_name}
                            </h3>

                            {/* মডার্ন ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
                            <div className="absolute inset-0 bg-gradient-to-b from-green-500/0 to-green-500/[0.015] opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomCategory;