import React, { useEffect, useState } from 'react';
import App from '../../App';
import { Table, Button } from 'antd';
import ActiveStory from '../../shared/ActiveStory';
import './index.scss';

const ViewScrumMaster = (props) => {
    const [stories, setStories] = useState([]);
    const [voters, setVoters] = useState([]);
    const [storyName, setStoryName] = useState('');

    const sessionName = props.match.params.sessionName;

    useEffect(() => {

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
                    setStoryName(stories[0].description);
                    setVoters(stories[0].voters);
                }
            })
    }, [sessionName]);

    const addKeyFieldStories = stories.length > 0 && stories.map((story, index) => {
        story["key"] = `${index + 1}`;
        return story;
    })

    const columns = [
        {
            title: 'Story',
            dataIndex: 'description',
            key: 'description',
            render: (text) => {
                return (
                    <span className="story-cell" onClick={() => {clickedStory(text)}}>{text}</span>
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

    function clickedStory(story) {
        setStoryName(story);
        fetch('http://localhost:3002/story/get-story', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                story_name: story,
                session_name: props.match.params.sessionName
            })
        })
            .then(function (res) { return res.json(); })
            .then(function (response) {
                if (response.status) {
                    console.log(response);
                    setVoters(response.story.voters)
                }
            })
    }

    return (
        <App>
            <div className="view-scrum-master-component">
                <Table columns={columns} dataSource={addKeyFieldStories} className="table" pagination={false}/>
                <ActiveStory storyName={storyName} sessionName={sessionName}/>
                {<div className="scrum-master-panel">
                    <p className="title">Scrum Master Panel</p>
                    {storyName.length > 0 && <p className="story-name">{storyName} is active</p>}
                    {
                        voters.map((voter, index) => {
                            return (
                                <div key={index} className="voters-list">
                                    <span className="name">{voter.name}: </span>
                                    <span className="status">{voter.status}</span>
                                </div>
                            )
                        })
                    }
                    <div className="end-voting-area">
                        <Button className="btn-end-voting">End Voting</Button>
                    </div>
                </div>}
            </div>
        </App>
    )
}

export default ViewScrumMaster;
