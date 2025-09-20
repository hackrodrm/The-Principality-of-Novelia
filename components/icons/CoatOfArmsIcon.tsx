import React from 'react';

const CoatOfArmsIcon: React.FC = () => {
    return (
        <div className="relative w-64 h-auto mx-auto my-8 filter drop-shadow-lg">
            <svg viewBox="0 0 200 250" className="w-full h-full">
                {/* Quill (dexter/right) */}
                <g transform="rotate(-15 50 85)">
                    <path d="M60 20 C40 40, 20 100, 30 150 L40 145 C30 100, 50 50, 70 30 Z" fill="#C0C0C0" />
                    <path d="M35 148 L20 160 L25 145 Z" fill="#333" />
                </g>

                {/* Lamp (sinister/left) */}
                <g transform="translate(130 90) scale(0.4)">
                    <path d="M 0 50 C 0 20, 40 20, 40 50 L 60 50 C 80 50, 90 60, 90 70 L 10 70 C 10 60, 20 50, 40 50" fill="#FFD700"/>
                    <path d="M 45 20 C 50 10, 60 10, 65 20 Q 70 30 60 40 C 50 50 40 40 45 20 Z" fill="orange"/>
                </g>
                
                {/* Shield */}
                <path 
                    d="M 50 50 L 150 50 L 150 150 C 150 180, 100 200, 100 200 C 100 200, 50 180, 50 150 Z" 
                    fill="#4b0082" 
                    stroke="#FFD700" 
                    strokeWidth="4" 
                />

                {/* Book on shield */}
                <g transform="translate(75 90)">
                    <path d="M 0 0 L 50 0 L 50 40 L 0 40 Z" fill="#f5f5dc" stroke="#1a1a1a" strokeWidth="1" />
                    <path d="M 2 2 L 48 2 M 2 6 L 48 6 M 2 10 L 48 10 M 2 14 L 30 14" stroke="#1a1a1a" strokeWidth="0.5" />
                    <path d="M 25 0 L 25 40" stroke="#1a1a1a" strokeWidth="1" />
                </g>

                {/* Crown */}
                <g transform="translate(70 20)">
                    <path d="M 0 10 L 60 10 L 55 30 L 30 20 L 5 30 Z" fill="#FFD700"/>
                    <circle cx="5" cy="10" r="3" fill="#990000" />
                    <circle cx="30" cy="10" r="3" fill="#000099" />
                    <circle cx="55" cy="10" r="3" fill="#006400" />
                </g>

                {/* Motto Banner */}
                <g>
                    <path d="M 40 210 C 60 230, 140 230, 160 210 L 150 220 C 130 240, 70 240, 50 220 Z" fill="#f5f5dc" stroke="#333" strokeWidth="1"/>
                    <text x="100" y="225" fontFamily="serif" fontSize="12" textAnchor="middle" fill="#1a1a1a" fontWeight="bold">SAPIENTIA ET FIDES</text>
                </g>
            </svg>
        </div>
    );
};

export default CoatOfArmsIcon;