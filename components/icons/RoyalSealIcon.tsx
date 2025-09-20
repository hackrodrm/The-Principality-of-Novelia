
import React from 'react';

const RoyalSealIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className={className}
            aria-label="The Royal Seal of Novelia"
            role="img"
        >
            <defs>
                <path id="circlePathTop" d="M 40,100 A 60,60 0 1 1 160,100" fill="none" />
                <path id="circlePathBottom" d="M 160,100 A 60,60 0 0 1 40,100" fill="none" />
            </defs>
            
            {/* Outer layers */}
            <circle cx="100" cy="100" r="98" fill="#FFD700" />
            <circle cx="100" cy="100" r="94" fill="#4b0082" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#FFD700" strokeWidth="2" />
            
            {/* Text on seal */}
            <text fill="#FFD700" fontFamily='"Uncial Antiqua", cursive' fontSize="16">
                <textPath href="#circlePathTop" startOffset="50%" textAnchor="middle">
                    PRINCIPALITY OF NOVELIA
                </textPath>
            </text>
            <text fill="#FFD700" fontFamily='"Merriweather", serif' fontSize="12" fontWeight="bold">
                <textPath href="#circlePathBottom" startOffset="50%" textAnchor="middle">
                    • SAPIENTIA ET FIDES •
                </textPath>
            </text>

            {/* Central Icon: Crossed Quills */}
            <g transform="translate(100 100) scale(0.6)">
                <g transform="rotate(-30)">
                     <path d="M-10 -70 C-30 -50, -50 10, -40 60 L-30 55 C-40 10, -20 -40, 0 -60 Z" fill="#C0C0C0" />
                     <path d="M-45 58 L-60 70 L-55 55 Z" fill="#333" />
                </g>
                 <g transform="rotate(30) scale(-1, 1)">
                     <path d="M-10 -70 C-30 -50, -50 10, -40 60 L-30 55 C-40 10, -20 -40, 0 -60 Z" fill="#C0C0C0" />
                     <path d="M-45 58 L-60 70 L-55 55 Z" fill="#333" />
                </g>
            </g>

            {/* Central Icon: Book */}
             <g transform="translate(72 80)">
                <path d="M 0 15 L 56 15 L 56 55 C 56 60, 28 65, 28 65 C 28 65, 0 60, 0 55 Z" fill="#f5f5dc" stroke="#1a1a1a" strokeWidth="1" />
                <path d="M 28,18 L 28,64 M 4 22 L 24 22 M 4 28 L 24 28 M 4 34 L 20 34 M 32 22 L 52 22 M 32 28 L 52 28 M 32 34 L 48 34" stroke="#1a1a1a" strokeWidth="0.75" />
            </g>

            {/* Central Icon: Crown */}
            <g transform="translate(70 55)">
                <path d="M 0 10 L 60 10 L 55 30 L 30 20 L 5 30 Z" fill="#FFD700" stroke="#1a1a1a" strokeWidth="1"/>
                <circle cx="5" cy="10" r="4" fill="#990000" />
                <circle cx="30" cy="10" r="4" fill="#000099" />
                <circle cx="55" cy="10" r="4" fill="#006400" />
            </g>
        </svg>
    );
};

export default RoyalSealIcon;
