import React, { useEffect, useState } from 'react';
import { Modal, Button, ProgressBar } from 'react-bootstrap';
import './profilecomplete.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import oui_cross from '../../../assets/images/oui_cross.png';
import BaseUrl from '../../../services/BaseUrl';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const ProfileCompletionModal = ({ onClose, setShowModal }) => {
    const navigate = useNavigate();
    const [profileCompletion, SetProfileCompletion] = useState({
        basicDetails: 0,
        personalDetails: 0,
        workDetails: 0,
        educationDetails: 0,
        ProfileVerification:0
    });

    const sections = [
        { name: 'Basic Details', progress: profileCompletion.basicDetails },
        // {
        //     name: 'Personal Details',
        //     progress: profileCompletion.personalDetails
        // },
        {
            name: 'Personal Details',
            progress:profileCompletion==1?100:45
        },
        { name: 'Work Details', progress: profileCompletion.workDetails },
        // {
        //     name: 'Education Details',
        //     progress: profileCompletion.educationDetails
        // }
         {
            name: 'Education Details',
            progress:100
        }
    ];

    const totalCompletion = Math.round(
        (sections.reduce((sum, section) => sum + section.progress, 0) /
            (sections.length * 100)) *
            100
    );

    // application status api
    const getApplicationData = async () => {
        const token = localStorage.getItem('Candidate_token');
        if (!token) {
            return;
        } else {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?._id;
            try {
                const response = await axios.get(
                    `${BaseUrl}/candidate/profile/percentage/${userId}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`
    
                        }
                    } 
                );
                SetProfileCompletion(response?.data);
            } catch (error) {}
        }
    };

    const handleClose = () => {
        navigate('/profile-candidate/my-details');
        setShowModal(false);
    };
    useEffect(() => {
        getApplicationData();
    }, []);

    return (
        <Modal
            show={true}
            onHide={onClose}
            //   show={show}
             //onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            animation={true}
            dialogClassName="custom-modal"
        >
            <Modal.Body>
                <div className="text-center">
                    <h1
                        style={{ textAlign: 'end' }}
                        onClick={() => setShowModal(false)}
                    >
                        <img src={oui_cross} alt="" width={24} />
                    </h1>
                    <h4>Your Profile Completion</h4>
                    <div
                        style={{
                            width: '150px',
                            height: '150px',
                            margin: '20px auto',
                            position: 'relative',
                            marginTop:'-3%'
                        }}
                    >
                        <svg
                            width="150"
                            height="150"
                            viewBox="0 0 36 36"
                            className="circular-chart blue"
                        >
                            <path
                                className="circle-bg"
                                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e6e6e6"
                                strokeWidth="2"
                            />
                            <path
                                className="circle"
                                strokeDasharray={`${totalCompletion}, 100`}
                                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#4caf50"
                                strokeWidth="2.5"
                            />
                            <text
                                x="18"
                                y="20.35"
                                className="percentage"
                                fill="#4caf50"
                                fontSize="8"
                                textAnchor="middle"
                            >
                                {totalCompletion}%
                            </text>
                        </svg>
                    </div>

                    <ul className="list-unstyled">
                        {/* {sections.map((section, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>
                                <strong style={{ fontSize: '0.8rem' }}>
                                    {section.name}
                                </strong>
                                <ProgressBar
                                    now={section.progress}
                                    label={`${section.progress}%`}
                                    animated
                                />
                            </li>
                        ))} */}
                        {sections.map((section, index) => (
    <li key={index} style={{ marginBottom: '10px' }}>
        <strong style={{ fontSize: '0.8rem' }}>
            {section.name}
        </strong>
        <ProgressBar
            now={section.progress}
            label={`${section.progress}%`}
            animated
        />
        {section?.name === "Personal Details" &&profileCompletion?.ProfileVerification === 0 && (
            <p style={{fontSize:"0.8rem" , color:"red"}}>Admin will update the status after verification </p>
        )}
    </li>
))}

                    </ul>
                    <Button
                        variant="success"
                        style={{ fontSize: '0.8rem', paddingBottom: '7px'}}
                        onClick={handleClose}
                    >
                        Complete Your Profile
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ProfileCompletionModal;
