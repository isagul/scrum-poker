import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import './index.scss';

const ActiveStory = ({ sessionName, storyName }) => {
    const [clickedPoint, setClickedPoint] = useState(0);
    const history = useHistory();

    let voter = '';

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

    function getClickedPoint(point) {
        setClickedPoint(point.value);

        if (history.location.pathname.includes('scrum-master')) {
            voter = 'Scrum Master';
        } else {
            voter = 'Voter';
        }

        fetch('http://localhost:3002/story/vote', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_name: sessionName,
                voter_name: voter,
                story_name: storyName,
                story_point: point.value
            })
        })
            .then(function (res) { return res.json(); })
            .then(function (response) {
                if (response.status) {
                    console.log(response);
                }
            })
    }

    return (
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
        </div>
    )
}

ActiveStory.propTypes = {
    storyName: PropTypes.string.isRequired,
    sessionName: PropTypes.string.isRequired
};

ActiveStory.defaultProps = {
    storyName: '',
    sessionName: ''
};

export default ActiveStory;