import React, { useEffect, useState } from 'react';
import App from '../../App';
import { Table, Button, Input } from 'antd';
import ActiveStory from '../../shared/ActiveStory';
import './index.scss';

const ViewScrumMaster = (props) => {
    const [storyCount, setStoryCount] = useState(0);
    const [stories, setStories] = useState([]);
    const [voters, setVoters] = useState([]);
    const [storyName, setStoryName] = useState('');
    const [isVotedFinish, setIsVotedFinish] = useState(false);
    const [finalStoryPoint, setFinalStoryPoint] = useState(0);

    let count = 0;

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
                    setStoryName(stories[storyCount].description);
                    setVoters(stories[storyCount].voters);
                }
            })
    }, [storyCount, sessionName]);

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

    function clickedStory(story) {
        console.log(story);
        // let isAnyActiveStory = stories.some(story => {
        //     return story.status === 'Active';
        // });
        // if (isAnyActiveStory) {
        //     console.log('There is a active story');
        // } else {
        //     setStoryName(story);
        //     fetch('http://localhost:3002/story/get-story', {
        //         method: 'POST',
        //         headers: {
        //             'Accept': 'application/json, text/plain, */*',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             story_name: story,
        //             session_name: props.match.params.sessionName
        //         })
        //     })
        //         .then(function (res) { return res.json(); })
        //         .then(function (response) {
        //             if (response.status) {
        //                 console.log(response);
        //                 setVoters(response.story.voters)
        //             }
        //         })
        // }        
    }

    function getFinalScore(event){
        setFinalStoryPoint(event.target.value);
    }


    const endVoting = () => {
        let isAllVotersVoted = voters.every(voter => {
            return voter.status === 'Voted';
        });

        setIsVotedFinish(isAllVotersVoted);

        if (isVotedFinish) {
            fetch('http://localhost:3002/story/update-final-score', {
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
                        console.log(response);
                    }
                })

            count++;
            setStoryCount(count);
            let nextStory = stories.find((story, index) => index === count);
            const {description} = nextStory;

            fetch('http://localhost:3002/session/update-next-story-status', {
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
                        setStories(stories);
                        setStoryName(stories[count].description);
                        setVoters(stories[count].voters);
                    }
                })
            setIsVotedFinish(false);
        } else {
            console.log('Ooops, Voting has not been finished yet.')
        }  
    }

    return (
        <App>
            <div className="view-scrum-master-component">
                <Table columns={columns} dataSource={addKeyFieldStories} className="table" pagination={false} />
                <ActiveStory storyName={storyName} sessionName={sessionName} />
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
                    </div>
                </div>}
            </div>
        </App>
    )
}

export default ViewScrumMaster;
