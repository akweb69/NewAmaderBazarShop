import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AsideBar from './AsideBar';

const HomePageLayout = () => {
    const location = useLocation();
    const pathname = location.pathname;

    // Hide navbar on these routes
    const hideNavbarRoutes = ['/signup', '/signin'];
    const showNavbar = !hideNavbarRoutes.includes(pathname);

    return (
        <div className="w-full min-h-screen bg-white/97">

            <div className="flex w-full">

                {/* ==================== FIXED SIDEBAR ==================== */}
                <div className="w-60 hidden md:block shadow fixed top-0 left-0 h-screen bg-white/90 overflow-y-auto z-50">
                    <AsideBar />
                </div>

                {/* ==================== MAIN CONTENT ==================== */}
                <div className="flex-1 md:ml-60">

                    {/* Navbar */}
                    {showNavbar && (
                        <div className="sticky top-0 z-40 bg-[#0a0a0b]/90 backdrop-blur-md border-b border-[#1f1f23]">
                            <Navbar />
                        </div>
                    )}

                    {/* Page Content */}
                    <div className="w-full min-h-[calc(100vh-64px)]">
                        <Outlet />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HomePageLayout;