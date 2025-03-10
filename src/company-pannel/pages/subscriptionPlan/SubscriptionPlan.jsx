import React, { useEffect, useState } from 'react';
import './subscription.css';
import { Button, Row } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { initGA, trackEvent } from "../../../analytics";
const SubscriptionPlan = () => {
    const [activeButton, setActiveButton] = useState('subscription');
    const naviagte = useNavigate();

    const handle_navigate = data => {
        setActiveButton(data);
        naviagte(data);
    };

    // Inline styles for active and inactive buttons
    const activeStyle = {
        backgroundColor: '#B4DDFF', // Change this to your desired active color
        color: '#3B96E1' // Optional: Change text color
    };

    const inactiveStyle = {
        backgroundColor: 'transparent', // Original background color
        color: 'black' // Original text color
    };

    function rendering() {
        const render = localStorage.getItem('render');

        if (render == 'company') {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                naviagte('/login');
            } else {
                naviagte('/main/subscription-plan/subscription');
            }
        } else {
            naviagte('/login');
        }
    }

    useEffect(() => {
        rendering();
    }, []);

    useEffect(() => {
        initGA();  // Initialize Google Analytics
        trackEvent("Button", "Subscription", "BoardSearch Company");
      }, []);
      
    return (
        <div className="sub-scription">
              <Helmet>
                            <meta charSet="utf-8" />
                            <title>Subscription Plan</title>
                            <link rel="canonical" href="http://mysite.com/example" />
                        </Helmet>
            <Row>
                <div className="top-btns">
                    <div className="btn-center">
                        <Button
                            size="sm"
                            className="subtns"
                            style={
                                activeButton === 'subscription'
                                    ? activeStyle
                                    : inactiveStyle
                            }
                            onClick={() => handle_navigate('subscription')}
                        >
                            Subscription Plans
                        </Button>
                        <Button
                            size="sm"
                            className="subtns"
                            style={
                                activeButton === 'top-ups'
                                    ? activeStyle
                                    : inactiveStyle
                            }
                            onClick={() => handle_navigate('top-ups')}
                        >
                            Top-Up
                        </Button>
                    </div>
                </div>
            </Row>
            <Outlet />
        </div>
    );
};

export default SubscriptionPlan;
