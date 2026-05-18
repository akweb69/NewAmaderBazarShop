import React from 'react';
import { Outlet } from 'react-router-dom';

const HomePageLayout = () => {
    return (
        <div className='w-full min-h-screen'>

            {/* outlet */}
            <div className="">
                <Outlet />
            </div>
        </div>
    );
};

export default HomePageLayout;