import React from 'react';
import './Navbar.css';
import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import favIcon from '../../assets/images/Boardsearchverticallogo.png';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="navBar_temp">
            <div className="nav-bar-brand">
                <Image src={favIcon} alt="Logo" className="nav-logo" /> 
            </div>
            <div className="nav-bar-top-right">
                <Button 
                    variant="primary" 
                    className="nav-button" 
                    onClick={() => navigate('/login')}
                >
                    Login
                </Button>
                <Button  
                    variant="primary" 
                    className="nav-button" 
                    onClick={() => navigate('/registration')}
                >
                    Sign Up
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;