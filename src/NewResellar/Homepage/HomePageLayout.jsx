import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const HomePageLayout = () => {
    const location = useLocation();

    // current route
    const pathname = location.pathname;

    // navbar hide routes
    const hideNavbarRoutes = ['/signup', '/signin'];

    const showNavbar = !hideNavbarRoutes.includes(pathname);

    return (
        <div className='w-full min-h-screen'>
            {showNavbar && <Navbar />}

            {/* outlet */}
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default HomePageLayout;