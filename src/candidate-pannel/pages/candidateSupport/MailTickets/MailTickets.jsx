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
import SendMails from '../Sendmail/SendMail';
import { CandidateSupportContext } from '../../../../context/candidateContext/CandidateSupportContext';
import BaseUrl from '../../../../services/BaseUrl';
import SearchIconS from '../../../../assets/images/SearchIconS.png';
import axios from 'axios';
import { Helmet } from 'react-helmet';
const MailTickets = () => {
    const {
        mailModelShow,
        setMailModelShow,
        RemovePath,
        formatDate,
        toCamelCase_Name,
        getAllMails,
        mailData,
        setMailData,
        loading,
        setLoading
    } = useContext(CandidateSupportContext);
    const [SeacrhInput, SetSeacrhInput] = useState('');
     const [activeButton, setActiveButton] = useState('pending');

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

    const supportDatas = mailData || [];
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
        getAllMails();
    }, []);

    const handleToggle = (buttonName) => {
        setActiveButton(buttonName === activeButton ? '' : buttonName);
    };
    return (
        <>
            <Helmet>
                <title>Mail Support</title>
                <meta
                    name="description"
                    content="Find your dream job on our platform."
                />
                <meta
                    name="keywords"
                    content="jobs, career, search jobs, employment"
                />
            </Helmet>
            <Modal
                show={mailModelShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => setMailModelShow(false)}
                dialogClassName="add-modal-width"
            >
                <SendMails />
            </Modal>



            <div className="support mt-2">
    <div className="Search-support">
        <div className="top-row">
            <OverlayTrigger placement="bottom" overlay={SendMail}>
                <Button
                    size="sm"
                    className="add-issue-btn"
                    onClick={() => setMailModelShow(true)}
                >
                    Send Mail +
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
        </div>

        {/* Toggle Buttons */}
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

    {/* Table Section */}
    <Row className="mt-2">
        {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <span>Loading...</span>
            </div>
        ) : (
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
                                borderLeft: 'none',
                                color: '#051F50'
                            }}
                            className="p-3"
                            scope="col"
                        >
                            Sr. No
                        </th>
                        <th
                            className="p-3"
                            scope="col"
                            style={{
                                fontSize: '0.8rem',
                                color: '#051F50'
                            }}
                        >
                            Tickets
                        </th>
                        <th
                            className="p-3"
                            scope="col"
                            style={{
                                fontSize: '0.8rem',
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
                                <td>{index + 1}</td>
                                <td>{item?.Ticket}</td>
                                <td>{item?.Issue_type}</td>
                                <td>{item?.description}</td>
                                <td>{RemovePath(item?.file)}</td>
                                <td>{formatDate(item?.createdDate)}</td>
                                <td>
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
                            <td colSpan="7" style={{ textAlign: 'center' }}>
                                No data to show...
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        )}
    </Row>
</div>
        </>
    );
};

export default MailTickets;
