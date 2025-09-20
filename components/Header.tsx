
import React, { useState } from 'react';
import { NAV_LINKS } from '../constants';
import type { NavLink } from '../constants';

interface HeaderProps {
    setView: (view: string) => void;
    isAdminView: boolean;
}

const Header: React.FC<HeaderProps> = ({ setView, isAdminView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigation = (link: NavLink) => {
        if (link.type === 'view') {
            setView(link.id);
        } else {
            setView('home');
            setTimeout(() => {
                const element = document.getElementById(link.id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 0);
        }
        setIsMenuOpen(false);
    };

    const renderNavLink = (link: NavLink, isMobile: boolean = false) => (
         <button
            key={link.id}
            onClick={() => handleNavigation(link)}
            className={`font-display tracking-wider text-lg transition-colors duration-300 ${isAdminView ? 'hover:text-white' : 'hover:text-brand-gold'} focus:outline-none ${isMobile ? 'block py-3 text-center w-full' : ''}`}
        >
            {link.name}
        </button>
    );

    const borderColor = isAdminView ? 'border-brand-silver' : 'border-brand-gold';
    const shadow = isAdminView ? 'shadow-silver-glow' : 'shadow-gold-glow';
    const textColor = isAdminView ? 'text-brand-silver' : 'text-brand-gold';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 bg-brand-dark bg-opacity-90 backdrop-blur-md border-b ${borderColor} ${shadow}`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <button onClick={() => handleNavigation({name: 'Home', id: 'home', type: 'scroll'})} className={`font-display text-2xl lg:text-3xl ${textColor} focus:outline-none transition-colors duration-300 hover:opacity-80`}>
                    {isAdminView ? 'Novelia | Administration' : 'Novelia'}
                </button>
                <nav className="hidden md:flex space-x-8 text-brand-silver">
                    {NAV_LINKS.map(link => renderNavLink(link))}
                </nav>
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-silver focus:outline-none">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-brand-dark bg-opacity-95 pb-4 border-t border-opacity-50 border-gray-600">
                    <nav className="flex flex-col items-center space-y-2 text-brand-silver">
                         {NAV_LINKS.map(link => renderNavLink(link, true))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;