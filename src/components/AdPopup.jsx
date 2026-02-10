import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const AdPopup = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show popup after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        // Load the popup ad script
        const script = document.createElement('script');
        script.src = 'https://pl28447342.effectivegatecpm.com/e1/59/ad/e159ad5d97bb49342ffbf8f6afde48eb.js';
        script.async = true;
        document.head.appendChild(script);

        return () => {
            clearTimeout(timer);
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="relative bg-background rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Ad Container */}
                <div className="p-4">
                    <div 
                        id="popup-ad-container"
                        className="w-full h-96 bg-card rounded-lg border border-white/10 flex items-center justify-center"
                    >
                        {/* The popup ad will load here */}
                        <p className="text-gray-500 text-center">
                            Loading advertisement...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdPopup;