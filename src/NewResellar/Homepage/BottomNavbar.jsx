import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiHome,
    FiGrid,
    FiHeart,
    FiShoppingBag,
    FiUser,
    FiMoreHorizontal
} from 'react-icons/fi';

const BottomNavbar = () => {
    const location = useLocation();

    // navItems array with the new 'goto_link' field
    const navItems = [
        { id: 'Home', label: 'Home', icon: FiHome, goto_link: '/' },
        { id: 'Category', label: 'Category', icon: FiGrid, goto_link: '/category_form_bottom_nav' },
        { id: 'Wishlist', label: 'Wishlist', icon: FiHeart, goto_link: '/wishlist' },
        { id: 'Cart', label: 'Cart', icon: FiShoppingBag, badge: 3, goto_link: '/cart' },
        { id: 'Account', label: 'Account', icon: FiUser, goto_link: '/account' },
        { id: 'More', label: 'More', icon: FiMoreHorizontal, goto_link: '/more' },
    ];

    // URL এর সাথে ম্যাচ করে activeTab স্টেট সেট করার জন্য (যাতে পেজ রিফ্রেশ করলেও একটিভ ট্যাব ঠিক থাকে)
    const [activeTab, setActiveTab] = useState('Home');

    useEffect(() => {
        const currentItem = navItems.find(item => item.goto_link === location.pathname);
        if (currentItem) {
            setActiveTab(currentItem.id);
        }
    }, [location.pathname]);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-transparent pointer-events-none">
            {/* Navbar Container */}
            <nav className="w-full bg-white/90 backdrop-blur-lg shadow-[0_-10px_30px_rgba(0,0,0,0.08)] rounded-t-2xl flex items-center justify-around px-2 py-3 border border-gray-100 pointer-events-auto ready-to-animate">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <Link
                            key={item.id}
                            to={item.goto_link}
                            onClick={() => setActiveTab(item.id)}
                            className="relative flex flex-col items-center justify-center flex-1 py-1 group focus:outline-none cursor-pointer"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            {/* Active Indicator Background Pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="activePill"
                                    className="absolute inset-0 mx-auto w-10 h-10 bg-green-500/10 rounded-xl -z-10"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}

                            {/* Icon Container with Spring Motion */}
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.15 : 1,
                                    y: isActive ? -2 : 0,
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className={`relative p-1 rounded-lg ${isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                            >
                                <Icon className="w-5 h-5 stroke-[2.2]" />

                                {/* Optional Badge (e.g., Cart count) */}
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1.5 bg-green-500 text-white text-[10px] font-bold font-sans rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                                        {item.badge}
                                    </span>
                                )}
                            </motion.div>

                            {/* Label */}
                            <span
                                className={`text-[10px] font-medium mt-1 font-sans tracking-wide transition-colors duration-200 ${isActive ? 'text-green-600 font-semibold' : 'text-gray-400'
                                    }`}
                            >
                                {item.label}
                            </span>

                            {/* Bottom Micro-Dot Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeDot"
                                    className="absolute bottom-[-4px] w-1 h-1 bg-green-500 rounded-full"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default BottomNavbar;