
import React from 'react';

interface FooterProps {
    isAdminView: boolean;
}

const Footer: React.FC<FooterProps> = ({ isAdminView }) => {
    const borderColor = isAdminView ? 'border-brand-silver' : 'border-brand-gold';
    
    return (
        <footer className={`bg-brand-dark bg-opacity-80 border-t ${borderColor} mt-16 shadow-inner`}>
            <div className="container mx-auto px-6 py-8 text-center text-brand-silver text-base">
                {!isAdminView && (
                    <>
                        <p className="font-body italic text-lg">So sworn in the shadow of Gothic arches and in the light of eternal books, by Crown, by Reader, by Peer, and by Commoner — Thus stands the Principality of Novelia.</p>
                        <p className="mt-6 opacity-70 font-body text-sm">
                            The Principality of Novelia is a literary and cultural project. All content is for creative and fellowship purposes only.
                        </p>
                    </>
                )}
                <p className="mt-4 opacity-70 font-body text-sm">&copy; {new Date().getFullYear()} The Principality of Novelia. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;