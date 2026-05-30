import React from 'react';
import Banner from './Banner';
import HeroVideoSlider from './HeroVideoSlider';
import TopCategories from './TopCategories';
import ProductSection from './ProductSection';

const HeroSection = () => {
    return (
        <div>
            <Banner />
            <HeroVideoSlider />
            <TopCategories />
            <ProductSection />

        </div>
    );
};

export default HeroSection;