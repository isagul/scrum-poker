import React from 'react';
import App from '../../App';
import { Input, Button } from 'antd';
import { useFormik } from 'formik';
import { useHistory } from "react-router-dom";
import * as ROUTER from '../../constants/routes';
import * as Yup from 'yup';
import './index.scss';

const AddStoryList = (props) => {
    let history = useHistory();
    const { TextArea } = Input;

    const formik = useFormik({
        initialValues: {
            sessionName: '',
            votersNumber: '',
            stories: '',
        },
        validationSchema: Yup.object({
            sessionName: Yup.string()
                .max(200, 'Must be 200 characters or less')
                .required('required'),
            votersNumber: Yup.number()
                .positive('Number must be positive')
                .moreThan(0, 'Number must be greater than 0')
                .required('required'),
            stories: Yup.string()
                .required('required'),
        }),
        onSubmit: values => {         
            fetch('http://localhost:3002/session/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: values.sessionName,
                    voters_number: values.votersNumber,
                    stories: values.stories
                })
            })
                .then(function (res) { return res.json(); })
                .then(function (response) {
                    console.log('data', response);
                    if (response.status) {
                        history.push({
                            pathname: `${ROUTER.viewScrumMaster}/${values.sessionName}`,
                            state: { sessionName: values.sessionName }
                        });
                    }                    
                })
        },
    });

    return (
        <App>
            <div className="add-story-list-component">
                <form onSubmit={formik.handleSubmit}>
                    <div className="inputs-area">
                        <label htmlFor="session-name">Session Name:</label>
                        <div className="input">
                            <Input
                                id="session-name"
                                name="sessionName"
                                onChange={formik.handleChange}
                                value={formik.values.sessionName}
                                placeholder="Session Name" />
                            {formik.touched.sessionName && formik.errors.sessionName ? (
                                <span className="invalid">{formik.errors.sessionName}</span>
                            ) : null}
                        </div>
                        <label htmlFor="voters-number">Number of Voters:</label>
                        <div className="input">
                            <Input
                                id="voters-number"
                                type="number"
                                name="votersNumber"
                                onChange={formik.handleChange}
                                value={formik.values.votersNumber}
                                placeholder="Number of Voters" />
                            {formik.touched.votersNumber && formik.errors.votersNumber ? (
                                <span className="invalid">{formik.errors.votersNumber}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="story-area">
                        <p>Paste your story list (Each line will be converted as a story)</p>
                        <TextArea
                            onChange={formik.handleChange}
                            value={formik.values.stories}
                            name="stories"
                            rows={10} />
                        {formik.touched.stories && formik.errors.stories ? (
                            <span className="invalid">{formik.errors.stories}</span>
                        ) : null}
                    </div>
                    <Button htmlType="submit" className="start-session">Start Session</Button>
                </form>
            </div>
        </App>
    )
}

export default AddStoryList;