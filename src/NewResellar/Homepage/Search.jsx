import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';

const Search = () => {
    const location = useLocation();
    const stateValue = location.state?.searchText || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination States
    const [page, setPage] = useState(1);
    const limit = 30;

    // ডেটা ফেচিং ফাংশন (useCallback দিয়ে র‍্যাপ করা হয়েছে পারফরম্যান্সের জন্য)
    const fetchProducts = useCallback(async (searchText, currentPage) => {
        if (!searchText) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:5000/search?q=${encodeURIComponent(searchText)}&page=${currentPage}&limit=${limit}`
            );

            if (!response.ok) {
                throw new Error("Product fetch failed!");
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    }, [limit]);

    // যখনই নতুন কোনো কিওয়ার্ড দিয়ে সার্চ করা হবে
    useEffect(() => {
        if (stateValue) {
            setPage(1); // নতুন সার্চে পেজ সব সময় ১ হবে
            fetchProducts(stateValue, 1);
        } else {
            setProducts([]);
        }
    }, [stateValue, fetchProducts]);

    // যখন ইউজার Next বা Previous পেজে ক্লিক করবে
    useEffect(() => {
        if (stateValue && page > 1) {
            fetchProducts(stateValue, page);
        } else if (stateValue && page === 1) {
            fetchProducts(stateValue, 1);
        }
    }, [page, stateValue, fetchProducts]);

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50 text-gray-800">
            {/* সার্চ হেডার */}
            <div className="mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    Search Results for: <span className="text-green-600">"{stateValue}"</span>
                </h1>
                {!loading && products.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">Showing page {page}</p>
                )}
            </div>

            {/* ── 💻 1. LOADING STATE ── */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm font-medium animate-pulse">Searching products, please wait...</p>
                </div>
            )}

            {/* ── ❌ 2. ERROR STATE ── */}
            {!loading && error && (
                <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100 my-4">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <button
                        onClick={() => fetchProducts(stateValue, page)}
                        className="mt-4 px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium shadow"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* ── 🚫 3. NOT FOUND STATE ── */}
            {!loading && !error && products.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-lg font-medium">No products found matching "{stateValue}"</p>
                    <p className="text-gray-400 text-sm mt-1">Try checking for typos or use different keywords.</p>
                </div>
            )}

            {/* ── 📦 4. PRODUCTS GRID ── */}
            {!loading && !error && products.length > 0 && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-5">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {/* ── 🔢 5. PAGINATION CONTROLS ── */}
                    <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-gray-200/60">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-200
                                ${page === 1
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-green-600'
                                }`}
                        >
                            Previous
                        </button>

                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-600 font-bold border border-green-200 text-sm">
                            {page}
                        </div>

                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={products.length < limit}
                            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-200
                                ${products.length < limit
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-green-600'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Search;