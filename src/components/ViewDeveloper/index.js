import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import ActiveStory from '../../shared/ActiveStory';
import App from '../../App';
import { apiPrefix } from '../../constants/apiPrefix';
import './index.scss';

const ViewDeveloper = (props) => {
    const [stories, setStories] = useState([]);
    const [storyName, setStoryName] = useState('');

    const sessionName = props.match.params.sessionName;
    const voterID = props.match.params.id;

    useEffect(() => {
        getSessionInfo();
        const sessionInterval = setInterval(getSessionInfo, 2000);
        return (() => {
            clearInterval(sessionInterval);
        })
    }, []);

    function getSessionInfo(){
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
                        setStoryName(response.story.description);
                    }
                }
            })

        fetch(`${apiPrefix}/session/get-info`, {
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
                    const { stories } = response.session;
                    setStories(stories);
                }
            })
    }

    const columns = [
        {
            title: 'Story',
            dataIndex: 'description',
            key: 'description',
            render: (text) => {
                return (
                    <span className="story-cell">{text}</span>
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