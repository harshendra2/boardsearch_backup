import React, { useEffect, useState } from 'react';
import './support.css';
import {
    Button,
    Modal,
    Row,
    Col,
    Table,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';
import SearchIconS from '../../../assets/images/SearchIconS.png';
import chatIcon from '../../../assets/images/chatIcon.png';
import { useNavigate } from 'react-router-dom';
import { useSupport } from '../../../context/SupportContext';
import Addissue from './addIssue/Addissue';
import SendMail from './Sendmail/SendMail';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import { Helmet } from 'react-helmet';
//const socket=io('http://localhost:4000');
//const socket = io('http://65.20.91.47:4000');
const socket=io('https://boardsearch.ai')

const Support = () => {
    const {
        fetch_all_issue,
        data,
        modalShow,
        setModalShow,
        mailModelShow,
        setMailModelShow,
        setData
    } = useSupport();
    const [SeacrhInput, SetSeacrhInput] = useState('');
   const [activeButton, setActiveButton] = useState('pending');
    const navigate = useNavigate();
    function navigateChate(id) {
        navigate(`/chat-page/${id}`);
    }

    const formatDate = dateString => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options); // 'en-GB' for DD/MM/YYYY format
    };


    const supportDatas = data || [];
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

    useEffect(() => {
        fetch_all_issue();
    }, []);

    function rendering() {
        const render = localStorage.getItem('render');

        if (render == 'company') {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                navigate('/login');
            } else {
                navigate('/main/support');
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

    const SendMails = props => (
        <Tooltip id="save-tooltip" {...props}>
            Click this button to send an email directly to the support team.
        </Tooltip>
    );

    const AddIssue = props => (
        <Tooltip id="save-tooltip" {...props}>
            Click this button to report your issue directly to the support team.
        </Tooltip>
    );
    useEffect(() => {
        const token = localStorage.getItem('companyToken');
        const decodedToken = jwtDecode(token);
        const company_id = decodedToken?._id;
        socket.connect();
        socket.emit('ViewNewMessage', company_id);
        socket.emit('messageNotification', company_id);
        socket.on('disconnect', () => {
        });

        return () => {
            socket.off('notification');
            socket.disconnect();
        };
    }, []);
    useEffect(() => {
        fetch_all_issue();
        return () => {
            setData([]);
        };
    }, []);

    const handleToggle = (buttonName) => {
        setActiveButton(buttonName === activeButton ? '' : buttonName);
    };

    return (
        <>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Support</title>
            <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <Modal
            show={modalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => setModalShow(false)}
            dialogClassName="add-modal-width"
        >
            <Addissue />
        </Modal>
        <Modal
            show={mailModelShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => setMailModelShow(false)}
            dialogClassName="add-modal-width"
        >
            <SendMail />
        </Modal>
        <div className="support">
            <Row>
                <div className="Search-support">
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
                            onChange={e => SetSeacrhInput(e.target.value)}
                        />
                    </div>
    
                    <Row style={{ paddingLeft: '24px' }}>
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
            </Row>
    
            <Row
                className="mt-2"
                style={{
                    borderRadius: '12px',
                    background: '#fff',
                    marginLeft: '2px',
                    marginTop: '20px'
                }}
            >
                <Table striped bordered responsive className="custom-table">
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

export default Support;
