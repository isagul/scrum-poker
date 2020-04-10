import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import ActiveStory from '../../shared/ActiveStory';
import App from '../../App';
import './index.scss';

const ViewDeveloper = (props) => {
    const [storyCount, setStoryCount] = useState(0);
    const [stories, setStories] = useState([]);
    const [storyName, setStoryName] = useState('');

    const sessionName = props.match.params.sessionName;
    const voterID = props.match.params.id;

    useEffect(() => {
        // console.log(props.match);

        fetch('http://localhost:3002/session/get-info', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: sessionName,
            })
        })
            .then(function (res) { return res.json(); })
            .then(function (response) {
                if (response.status) {
                    const { stories } = response.session;
                    setStories(stories);
                    setStoryName(stories[storyCount].description);
                }
            })
    }, [storyCount, sessionName]);

    const columns = [
        {
            title: 'Story',
            dataIndex: 'description',
            key: 'description',
            render: (text) => {
                return (
                    <span className="story-cell" onClick={() => { clickedStory(text) }}>{text}</span>
                )
            }
        },
        {
            title: 'Point',
            dataIndex: 'point',
            key: 'point',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        }
    ];

    const addKeyFieldStories = stories.length > 0 && stories.map((story, index) => {
        story["key"] = `${index + 1}`;
        return story;
    })

    function clickedStory(story) {
        // fetch('http://localhost:3002/story/get-story', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json, text/plain, */*',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         story_name: story,
        //         session_name: props.match.params.sessionName
        //     })
        // })
        //     .then(function (res) { return res.json(); })
        //     .then(function (response) {
        //         if (response.status) {
        //             console.log(response);
        //         }
        //     })
    }

    return (
        <App>
            <div className="view-developer-component">
                <Table columns={columns} dataSource={addKeyFieldStories} className="table" pagination={false} />
                <ActiveStory storyName={storyName} sessionName={sessionName} voterID={voterID}/>
            </div>
        </App>
    )
}

export default ViewDeveloper;