import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const ProductSection = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const limit = 100;
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const productFetch = async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);

            const response = await axios.get(
                `${baseUrl}/product?page=${pageNumber}&limit=${limit}`
            );

            const products = response.data || [];

            console.log(
                `Products Page ${pageNumber} Response --->`,
                products
            );

            setAllProducts(prev => [...prev, ...products]);

            // If returned products are less than limit,
            // assume there are no more products.
            if (products.length < limit) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        productFetch();
    }, [pageNumber]);

    return (
        <div className="mx-4 mb-4 text-gray-950">
            <div className="p-4">
                <h2 className="mb-4 text-lg font-semibold">
                    Latest Products
                </h2>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                    {allProducts?.map((prod) => (
                        <div key={prod._id}>
                            <ProductCard product={prod} />
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <div className="flex justify-end">
                        <button
                            onClick={() => setPageNumber(prev => prev + 1)}
                            disabled={loading}
                            className="mt-6 rounded bg-gray-950 px-4 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSection;