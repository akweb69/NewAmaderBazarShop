import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // যদি কোনো কারণে প্যারেন্ট থেকে product ডাটা না আসে, তাহলে একটি স্কেলিটন বা নাল রিটার্ন করবে
    if (!product) {
        return (
            <div className="animate-pulse flex flex-col gap-2 w-full">
                <div className="bg-gray-200 aspect-square rounded-lg w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    // সরাসরি props-এর product অবজেক্ট থেকে ডাটা নেওয়া হচ্ছে
    const sellPrice = product?.sku?.[0]?.sell_price;
    const originalPrice = product?.sku?.[0]?.original_price;

    // ডিসকাউন্ট পার্সেন্টেজ হিসাব করার জন্য
    const discount = originalPrice && sellPrice < originalPrice
        ? Math.round(((originalPrice - sellPrice) / originalPrice) * 100)
        : 0;

    return (
        <div className="bg-transparent text-gray-900 w-full group transition-all duration-300">
            <div className="flex flex-col gap-2">
                {/* Image Area */}
                <div className="relative overflow-hidden bg-gray-50 aspect-square rounded-lg">
                    <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        src={product?.main_imgs?.[0] || "https://placehold.co/300"}
                        alt={product?.title}
                    />
                    {/* Minimal Discount Badge */}
                    {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-1.5 px-0.5">
                    {/* Title */}
                    <h2 className="text-sm font-normal text-gray-800 line-clamp-2 min-h-[40px] leading-tight group-hover:text-green-500 transition-colors">
                        {product?.title}
                    </h2>

                    {/* Price Show */}
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-base font-semibold text-gray-950">
                            ৳{sellPrice}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through font-normal">
                                ৳{originalPrice}
                            </span>
                        )}
                    </div>

                    {/* Clean Minimal CTA Button */}
                    {/* এখানে product_id এর বদলে product._id বা product.id ব্যবহার করা হয়েছে */}
                    <Link
                        to={`/product/${product?._id || product?.id}`}
                        className="w-full text-center mt-2 py-2 bg-gray-950 hover:bg-green-500 text-white text-xs font-medium rounded transition-colors duration-300 tracking-wide"
                    >
                        Buy Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;