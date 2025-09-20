import React from 'react';

const FlagIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <svg viewBox="0 0 200 200" className={className} aria-label="The Flag of Novelia" role="img">
            {/* Flag background with a decorative frame effect */}
            <rect x="0" y="0" width="200" height="200" fill="#1a1a1a" />
            <rect x="5" y="5" width="190" height="190" fill="#4b0082" />
            
            {/* Shield and its contents, centered */}
            <g transform="translate(25, 25) scale(0.75)">
                {/* Shield shape */}
                <path 
                    d="M 50 50 L 150 50 L 150 150 C 150 180, 100 200, 100 200 C 100 200, 50 180, 50 150 Z" 
                    fill="none" 
                    stroke="#FFD700" 
                    strokeWidth="5.33"
                />

                {/* Book on shield */}
                <g transform="translate(75 105)">
                    <path d="M 0 0 L 50 0 L 50 40 L 0 40 Z" fill="#f5f5dc" stroke="#1a1a1a" strokeWidth="1.33"/>
                    <path d="M 2 2 L 48 2 M 2 6 L 48 6 M 2 10 L 48 10 M 2 14 L 30 14" stroke="#1a1a1a" strokeWidth="0.66" />
                    <path d="M 25 0 L 25 40" stroke="#1a1a1a" strokeWidth="1.33" />
                </g>

                {/* Crown inside shield */}
                <g transform="translate(70 60)">
                    <path d="M 0 10 L 60 10 L 55 30 L 30 20 L 5 30 Z" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1.33"/>
                    <circle cx="5" cy="10" r="4" fill="#990000" />
                    <circle cx="30" cy="10" r="4" fill="#000099" />
                    <circle cx="55" cy="10" r="4" fill="#006400" />
                </g>
            </g>
        </svg>
    );
};

export default FlagIcon;
