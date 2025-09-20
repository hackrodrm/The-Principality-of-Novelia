import React from 'react';
import Home from './sections/Home';
import Government from './sections/Government';
import Laws from './sections/Laws';
import Honors from './sections/Honors';
import Ministries from './sections/Ministries';

const MainPage: React.FC = () => {
    return (
        <>
            <Home />
            <Government />
            <Laws />
            <Honors />
            <Ministries />
        </>
    );
};

export default MainPage;