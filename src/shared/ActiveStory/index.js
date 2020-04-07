import React, { useState } from 'react';
import './index.scss';

const ActiveStory = (props) => {
    const [clickedPoint, setClickedPoint] = useState(0);
    const points = [
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 5, label: '5'},
        {value: 8, label: '8'},
        {value: 13, label: '13'},
        {value: 21, label: '21'},
        {value: 34, label: '34'},
        {value: 55, label: '55'},
        {value: 89, label: '89'},
        {value: 134, label: '134'},
        {value: 0, label: '?'}
    ];

    function getClickedPoint(point){
        setClickedPoint(point.value)
    }

    return (
        <div className="active-story-component">
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

export default ActiveStory;