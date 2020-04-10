import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './index.scss';

const Header = () => {
    const location = useLocation();
    const [isVoterScrumMaster, setIsVoterScrumMaster] = useState(true);

    const pokerLogo = require('../../assets/poker_logo.png');

    useEffect(() => {
        if (location.pathname.includes('scrum-master')) {
            setIsVoterScrumMaster(true);
        } else {
            setIsVoterScrumMaster(false);
        }
    }, [location.pathname])


    return (
        <header className="header-component">
            <div className="logo-area">
                <img src={pokerLogo} alt="poker_logo" className="poker-logo"/>
                <h1 className="title">Scrum Poker</h1>
            </div>
            {isVoterScrumMaster && <p className="open-links">
                please share link of the developers panel to the teammates
                http://localhost:3000/#/poker-planning-view-as-developer/Sprint%203
            </p>}
        </header>
    )
}

export default Header;