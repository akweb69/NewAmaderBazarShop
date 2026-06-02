import React, { useEffect, useState } from 'react';
import useCategories from '../Hooks/Categories';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Cat_Prod_page = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const location = useLocation();

    const [showPerPage, setShowPerPage] = useState(36);
    const [page_number, setPageNumber] = useState(1);
    const [showingProducts, setShowingProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortBy, setSortBy] = useState('default');

    const { categories, isLoading } = useCategories();

    const mainCategoryFormState = location.state?.cat_name || null;
    const subCategoryFormState = location.state?.subcat_name || null;

    const currentCategoryData = categories?.find(
        (cat) => cat.category_name?.trim().toLowerCase() === mainCategoryFormState?.trim().toLowerCase()
    );

    // scroll to top on category change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [mainCategoryFormState, subCategoryFormState]);

    const subcategories = currentCategoryData?.subcategories || [];
    const totalPages = Math.ceil(totalProducts / showPerPage);

    // ফ্রন্টএন্ড সোর্টিং লজিক ফাংশন
    const sortProductsLocally = (productsList, sortOption) => {
        const sorted = [...productsList];

        if (sortOption === 'price_low') {
            // sku এর সর্বনিম্ন sell_price অনুযায়ী ছোট থেকে বড় সোর্ট
            sorted.sort((a, b) => {
                const priceA = a.sku && a.sku.length > 0 ? Math.min(...a.sku.map(s => s.sell_price || 0)) : 0;
                const priceB = b.sku && b.sku.length > 0 ? Math.min(...b.sku.map(s => s.sell_price || 0)) : 0;
                return priceA - priceB;
            });
        } else if (sortOption === 'price_high') {
            // sku এর সর্বোচ্চ sell_price অনুযায়ী বড় থেকে ছোট সোর্ট
            sorted.sort((a, b) => {
                const priceA = a.sku && a.sku.length > 0 ? Math.max(...a.sku.map(s => s.sell_price || 0)) : 0;
                const priceB = b.sku && b.sku.length > 0 ? Math.max(...b.sku.map(s => s.sell_price || 0)) : 0;
                return priceB - priceA;
            });
        } else if (sortOption === 'best_selling') {
            // মেইন অবজেক্টের sell_count অথবা sku এর টোটাল sell_count এর ভিত্তিতে সোর্ট
            sorted.sort((a, b) => {
                const sellA = a.sell_count || (a.sku ? a.sku.reduce((acc, s) => acc + (s.sell_count || 0), 0) : 0);
                const sellB = b.sell_count || (b.sku ? b.sku.reduce((acc, s) => acc + (s.sell_count || 0), 0) : 0);
                return sellB - sellA;
            });
        } else if (sortOption === 'alphabetical') {
            // টাইটেল অনুযায়ী A-Z সোর্ট
            sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        }

        return sorted;
    };

    const fetchProducts = async () => {
        try {
            // এখানে url থেকে sort প্যারামিটার বাদ দেওয়া হয়েছে কারণ আমরা সোর্টিং ফ্রন্টএন্ডে করছি
            let url = `${base_url}/products?page=${page_number}&limit=${showPerPage}`;

            if (mainCategoryFormState) {
                url += `&category=${encodeURIComponent(mainCategoryFormState)}`;
            }
            if (subCategoryFormState) {
                url += `&subcategory=${encodeURIComponent(subCategoryFormState)}`;
            }

            const res = await axios.get(url);

            if (res.data) {
                const rawProducts = Array.isArray(res.data) ? res.data : res.data.products || [];

                // ডেটা পাওয়ার সাথে সাথে সোর্ট ফাংশন কল করা হচ্ছে
                const sortedProducts = sortProductsLocally(rawProducts, sortBy);

                setShowingProducts(sortedProducts);
                setTotalProducts(res.data.totalCount || res.data.total || rawProducts.length);
            }
        } catch (error) {
            console.error("Error loading products", error);
        }
    };

    // ক্যাটাগরি চেঞ্জ হলে পেজ ১ এ রিসেট করার জন্য
    useEffect(() => {
        setPageNumber(1);
    }, [mainCategoryFormState, subCategoryFormState, sortBy, showPerPage]);

    useEffect(() => {
        fetchProducts();
    }, [mainCategoryFormState, subCategoryFormState, page_number, showPerPage, sortBy]);

    const handleSubcategoryClick = (subCatName) => {
        navigate(location.pathname, {
            state: {
                cat_name: mainCategoryFormState,
                subcat_name: subCatName === subCategoryFormState ? null : subCatName
            }
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNumber(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full mx-auto px-4 py-4 md:py-8 bg-white min-h-screen flex flex-col justify-between">
            <div>
                {/* Header: Title & Sort Options */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="space-y-0.5">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium tracking-wide uppercase">
                            <span className="text-gray-500 truncate max-w-[120px] sm:max-w-none">
                                {mainCategoryFormState || "Shop"}
                            </span>
                            {subCategoryFormState && (
                                <>
                                    <span>/</span>
                                    <span className="text-gray-500 truncate max-w-[120px] sm:max-w-none">
                                        {subCategoryFormState}
                                    </span>
                                </>
                            )}
                        </div>
                        {/* Active Title */}
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
                            {subCategoryFormState || mainCategoryFormState || "All Products"}
                        </h1>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                        <label htmlFor="sort" className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Sort by:
                        </label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-sm font-medium text-gray-800 py-1 pl-1 pr-6 cursor-pointer focus:outline-none border-b border-transparent hover:border-gray-300 transition-colors"
                        >
                            <option value="default">Default</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="best_selling">Most Selling</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                    </div>
                </div>

                {/* Subcategories Horizontal Bar */}
                {mainCategoryFormState && subcategories.length > 0 && (
                    <div className="border-b border-gray-100 py-3 md:py-4">
                        <div className="flex flex-wrap gap-2 w-full">
                            {subcategories.map((subcat, idx) => {
                                const isSelected = subcat === subCategoryFormState;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSubcategoryClick(subcat)}
                                        className={`text-[10px] px-3 py-1 rounded-full transition-all duration-200 font-medium ${isSelected ? 'bg-green-700 text-white' : 'bg-green-50 text-gray-800 hover:bg-gray-100'
                                            }`}
                                    >
                                        {subcat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8 pt-6 md:pt-8">
                    {isLoading ? (
                        Array.from({ length: 12 }).map((_, idx) => (
                            <div key={idx} className="animate-pulse flex flex-col gap-2">
                                <div className="bg-gray-100 aspect-square rounded-lg w-full"></div>
                                <div className="h-3.5 bg-gray-100 rounded w-3/4 mt-1"></div>
                                <div className="h-3.5 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))
                    ) : showingProducts.length > 0 ? (
                        showingProducts.map((prod) => (
                            <ProductCard key={prod._id} product_id={prod._id} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <p className="text-sm font-medium text-gray-400">No products found in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination System */}
            {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-16 pb-4">
                    <button
                        onClick={() => handlePageChange(page_number - 1)}
                        disabled={page_number === 1}
                        className="p-2 rounded text-gray-600 hover:bg-gray-50 border border-gray-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                    >
                        <FiChevronLeft size={16} />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNum = index + 1;
                            if (totalPages > 5 && pageNum !== 1 && pageNum !== totalPages && Math.abs(page_number - pageNum) > 1) {
                                if (pageNum === 2 && page_number > 3) return <span key={pageNum} className="text-xs text-gray-300 px-1">...</span>;
                                if (pageNum === totalPages - 1 && page_number < totalPages - 2) return <span key={pageNum} className="text-xs text-gray-300 px-1">...</span>;
                                return null;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`text-xs min-w-[32px] h-8 font-medium rounded transition-all ${page_number === pageNum ? 'bg-gray-950 text-white' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(page_number + 1)}
                        disabled={page_number === totalPages}
                        className="p-2 rounded text-gray-600 hover:bg-gray-50 border border-gray-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                    >
                        <FiChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cat_Prod_page;