
import React from 'react';

interface SectionProps {
    id: string;
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, children, className = '' }) => {
    return (
        <section id={id} className={`py-16 md:py-24 ${className}`}>
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="font-display text-4xl md:text-6xl text-brand-gold drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)] tracking-wider">
                        {title}
                    </h2>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4"></div>
                </div>
                <div className="max-w-5xl mx-auto text-brand-parchment text-lg leading-relaxed space-y-6">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default Section;