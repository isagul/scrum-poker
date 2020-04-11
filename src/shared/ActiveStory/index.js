import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { apiPrefix } from '../../constants/apiPrefix';
import './index.scss';

const ActiveStory = ({ sessionName, storyName, voterID }) => {
    const [clickedPoint, setClickedPoint] = useState(0);
    const [currentVoter, setCurrentVoter] = useState({});
    const [loading, setLoading] = useState(false);

    let activeVoter = '';

    if (voterID === 0) {
        activeVoter = 'Scrum Master';
    } else {
        activeVoter = `Voter ${voterID}`;
    }

    const points = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 5, label: '5' },
        { value: 8, label: '8' },
        { value: 13, label: '13' },
        { value: 21, label: '21' },
        { value: 34, label: '34' },
        { value: 55, label: '55' },
        { value: 89, label: '89' },
        { value: 134, label: '134' },
        { value: '', label: '?' }
    ];

    useEffect(() => {
        const sessionInterval = setInterval(() => {
            fetch(`${apiPrefix}/story/get-active`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_name: sessionName,
                })
            })
                .then(function (res) { return res.json(); })
                .then(function (response) {
                    if (response.status) {
                        if (response.story) {
                            response.story.voters.forEach(item => {
                                if (item.name === activeVoter) {
                                    setCurrentVoter(item);
                                }
                            })
                        }                        
                    }
                })
        }, 2000);

        return (() => {
            clearInterval(sessionInterval);
        })
    }, [activeVoter, sessionName])



    function getClickedPoint(point) {
        setLoading(true);
        setClickedPoint(point.value);

        fetch(`${apiPrefix}/story/vote`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_name: sessionName,
                voter_name: activeVoter,
                story_name: storyName,
                story_point: point.value
            })
        })
            .then(function (res) { return res.json(); })
            .then(function (response) {
                if (response.status) {
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
    }

    return (
        <Spin spinning={loading}>
            <div className="active-story-component">
                <p className="title">Active Story</p>
                {storyName.length > 0 && <p className="story-name">{storyName}</p>}
                <div className="points-area">
                    {
                        points.map(point => {
                            return (
                                <div key={point.value} className={`point ${point.value === clickedPoint ? 'active-point' : ''}`} onClick={() => getClickedPoint(point)}>
                                    {point.label}
                                </div>
                            )
                        })
                    }
                </div>
                {
                    Object.keys(currentVoter).length > 0 ?
                        currentVoter.point.length === 0 ? <p className="please-vote">Please Vote!</p> : <p className="vote-point">You voted {currentVoter.point} </p> :
                        <p className="please-vote">Please Vote!</p>
                }
            </div>
        </Spin>
    )
}

ActiveStory.propTypes = {
    storyName: PropTypes.string.isRequired,
    sessionName: PropTypes.string.isRequired,
    voterID: PropTypes.number,

};

ActiveStory.defaultProps = {
    storyName: '',
    sessionName: '',
    voterID: ''
};

export default ActiveStory;