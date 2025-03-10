import React, { useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
//const socket = io('http://65.20.91.47:4000');
//const socket=io('http://localhost:4000');
const socket = io('https://boardsearch.ai');
import {
    Button,
    Modal,
    Row,
    Table,
    OverlayTrigger,
    Tooltip,
    Col
} from 'react-bootstrap';
import SearchIconS from '../../../assets/images/SearchIconS.png';
import chatIcon from '../../../assets/images/chatIcon.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { CandidateSupportContext } from '../../../context/candidateContext/CandidateSupportContext';
import AddCandidateIssue from './addCandidateIssue/AddCandidateIssue';
import Sendmails from './Sendmail/SendMail';
import { Helmet } from 'react-helmet';

const CandidateSupport = () => {
    const {
        supportData,
        fetch_Candidate_issue,
        modalShow,
        setModalShow,
        mailModelShow,
        setMailModelShow
    } = useContext(CandidateSupportContext);
    const location = useLocation();
    const [SeacrhInput, SetSeacrhInput] = useState('');
    const [activeButton, setActiveButton] = useState('pending');
    useEffect(() => {
        fetch_Candidate_issue();
    }, [location]);

    const navigate = useNavigate();
    function navigateChate(id) {
        navigate(`/candidate-dashboard/candidate-chat/${id}`);
    }

    const formatDate = dateString => {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-GB', options); // 'en-GB' for DD/MM/YYYY format
    };
   
    const supportDatas = supportData || [];
    let allData =supportDatas.filter(item => {
        return (
            item?.status && activeButton &&
            item.status.toLowerCase().includes(activeButton.toLowerCase())
        );
    });

   
    let tempData=allData||[]
    const fiteredData = tempData.filter(item => {
        return (
            item.Issue_type.toLowerCase().includes(SeacrhInput.toLowerCase())
        ) || (
            item.Ticket.toLowerCase().includes(SeacrhInput.toLowerCase())
        );
    });


    function rendering() {
        const render = localStorage.getItem('render');

        if (render === 'candidate') {
            const token = localStorage.getItem('Candidate_token');
            if (!token) {
                navigate('/login');
            } else {
                navigate('/candidate-dashboard/support-candidate');
            }
        } else {
            navigate('/login');
        }
    }

    useEffect(() => {
        rendering();
    }, []);

    function RemovePath(imageUrl) {
        if (imageUrl) {
            return imageUrl.split('\\').pop();
        }
        return 'N/A';
    }

    function toCamelCase_Name(input) {
        if (typeof input == 'string') {
            return input
                ? input
                      .toLowerCase()
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                : null;
        } else {
            return input;
        }
    }

    const SendMail = props => (
        <Tooltip id="save-tooltip" {...props}>
            Click this button to send an email directly to the support team.
        </Tooltip>
    );

    const AddIssue = props => (
        <Tooltip id="save-tooltip" {...props}>
            Click this button to report your issue directly to the support team.
        </Tooltip>
    );

    const getButtonStyle = path => {
        if (location.pathname.includes(path)) {
            return {
                background: '#B4DDFF',
                color: '#051F50',
                border: 'none',
                width: '200px',

                border: '0.5px solid #5baaff',
                width: '200px'
            };
        } else {
            return {
                background: 'white',
                color: '#AEAEAE',
                border: 'none',
                width: '200px'
            };
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('Candidate_token');
        const decodedToken = jwtDecode(token);
        const candidate_id = decodedToken?._id;
        socket.connect();
        socket.emit('ViewNewMessage', candidate_id);
        socket.emit('messageNotification', candidate_id);
        socket.on('disconnect', () => {
        });

        return () => {
            socket.off('notification');
            socket.disconnect();
        };
    }, []);


    const handleToggle = (buttonName) => {
        setActiveButton(buttonName === activeButton ? '' : buttonName);
    };

    return (
        <>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => setModalShow(false)}
                dialogClassName="add-modal-width"
            >
                <AddCandidateIssue />
            </Modal>

            <div className="support mt-2">
                    <div className="Search-support">
                    <div className="top-row">
                        <OverlayTrigger placement="bottom" overlay={AddIssue}>
                            <Button
                                size="sm"
                                className="add-issue-btn"
                                onClick={() => setModalShow(prev => !prev)}
                            >
                                Issue Ticket +
                            </Button>
                        </OverlayTrigger>

                        <div className="search-bar-suport">
                            <img src={SearchIconS} alt="" width="20px" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={SeacrhInput}
                                onChange={e => SetSeacrhInput(e.target.value)}
                            />
                        </div>
                        </div>
                        <Row className="toggle-btn">
                                    <Col xs="auto" className="p-0 mb-2">
                        <button
                            style={{
                                borderRadius: '20px 0 0 20px',
                                border: '1px solid #ccc',
                                backgroundColor: activeButton === 'solved' ? '#3B96E1' : '#fff',
                                color: activeButton === 'solved' ? '#fff' : '#000',
                                padding: '9px 11px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}
                            onClick={() => handleToggle('solved')}
                        >
                            Close
                        </button>
                    </Col>
                    <Col xs="auto" className="p-0">
                        <button
                            style={{
                                border: '1px solid #ccc',
                                backgroundColor: activeButton === 'pending' ? '#3B96E1' : '#fff',
                                color: activeButton === 'pending' ? '#fff' : '#000',
                                padding: '9px 11px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}
                            onClick={() => handleToggle('pending')}
                        >
                            Open
                        </button>
                    </Col>
                    <Col xs="auto" className="p-0">
                        <button
                            style={{
                                borderRadius: '0 20px 20px 0',
                                border: '1px solid #ccc',
                                backgroundColor: activeButton === 'reject' ? '#3B96E1' : '#fff',
                                color: activeButton === 'reject' ? '#fff' : '#000',
                                padding: '9px 11px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}
                            onClick={() => handleToggle('reject')}
                        >
                            Reject
                        </button>
                    </Col>
                        </Row>
                    </div>
                <Row className="mt-2">
    <Table
        bordered
        striped
        responsive
        className="custom-table"
        style={{
            overflowX: 'auto',
            overflowY: 'auto'
        }}
    >
        <thead>
            <tr style={{ borderTop: 'none' }}>
                <th
                    style={{
                        fontSize: '0.8rem',
                        borderLeft: '1px solid #dee2e6', // Ensure border is applied
                        color: '#051F50'
                    }}
                    className="p-3"
                    scope="col"
                >
                    Sr. No
                </th>
                <th
                    style={{
                        fontSize: '0.8rem',
                        borderLeft: '1px solid #dee2e6', // Ensure border is applied
                        color: '#051F50'
                    }}
                    className="p-3"
                    scope="col"
                >
                    Tickets
                </th>
                <th
                    className="p-3"
                    scope="col"
                    style={{
                        fontSize: '0.8rem',
                        borderLeft: '1px solid #dee2e6', // Ensure border is applied
                        color: '#051F50'
                    }}
                >
                    Issue Type
                </th>
                <th
                    className="p-3"
                    scope="col"
                    style={{
                        fontSize: '0.8rem',
                        borderLeft: '1px solid #dee2e6', // Ensure border is applied
                        color: '#051F50'
                    }}
                >
                    Description
                </th>
                <th
                    className="p-3"
                    scope="col"
                    style={{
                        fontSize: '0.8rem',
                        borderLeft: '1px solid #dee2e6', // Ensure border is applied
                        color: '#051F50'
                    }}
                >
                    Chat
                </th>
                <th
                    className="p-3"
                    scope="col"
                    style={{
                        fontSize: '0.8rem',
                        borderLeft: '1px solid #dee2e6', // Ensure border is applied
                        color: '#051F50'
                    }}
                >
                    File
                </th>
                <th
                    className="p-3"
                    scope="col"
                    style={{
                        fontSize: '0.8rem',
                        borderLeft: '1px solid #dee2e6', // Ensure border is applied
                        color: '#051F50'
                    }}
                >
                    Date
                </th>
                <th
                    className="p-3"
                    scope="col"
                    style={{
                        fontSize: '0.8rem',
                        borderLeft: '1px solid #dee2e6', // Ensure border is applied
                        color: '#051F50'
                    }}
                >
                    Status
                </th>
            </tr>
        </thead>
        <tbody style={{ fontSize: '0.8rem' }}>
            {fiteredData && fiteredData.length > 0 ? (
                fiteredData.map((item, index) => (
                    <tr key={index}>
                        <td style={{ borderLeft: '1px solid #dee2e6' }}>{index + 1}</td>
                        <td style={{ borderLeft: '1px solid #dee2e6' }}>{item?.Ticket}</td>
                        <td style={{ borderLeft: '1px solid #dee2e6' }}>{item?.Issue_type}</td>
                        <td style={{ borderLeft: '1px solid #dee2e6' }}>{item?.description}</td>
                        <td style={{ borderLeft: '1px solid #dee2e6' }}>
                            <img
                                src={chatIcon}
                                alt=""
                                width="20px"
                                onClick={() => navigateChate(item?._id)}
                            />
                        </td>
                        <td style={{ borderLeft: '1px solid #dee2e6' }}>{RemovePath(item?.file)}</td>
                        <td style={{ borderLeft: '1px solid #dee2e6' }}>{formatDate(item?.createdDate)}</td>
                        <td style={{ borderLeft: '1px solid #dee2e6' }}>
                            <p
                                style={{
                                    color:
                                        item?.status === 'solved'
                                            ? 'green'
                                            : item?.status === 'reject'
                                            ? 'red'
                                            : '#051F50'
                                }}
                            >
                                {toCamelCase_Name(
                                    item?.status === 'solved'
                                        ? 'Closed'
                                        : item?.status === 'reject'
                                        ? 'Rejected'
                                        : 'Opened'
                                )}
                            </p>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="8" style={{ textAlign: 'center', borderLeft: '1px solid #dee2e6' }}>
                        No data to show...
                    </td>
                </tr>
            )}
        </tbody>
    </Table>
</Row>
            </div>
        </>
    );
};

export default CandidateSupport;
