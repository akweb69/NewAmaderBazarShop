import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';

const Search = () => {
    const location = useLocation();
    const stateValue = location.state?.searchText || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination & Sorting States
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState(''); // ডিফল্ট বা ফাকা মানে 'Relevance/Best Match'
    const limit = 30;

    // ডেটা ফেচিং ফাংশন
    const fetchProducts = useCallback(async (searchText, currentPage, currentSort) => {
        if (!searchText) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:5000/search?q=${encodeURIComponent(searchText)}&page=${currentPage}&limit=${limit}&sortBy=${currentSort}`
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
            setPage(1);
            setSortBy(''); // নতুন সার্চে সর্ট অপশন ডিফল্ট করে দেওয়া হলো
            fetchProducts(stateValue, 1, '');
        } else {
            setProducts([]);
        }
    }, [stateValue, fetchProducts]);

    // যখন ইউজার Next/Previous পেজ অথবা Sorting অপশন চেঞ্জ করবে
    useEffect(() => {
        if (stateValue && (page > 1 || sortBy !== '')) {
            fetchProducts(stateValue, page, sortBy);
        } else if (stateValue && page === 1 && sortBy === '') {
            fetchProducts(stateValue, 1, '');
        }
    }, [page, sortBy, stateValue, fetchProducts]);

    // সর্ট হ্যান্ডেলার ফাংশন
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setPage(1); // সর্ট চেঞ্জ হলে সব সময় ১ম পেজ থেকে ডাটা আসবে
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50 text-gray-800">

            {/* সার্চ হেডার এবং সর্টিং ড্রপডাউন */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-green-200 mb-8 w-full">
                {/* Left Side: Search Term & Page Count */}
                <div className="flex flex-row sm:flex-col justify-between items-center sm:items-start w-full sm:w-auto">
                    <h1 className="text-sm md:text-base font-semibold text-gray-800 truncate max-w-[200px] xs:max-w-[300px] md:max-w-none">
                        Search Results for: <span className="text-green-600">"{stateValue}"</span>
                    </h1>
                    {!loading && products.length > 0 && (
                        <p className="text-xs md:text-sm text-gray-500 bg-gray-100 sm:bg-transparent px-2 py-0.5 sm:px-0 sm:py-0 rounded-md sm:mt-1 font-medium">
                            Page {page}
                        </p>
                    )}
                </div>

                {/* Right Side: Sorting Dropdown UI */}
                {products.length > 0 && (
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t border-gray-100 sm:border-t-0">
                        <label htmlFor="sort" className="text-xs md:text-sm font-medium text-gray-600 whitespace-nowrap">
                            Sort By:
                        </label>
                        <div className="relative w-full sm:w-auto min-w-[160px]">
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={handleSortChange}
                                className="w-full bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-xl text-xs md:text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer transition-all appearance-none"
                            >
                                <option value="">Best Match (Relevance)</option>
                                <option value="priceLow">Price: Low to High</option>
                                <option value="priceHigh">Price: High to Low</option>
                                <option value="az">Alphabetical: A-Z</option>
                                <option value="za">Alphabetical: Z-A</option>
                            </select>
                            {/* Custom SVG arrow to keep select clean across different devices */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
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
                        onClick={() => fetchProducts(stateValue, page, sortBy)}
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