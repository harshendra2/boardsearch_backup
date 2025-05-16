import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Table ,Row,Col} from 'react-bootstrap';
import './application.css';
import View from '../../../../../assets/images/View.png';
import ExcelIcon from '../../../../../assets/images/ExcelIcon.png';
import download from '../../../../../assets/images/DownloadIcon.png';
import { CreateJobContext } from '../../../../../context/CreateJobContext';
import { useLocation } from 'react-router-dom';
import { useSupport } from '../../../../../context/SupportContext';
import DisplayImage from '../../../../../components/DisplayImage/DisplayImage';
import { toast } from 'react-toastify';
import axios from 'axios';
import BaseUrl from '../../../../../services/BaseUrl';
const Applications = () => {
    const {
        viewJobDesciptionData,
        applicantData,
        shortlis_candidate,
        fetch_Job_applicant
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
        fetch_Job_applicant();
    }, [location]);


    const DownLoadCandidateCV = async () => {
        const jobid = localStorage.getItem('job_id');
    
        try {
            const response = await axios.get(
                `${BaseUrl}company/get_Canidate_cv/${jobid}`,
                {
                    responseType: 'blob'
                }
            );
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Applied_Candidate.xlsx'); 
            document.body.appendChild(link);
            link.click();
    
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error(error?.response?.data?.error || "Download failed!");
        }
    };



    
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
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Row>
                        <Col
                            xs={12}
                            className="d-flex align-items-center justify-content-center"
                            onClick={DownLoadCandidateCV}
                        >
                            <Button
                            size='sm'
                                style={{
                                    background: 'rgb(120 187 242)',
                                    borderColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    borderRadius: '12px ',
                                    border: 'none',
                                    background: 'rgb(120 187 242)',
                                    color: 'black',
                                    fontSize:'0.9rem'
                                }}
                            >
                                <img
                                    width="20vw"
                                    src={ExcelIcon}
                                    alt="icon"
                                    style={{ marginRight: '10px' }}
                                />
                                Download CV
                                <img
                                    width="20vw"
                                    src={download}
                                    alt="icon"
                                    style={{ marginLeft: '10px' }}
                                />
                            </Button>
                        </Col>
                    </Row>
    </div>
                                      
                <Table style={{marginTop:'10px'}} bordered responsive>
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
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.7rem' }}>
                        {applicantData &&
                            applicantData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ borderLeft: 'none' }}>
                                        {index + 1}
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
                                    <td style={{ width: '20%' }}>
                                        <Button
                                            size="sm"
                                            style={{
                                                background: '#3B96E1',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 40px',
                                                width: '100%'
                                            }}
                                            onClick={() =>
                                                handle_ShortList(
                                                    item?.CandidateDetails?._id
                                                )
                                            }
                                        >
                                            Longlist
                                        </Button>
                                    </td>
                                </tr>
                            ))}
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
                                        // src={getEmbedLink(currentResume)} // Ensure the src is set
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
                                            margin: '0px 20px' // Prevent zoom feature
                                            // pointerEvents: 'none' // Disable interactions if needed
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

export default Applications;
