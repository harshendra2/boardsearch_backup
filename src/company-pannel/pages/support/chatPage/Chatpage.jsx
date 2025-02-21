import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import arrow_back from '../../../../assets/images/arrow_back.png';
import chatuser from '../../../../assets/images/chatuser.png';
import avatar from '../../../../assets/images/avatar.png';
import './chatpage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
//const socket = io('http://localhost:4000');
//const socket = io('http://65.20.91.47:4000');
const socket = io('https://boardsearch.ai');
const Chatpage = () => {
    const { id } = useParams();

    const navigateBack = useNavigate();
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [timeStamp, settimeStamp] = useState('');

    const token = localStorage.getItem('companyToken');
    const decodedToken = jwtDecode(token);
    const companyId = decodedToken?._id;

    const formatDateTime = dateString => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            // second: '2-digit',
            hour12: true // Use 24-hour format; set to true for 12-hour format with AM/PM
        };
        return new Date(dateString).toLocaleString('en-GB', options); // 'en-GB' for DD/MM/YYYY HH:mm:ss format
    };

    const chatContainerRef = useRef(null);
    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [chat]);

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            socket.emit('getAllMessage', id);
        });

        socket.on('chat', receivedMessages => {
            setChat(receivedMessages);
        });

        socket.on('message', newMessage => {
        });

        const messageListener = newMessage => {
            setChat(prevMessages => [...prevMessages, newMessage]);
        };

        socket.on('message', messageListener);

        socket.on('disconnect', () => {
        });

        return () => {
            socket.off('message', messageListener);
            socket.disconnect();
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim() == '') {
            toast.error('Please enter a message in the chat input box');
        } else {
            const timestamps = new Date();
            const data = {
                refference_id: companyId,
                Issue_id: id,
                message: message,
                User_view:true
            };
            socket.emit('newMessage', data);
            socket.emit('adminMessagNot');
            setMessage('');
            settimeStamp(timestamps);
        }
    };

    const handleInputChange = e => {
        setMessage(e.target.value);
    };
    return (
        <>
            <div className="Chatpage">
                <div className="chatCenter">
                    <div className="arrowback" onClick={() => navigateBack(-1)}>
                        <img src={arrow_back} alt="" width="24px" />
                    </div>

                    <div className="chatdiv">
                        {/* <div className="chat-top-section">
                            <p>
                                Issue ID: <span>85</span>
                            </p>
                            <p>
                                Issue Date: <span>12/09/2024</span>
                            </p>
                            <p>
                                Issue Type: <span>85</span>
                            </p>
                            <br />
                        </div> */}
                        <p className="description-s">Issue Description:</p>
                        {/* <h3 className="h3-date">April: 24</h3> */}
                        <div className="showchat-div" ref={chatContainerRef}>
                            {chat &&
                                chat?.map((item, index) => (
                                    <>
                                        {item?.refference_id === companyId ? (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        item?.refference_id ===
                                                        companyId
                                                            ? 'flex-end'
                                                            : 'flx-start'
                                                }}
                                            >
                                                <div>
                                                    <div className="show_img1">
                                                        <p>You</p>
                                                        <div className="show_profile">
                                                            <img
                                                                src={chatuser}
                                                                alt=""
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="show_message1">
                                                        <p>{item?.message} </p>
                                                    </div>
                                                    <h5
                                                        style={{
                                                            fontSize: '0.6rem',
                                                            color: 'gray',
                                                            marginTop: '-10px',
                                                            textAlign: 'end',
                                                            marginRight: '32px'
                                                        }}
                                                    >
                                                        {formatDateTime(
                                                            item?.timestamp
                                                        )}
                                                    </h5>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        item?.refference_id ===
                                                        companyId
                                                            ? 'flex-end'
                                                            : 'flx-start'
                                                }}
                                            >
                                                <div>
                                                    <div className="show_img">
                                                        <div className="show_profile">
                                                            <img
                                                                src={chatuser}
                                                                alt=""
                                                            />
                                                        </div>

                                                        <p>Adim</p>
                                                    </div>
                                                    <div className="show_message">
                                                        <p>{item?.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ))}
                        </div>
                        <div className="chatinput">
                            <input
                                type="text"
                                placeholder="write a message..."
                                value={message}
                                onChange={handleInputChange}
                            />
                            <Button
                                size="sm"
                                style={{
                                    background: '#3B96E1',
                                    padding: '4px 18px'
                                }}
                                onClick={handleSendMessage}
                            >
                                send
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatpage;
