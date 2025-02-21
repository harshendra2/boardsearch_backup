import React, { useEffect, useState } from 'react';
import SendMail from '../Sendmail/SendMail';

import {
    Button,
    Modal,
    OverlayTrigger,
    Row,
    Col,
    Table,
    Tooltip
} from 'react-bootstrap';
import { useSupport } from '../../../../context/SupportContext';
import SearchIconS from '../../../../assets/images/SearchIconS.png';
const CompanyMailTickets = () => {
    const {
        mailData,
        modalShow,
        setModalShow,
        mailModelShow,
        setMailModelShow,
        formatDate,
        toCamelCase_Name,
        RemovePath,
        setMailData,
        fetchCompanyMails
    } = useSupport();
    const [SeacrhInput, SetSeacrhInput] = useState('');
    const [activeButton, setActiveButton] = useState('pending');


    const supportDatas = mailData || [];
    let allData =supportDatas.filter(item => {
        return (
            item?.status && activeButton &&
            item.status.toLowerCase().includes(activeButton.toLowerCase())
        );
    });

   
    let tempData=allData||[]
    const filteredData = tempData.filter(item => {
        return (
            item.Issue_type.toLowerCase().includes(SeacrhInput.toLowerCase())
        ) || (
            item.Ticket.toLowerCase().includes(SeacrhInput.toLowerCase())
        );
    });



    const SendMails = props => (
        <Tooltip id="save-tooltip" {...props}>
            Click this button to send an email directly to the support team.
        </Tooltip>
    );

    useEffect(() => {
        const fun = async () => {
            await fetchCompanyMails();
        };
        fun();
    }, []);

    const handleToggle = (buttonName) => {
        setActiveButton(buttonName === activeButton ? '' : buttonName);
    };

    return (
        <>
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
                    <OverlayTrigger placement="bottom" overlay={SendMails}>
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
                            name="SeacrhInput"
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
    
            <Row className="mt-2">
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
                                className="p-3"
                                scope="col"
                                style={{
                                    fontSize: '0.8rem',
                                    borderLeft: '1px solid #dee2e6', // Ensure border is applied
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
                        {filteredData && filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ borderLeft: '1px solid #dee2e6' }}>{index + 1}</td>
                                    <td style={{ borderLeft: '1px solid #dee2e6' }}>{item?.Ticket}</td>
                                    <td style={{ borderLeft: '1px solid #dee2e6' }}>{item?.Issue_type}</td>
                                    <td style={{ borderLeft: '1px solid #dee2e6' }}>{item?.description}</td>
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
                                <td colSpan="7" style={{ textAlign: 'center', borderLeft: '1px solid #dee2e6' }}>
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

export default CompanyMailTickets;
