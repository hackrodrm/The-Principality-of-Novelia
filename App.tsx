
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import NationalLibrary from './components/sections/NationalLibrary';
import RoyalOffice from './components/sections/Admin';
import MinisterPanel from './components/sections/MinisterPanel';
import ParliamentPanel from './components/sections/ParliamentPanel';
import BureauPanel from './components/sections/BureauPanel';

const ADMIN_VIEWS = ['royalOffice', 'ministersPanel', 'parliament', 'bureauOffice'];

const App: React.FC = () => {
    const [view, setView] = useState('home');

    const isAdminView = ADMIN_VIEWS.includes(view);

    const renderContent = () => {
        switch (view) {
            case 'library':
                return <NationalLibrary />;
            case 'royalOffice':
                return <RoyalOffice />;
            case 'ministersPanel':
                return <MinisterPanel />;
            case 'parliament':
                return <ParliamentPanel />;
            case 'bureauOffice':
                return <BureauPanel />;
            case 'home':
            default:
                return <MainPage />;
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${isAdminView ? 'admin-bg' : ''}`}>
            <Header setView={setView} isAdminView={isAdminView} />
            <main className="pt-24 lg:pt-28 flex-grow content-fade-in" key={view}>
                {renderContent()}
            </main>
            <Footer isAdminView={isAdminView} />
        </div>
    );
};

export default App;