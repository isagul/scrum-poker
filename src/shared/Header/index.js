import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { openNotificationWithIcon } from '../../utils';
import PropTypes from 'prop-types';
import './index.scss';

const Header = (props) => {
    const { sessionName } = props;
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

    function copyDevLink(event) {
        let copyText = document.getElementById("devLink");
        const el = document.createElement('textarea');
        el.value = copyText.textContent;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        openNotificationWithIcon('success', 'Copied successfully')
    }

    return (
        <header className="header-component">
            <div className="logo-area">
                <img src={pokerLogo} alt="poker_logo" className="poker-logo" />
                <h1 className="title">Scrum Poker</h1>
            </div>
            {
                isVoterScrumMaster &&
                <p className="open-links" onClick={(event) => copyDevLink(event)}>
                    please share link of the developers panel to the teammates 
                    <span id="devLink" className="dev-url">
                        {window.location.origin}/#/poker-planning-view-as-developer/
                        {`${sessionName}`}/1</span>
                </p>
            }
        </header>
    )
}

Header.propTypes = {
    sessionName: PropTypes.string
};

Header.defaultProps = {
    sessionName: ''
};

export default Header;