import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import './Longlist';
import View from '../../../../../assets/images/View.png';
import oui_cross from '../../../../../assets/images/oui_cross.png';
import { CreateJobContext } from '../../../../../context/CreateJobContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import BaseUrl from '../../../../../services/BaseUrl';
import { useSupport } from '../../../../../context/SupportContext';
import DisplayImage from '../../../../../components/DisplayImage/DisplayImage';

const Longlist = () => {
    const {
        viewJobDesciptionData,
        longlistData,
        shortlis_candidate,
        fetch_Job_Longlist
    } = useContext(CreateJobContext);
    const {
        smShowGloble,
        setSmShowGloble,
        imagesGloble,
        setImageGloble,
        handleGlobleModal,
        pdfGloble,
        setPdfGloble,
        getFileTypeFromHeaders
    } = useSupport();
    const [modalShow, setModalShow] = useState(false);
    const [currentResume, setCurrentResume] = useState('');
    const [user_id, setUser_id] = useState('');
    const [selectedRounds, setSelectedRounds] = useState({});

    const location = useLocation();
    const handleClose = () => {
        setModalShow(false);
        setCurrentResume('');
    };

    const handleShow = resume => {
        setCurrentResume(resume);
        setModalShow(true);
    };

    const formatDate = dateString => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000); // convert ms to minutes

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
    };

    const getEmbedLink = link => {
        const fileId = link.split('/d/')[1].split('/')[0]; // Extract file ID
        return `https://drive.google.com/file/d/${fileId}/preview`; // Create preview link
    };
    const isGoogleDriveLink = url => {
        return url && url.includes('drive.google.com');
    };
    const handle_ShortList = user_id => {
        setUser_id(user_id);
        showModal();
    };

    const [isModalVisible, setModalVisible] = useState(false);

    const showModal = () => setModalVisible(prev => !prev);

    const confirmAction = async () => {
        await shortlis_candidate(user_id);
        setModalVisible(false); // Close the modal after confirming
    };

    const handleRoundChange = (candidateIndex, event) => {
        const selectedIndex = event.target.value;
        setSelectedRounds(prevState => ({
            ...prevState,
            [candidateIndex]: selectedIndex
        }));
    };

    const handle_Interview_RoundAction = async (
        user_id,
        interviewRound,
        status
    ) => {
        const jobid = localStorage.getItem('job_id');
        try {
            const response = await axios.put(
                `${BaseUrl}company/change_status/interview_round/${jobid}/${user_id}`,
                { interviewRound, status }
            );
            if (response.status == 200 || 201) {
                fetch_Job_Longlist();
            }
        } catch (error) {}
    };
    async function getImage(image) {
        const fileType = await getFileTypeFromHeaders(image);
        if (fileType === 'image') {
            setImageGloble(image);
        } else if (fileType === 'pdf') {
            setPdfGloble(image);
        } else {
        }

        setSmShowGloble(true);
    }
    useEffect(() => {
        fetch_Job_Longlist();
    }, [location]);

    return (
        <>
            <Modal show={isModalVisible} onHide={showModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to proceed with this action?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={showModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmAction}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="applications mt-2">
                <Table bordered responsive>
                    <thead>
                        <tr style={{ borderTop: 'none' }}>
                            <th
                                style={{
                                    fontSize: '0.7rem',
                                    borderLeft: 'none'
                                }}
                                className="p-1"
                                scope="col"
                            >
                                Sr no
                            </th>
                            <th
                                className="p-1"
                                scope="col"
                                style={{ fontSize: '0.7rem' }}
                            >
                                Candidates name
                            </th>
                            <th
                                className="p-1"
                                scope="col"
                                style={{ fontSize: '0.7rem' }}
                            >
                                Email
                            </th>
                            <th
                                className="p-1"
                                scope="col"
                                style={{ fontSize: '0.7rem' }}
                            >
                                Mobile No.
                            </th>
                            <th
                                className="p-1"
                                scope="col"
                                style={{ fontSize: '0.7rem' }}
                            >
                                Resume/CV
                            </th>
                            <th
                                className="p-1"
                                scope="col"
                                style={{ fontSize: '0.7rem' }}
                            >
                                Date
                            </th>
                            <th
                                className="p-1"
                                scope="col"
                                style={{ fontSize: '0.7rem' }}
                            >
                                Interview Round
                            </th>
                            <th
                                className="p-1"
                                scope="col"
                                style={{ fontSize: '0.7rem' }}
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.7rem' }}>
                        {longlistData &&
                            longlistData.map((item, candidateIndex) => {
                                const selectedRoundIndex =
                                    selectedRounds[candidateIndex] || 0; // Use 0 as default if not selected
                                const selectedRound =
                                    item?.applied_candidates?.interviewRound[
                                        selectedRoundIndex
                                    ]; // Get current selected round

                                return (
                                    <tr key={candidateIndex}>
                                        <td style={{ borderLeft: 'none' }}>
                                            {candidateIndex + 1}
                                        </td>
                                        <td>{item?.BasicDetails?.name}</td>
                                        <td>{item?.BasicDetails?.email}</td>
                                        <td>{item?.BasicDetails?.mobile}</td>
                                        <td
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            resume.pdf
                                            <img
                                                src={View}
                                                alt=""
                                                height="20px"
                                                onClick={() =>
                                                    getImage(item?.resumeUrl)
                                                } // Pass the correct resume link
                                            />
                                        </td>
                                        <td>
                                            {formatDate(
                                                item?.applied_candidates
                                                    ?.applied_date
                                            )}
                                        </td>
                                        <td style={{ width: '25%' }}>
                                            <Form.Group
                                                controlId="email"
                                                className="mt-2"
                                            >
                                                <Form.Select
                                                    name="gender"
                                                    value={selectedRoundIndex}
                                                    onChange={event =>
                                                        handleRoundChange(
                                                            candidateIndex,
                                                            event
                                                        )
                                                    }
                                                    style={{
                                                        marginTop: '-6px',
                                                        height: '35px',
                                                        border: '1.3px solid #AEAEAE',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    {item?.applied_candidates?.interviewRound.map(
                                                        (round, roundIndex) => (
                                                            <option
                                                                key={roundIndex}
                                                                value={
                                                                    roundIndex
                                                                }
                                                            >
                                                                {' '}
                                                                {
                                                                    round.roundName
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </Form.Select>
                                            </Form.Group>
                                        </td>
                                        <td style={{ width: '25%' }}>
                                            {selectedRound.roundAction ===
                                            'Pending' ? (
                                                <>
                                                    {' '}
                                                    <Button
                                                        size="sm"
                                                        style={{
                                                            background:
                                                                '#3B96E1',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '6px 28px',
                                                            width: '40%',
                                                            marginRight: '10px'
                                                        }}
                                                        onClick={() =>
                                                            handle_Interview_RoundAction(
                                                                item
                                                                    ?.applied_candidates
                                                                    ?.candidate_id,
                                                                selectedRound?.roundName,
                                                                'Selected'
                                                            )
                                                        }
                                                    >
                                                        Select
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        style={{
                                                            background: 'red',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '6px 28px',
                                                            width: '40%'
                                                        }}
                                                        onClick={() =>
                                                            handle_Interview_RoundAction(
                                                                item
                                                                    ?.applied_candidates
                                                                    ?.candidate_id,
                                                                selectedRound?.roundName,
                                                                'Rejected'
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : selectedRound.roundAction ==
                                              'Selected' ? (
                                                <Button
                                                    size="sm"
                                                    style={{
                                                        background: '#3B96E1',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '6px 40px',
                                                        width: '70%'
                                                    }}
                                                >
                                                    Selected
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    style={{
                                                        background: 'red',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '6px 40px',
                                                        width: '70%'
                                                    }}
                                                >
                                                    Rejected
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>

                {smShowGloble && <DisplayImage />}
                <Modal
                    show={modalShow}
                    onHide={handleClose}
                    aria-labelledby="example-modal-sizes-title-lg"
                    centered
                    className="custommodule"
                >
                    <img
                        src={oui_cross}
                        alt=""
                        width={24}
                        onClick={handleClose}
                        style={{ cursor: 'pointer' }}
                    />
                    <div
                        style={{
                            height: '60vh',
                            width: '100%',
                            margin: '0px auto',
                            overflow: 'hidden'
                        }}
                    >
                        <div>
                            <div>
                                {currentResume ? (
                                    <iframe
                                        // src={getEmbedLink(currentResume)}
                                        src={
                                            currentResume
                                                ? isGoogleDriveLink(
                                                      currentResume
                                                  )
                                                    ? getEmbedLink(
                                                          currentResume
                                                      )
                                                    : currentResume
                                                : null
                                        }
                                        frameBorder="0"
                                        style={{
                                            width: '89%',
                                            height: '80vh',
                                            zoom: '1',
                                            margin: '0px 20px'
                                        }}
                                        title="Resume"
                                    ></iframe>
                                ) : (
                                    <p>No resume available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default Longlist;
