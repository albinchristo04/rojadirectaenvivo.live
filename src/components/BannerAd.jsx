import React, { useEffect, useRef } from 'react';

const BannerAd = ({ className = '', style = {} }) => {
    const adContainerRef = useRef(null);

    useEffect(() => {
        // Create the ad configuration
        window.atOptions = {
            'key': '0669cb9f720396db47ff6c5c8e8b7a9e',
            'format': 'iframe',
            'height': 250,
            'width': 300,
            'params': {}
        };

        // Load the banner ad script
        const script = document.createElement('script');
        script.src = 'https://www.highperformanceformat.com/0669cb9f720396db47ff6c5c8e8b7a9e/invoke.js';
        script.async = true;
        
        // Add the script to the container when it's available
        if (adContainerRef.current) {
            adContainerRef.current.appendChild(script);
        }

        return () => {
            // Cleanup
            if (adContainerRef.current && adContainerRef.current.contains(script)) {
                adContainerRef.current.removeChild(script);
            }
        };
    }, []);

    return (
        <div 
            ref={adContainerRef}
            className={`bg-card rounded-lg border border-white/10 overflow-hidden ${className}`}
            style={style}
        >
            <div className="w-full text-center py-8 text-gray-500">
                Loading advertisement...
            </div>
        </div>
    );
};

export default BannerAd;