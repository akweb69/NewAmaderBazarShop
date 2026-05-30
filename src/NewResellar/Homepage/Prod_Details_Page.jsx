import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTruck, FiShoppingBag, FiMinus, FiPlus } from 'react-icons/fi';
import ProductCard from './ProductCard'; // আপনার তৈরি করা প্রোডাক্ট কার্ড

const Prod_Details_Page = () => {
    const params = useParams();
    const productId = params.id;
    const base_url = import.meta.env.VITE_BASE_URL;

    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // UI ইন্টারেকশন স্টেট
    const [mainImage, setMainImage] = useState('');
    const [selectedSku, setSelectedSku] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const loadProductDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/product/${productId}`);
            if (res.data) {
                const data = res.data;
                setProductDetails(data);

                // ডিফল্টভাবে প্রথম ভেরিয়েন্ট/SKU সিলেক্ট করা
                if (data.sku && data.sku.length > 0) {
                    setSelectedSku(data.sku[0]);
                    // যদি ভেরিয়েন্টের নিজস্ব ইমেজ থাকে তবে সেটি দেখাবে, নয়তো মেইন ইমেজের প্রথমটি
                    setMainImage(data.sku[0].img_url || data.main_imgs[0]);
                } else {
                    setMainImage(data.main_imgs[0]);
                }

                // রিলেটেড প্রোডাক্ট লোড করার জন্য কল (ক্যাটাগরি ধরে)
                if (data.main_category) {
                    loadRelatedProducts(data.main_category);
                }
            }
        } catch (error) {
            console.error("Error loading product details", error);
        } finally {
            setLoading(false);
        }
    };

    const loadRelatedProducts = async (category) => {
        try {
            // আপনার API এন্ডপয়েন্ট অনুযায়ী মানিয়ে নেবেন
            const res = await axios.get(`${base_url}/products?category=${encodeURIComponent(category)}&limit=6`);
            // বর্তমান প্রোডাক্ট বাদ দিয়ে ফিল্টার করা
            const filtered = (Array.isArray(res.data) ? res.data : res.data.products || [])
                .filter(p => p._id !== productId);
            setRelatedProducts(filtered);
        } catch (error) {
            console.error("Error loading related products", error);
        }
    };

    useEffect(() => {
        if (productId) {
            loadProductDetails();
            setQuantity(1); // প্রোডাক্ট চেঞ্জ হলে কোয়ান্টিটি রিসেট
        }
    }, [productId]);

    // ভেরিয়েন্ট সিলেক্ট হ্যান্ডলার
    const handleVariantClick = (skuItem) => {
        setSelectedSku(skuItem);
        setQuantity(1); // ভেরিয়েন্ট চেঞ্জ হলে কোয়ান্টিটি ১ এ রিসেট
        if (skuItem.img_url) {
            setMainImage(skuItem.img_url); // ভেরিয়েন্টের ইমেজ মেইন ইমেজে সেট হবে
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center items-center">
                <p className="text-sm font-medium text-gray-400 animate-pulse">Loading product setup...</p>
            </div>
        );
    }

    if (!productDetails) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-sm font-medium text-gray-400">Product not found.</p>
            </div>
        );
    }

    // কারেন্ট প্রাইস ক্যালকুলেশন
    const sellPrice = selectedSku ? selectedSku.sell_price : productDetails.sku[0]?.sell_price;
    const originalPrice = selectedSku ? selectedSku.original_price : productDetails.sku[0]?.original_price;
    const currentStock = selectedSku ? selectedSku.stock : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 bg-white text-gray-900 min-h-screen">

            {/* Main Product Layout Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">

                {/* Left Side: Images Section (Takes 5 cols on desktop) */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                    {/* Primary Large Image View */}
                    <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
                        <img
                            src={mainImage}
                            alt={productDetails.title}
                            className="w-full h-full object-cover transition-all duration-300"
                        />
                    </div>

                    {/* Horizontal Thumbnails Row */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        <style>{` .no-scrollbar::-webkit-scrollbar { display: none; } `}</style>
                        {productDetails.main_imgs?.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 aspect-square rounded bg-gray-50 overflow-hidden flex-shrink-0 transition-all ${mainImage === img ? 'ring-1 ring-gray-950 opacity-100' : 'opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: Product Meta Details (Takes 7 cols on desktop) */}
                <div className="lg:col-span-7 flex flex-col gap-5 lg:pt-2">

                    {/* Brand / Shop Information Row */}
                    <div className="flex items-center gap-2">
                        {productDetails.shop_info?.shop_logo && (
                            <img
                                src={productDetails.shop_info.shop_logo}
                                alt={productDetails.shop_info.shop_name}
                                className="w-5 h-5 rounded-full object-cover"
                            />
                        )}
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            {productDetails.shop_info?.shop_name || "Premium Vendor"}
                        </span>
                        <span className="text-gray-200 text-xs">•</span>
                        <span className="text-xs text-gray-400">{productDetails.main_category}</span>
                    </div>

                    {/* Main Title Heading */}
                    <h1 className="text-xl md:text-2xl font-medium text-gray-900 leading-snug tracking-tight">
                        {productDetails.title}
                    </h1>

                    {/* Price Status Area */}
                    <div className="flex items-baseline gap-3 py-1 border-b border-gray-50 pb-4">
                        <span className="text-2xl font-semibold text-gray-950">৳{sellPrice}</span>
                        {originalPrice > sellPrice && (
                            <span className="text-sm text-gray-400 line-through">৳{originalPrice}</span>
                        )}
                        {currentStock <= 5 && currentStock > 0 && (
                            <span className="ml-auto text-xs font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                                Only {currentStock} left in stock
                            </span>
                        )}
                        {currentStock === 0 && (
                            <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Sku Variants Controller (Dynamic Logic) */}
                    {productDetails.sku && productDetails.sku.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Select Variant: <span className="text-gray-900 normal-case font-semibold">{selectedSku?.name}</span>
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {productDetails.sku.map((skuItem, index) => {
                                    const isCurrent = selectedSku?.name === skuItem.name;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleVariantClick(skuItem)}
                                            className={`text-xs px-4 py-2 rounded font-medium transition-all ${isCurrent
                                                ? 'bg-gray-950 text-white'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {skuItem.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector Counter */}
                    <div className="flex flex-col gap-2 pt-2">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity:</span>
                        <div className="flex items-center border border-gray-100 w-fit rounded bg-gray-50">
                            <button
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                disabled={currentStock === 0}
                                className="p-2 text-gray-600 hover:text-black disabled:opacity-30"
                            >
                                <FiMinus size={14} />
                            </button>
                            <span className="px-4 text-sm font-medium w-10 text-center select-none">{quantity}</span>
                            <button
                                onClick={() => setQuantity(prev => Math.min(currentStock, prev + 1))}
                                disabled={currentStock === 0 || quantity >= currentStock}
                                className="p-2 text-gray-600 hover:text-black disabled:opacity-30"
                            >
                                <FiPlus size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Action Call To Actions Buttons Row */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
                        {/* Primary Add to Cart Button */}
                        <button
                            disabled={currentStock === 0}
                            className="flex-1 bg-gray-950 hover:bg-green-600 text-white py-3.5 px-6 rounded text-xs uppercase font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            <FiShoppingCart size={16} />
                            Add To Cart
                        </button>

                        {/* Wishlist Button Selector */}
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`px-5 py-3.5 rounded border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${isWishlisted
                                ? 'border-rose-500 bg-rose-50 text-rose-600'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                }`}
                        >
                            <FiHeart size={16} className={isWishlisted ? 'fill-current' : ''} />
                            <span className="sm:hidden lg:inline-block">Wishlist</span>
                        </button>
                    </div>

                    {/* Delivery & Assurance Info Block */}
                    {productDetails.delivery_info && (
                        <div className="flex items-start gap-2.5 bg-gray-50/60 p-3 rounded mt-2 border border-gray-50">
                            <FiTruck className="text-gray-400 mt-0.5" size={16} />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold text-gray-800">Delivery Information</span>
                                <span className="text-xs text-gray-500">{productDetails.delivery_info}</span>
                            </div>
                        </div>
                    )}

                    {/* Product Specifications / Properties Meta Panel */}
                    {productDetails.product_props && productDetails.product_props.length > 0 && (
                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-2">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Specifications</h3>
                            <div className="flex flex-col border border-gray-100 rounded overflow-hidden">
                                {productDetails.product_props.map((prop, index) => (
                                    <div
                                        key={index}
                                        className={`flex text-xs py-3 px-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                    >
                                        <span className="w-1/3 font-medium text-gray-500">{prop.name}</span>
                                        <span className="w-2/3 font-medium text-gray-800">{prop.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Related Products Showcase Area Grid */}
            {relatedProducts.length > 0 && (
                <div className="pt-16 md:pt-24 border-t border-gray-100 mt-16">
                    <h2 className="text-lg font-medium text-gray-900 tracking-tight mb-6">
                        You May Also Like
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                        {relatedProducts.map((prod) => (
                            <ProductCard key={prod._id} product_id={prod._id} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Prod_Details_Page;