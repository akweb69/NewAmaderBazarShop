import React, { useState } from 'react';
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
    const [activeTab, setActiveTab] = useState('Home');

    const navItems = [
        { id: 'Home', label: 'Home', icon: FiHome },
        { id: 'Category', label: 'Category', icon: FiGrid },
        { id: 'Wishlist', label: 'Wishlist', icon: FiHeart },
        { id: 'Cart', label: 'Cart', icon: FiShoppingBag, badge: 3 }, // Optional badge count
        { id: 'Account', label: 'Account', icon: FiUser },
        { id: 'More', label: 'More', icon: FiMoreHorizontal },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-transparent pointer-events-none">
            {/* Navbar Container */}
            <nav className="w-full  bg-white/90 backdrop-blur-lg shadow-[0_-10px_30px_rgba(0,0,0,0.08)] rounded-t-2xl flex items-center justify-around px-2 py-3 border border-gray-100 pointer-events-auto ready-to-animate">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
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
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default BottomNavbar;