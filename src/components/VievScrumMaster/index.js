import React, { useEffect, useState } from 'react';
import App from '../../App';
import { Table, Button, Input } from 'antd';
import ActiveStory from '../../shared/ActiveStory';
import {useHistory} from 'react-router-dom';
import { openNotificationWithIcon } from '../../utils/index';
import {defaultPath} from '../../constants/routes';
import { apiPrefix } from '../../constants/apiPrefix';
import './index.scss';

let count = 0;

const ViewScrumMaster = (props) => {
    const [stories, setStories] = useState([]);
    const [voters, setVoters] = useState([]);
    const [storyName, setStoryName] = useState('');
    const [isVotedFinish, setIsVotedFinish] = useState(false);
    const [finalStoryPoint, setFinalStoryPoint] = useState(0);
    const [isAllStoriesVoted, setIsAllStoriesVoted] = useState(false);
    const history = useHistory();

    const sessionName = props.match.params.sessionName;

    useEffect(() => {
        getSessionInfo();
        const sessionInterval = setInterval(getSessionInfo, 2000);
        return (() => {
            clearInterval(sessionInterval);
        })
    }, []);

    // setInterval(getSessionInfo, 2000);

    function getSessionInfo() {
        fetch(`${apiPrefix}/story/get-active` , {
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
                        setVoters(response.story.voters);
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

    function getFinalScore(event) {
        setFinalStoryPoint(event.target.value);
    }


    const endVoting = () => {
        let isAllVotersVoted = voters.every(voter => {
            return voter.status === 'Voted';
        });

        setIsVotedFinish(isAllVotersVoted);

        if (isAllVotersVoted) {
            if (finalStoryPoint !== 0) {
                fetch(`${apiPrefix}/story/update-final-score`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        session_name: sessionName,
                        story_name: storyName,
                        story_point: finalStoryPoint
                    })
                })
                    .then(function (res) { return res.json(); })
                    .then(function (response) {
                        if (response.status) {
                            openNotificationWithIcon('success', 'Final score was updated successfully.');
                        } else {
                            openNotificationWithIcon('error', 'Something went wrong.');
                        }
                    })

                let nextStory = stories.find(story => story.status === 'Not Voted');

                if (nextStory !== undefined) {
                    const { description } = nextStory;

                    fetch(`${apiPrefix}/session/update-next-story-status`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            session_name: sessionName,
                            story_name: description
                        })
                    })
                        .then(function (res) { return res.json(); })
                        .then(function (response) {
                            if (response.status) {
                                const { stories } = response.session;
                                setStoryName(stories[count].description);
                                setIsVotedFinish(false);
                                setFinalStoryPoint(0);
                            }
                        })
                } else {
                    setIsAllStoriesVoted(true);
                }
            }
        } else {
            openNotificationWithIcon('warning', 'Ooops, Voting has not been finished yet.');
        }
    }

    const finishVoting = () => {
        history.push(defaultPath);
    }

    return (
        <App sessionName={sessionName}>
            <div className="view-scrum-master-component">
                <Table columns={columns} dataSource={addKeyFieldStories} className="table" pagination={false} />
                <ActiveStory storyName={storyName} sessionName={sessionName} voterID={0} />
                {<div className="scrum-master-panel">
                    <p className="title">Scrum Master Panel</p>
                    {storyName.length > 0 && <p className="story-name">{storyName} is active</p>}
                    {
                        voters.map((voter, index) => {
                            return (
                                <div key={index} className="voters-list">
                                    <span className="name">{voter.name}: </span>
                                    {
                                        isVotedFinish === false ?
                                            <span className="status">{voter.status}</span> :
                                            <span className="status">{voter.point}</span>
                                    }
                                </div>
                            )
                        })
                    }
                    <div className="end-voting-area">
                        {
                            isAllStoriesVoted === true ?
                                <Button className="btn-finish-voting" onClick={finishVoting}>Finish Voting</Button> :
                                <>
                                    {
                                        isVotedFinish === true &&
                                        <>
                                            <label htmlFor="final-score">Final Score</label>
                                            <Input
                                                id="final-score"
                                                className="final-score-input"
                                                placeholder="Final Score"
                                                type="number"
                                                onChange={event => getFinalScore(event)}
                                            />
                                        </>
                                    }
                                    <Button className="btn-end-voting" onClick={endVoting}>End Voting for {storyName}</Button>
                                </>
                        }

                    </div>
                </div>}
            </div>
        </App>
    )
}

export default ViewScrumMaster;
