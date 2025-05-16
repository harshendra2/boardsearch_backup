import React from 'react';
import './Navbar.css';
import { Button, Image } from 'react-bootstrap';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import favIcon from '../../assets/images/Boardsearchverticallogo.png';
const Navbar = () => {
    const navigate = useNavigate();
    return (
            <div className="navBar_temp">
                <Image src={favIcon} rounded alt="Rounded" height='65px'/> 
                <div className="nav-bar-top-right">
                    <Button className="Login_Button bg-#1E3449 text-white hover: #162a3d-800" onClick={() => navigate('/login')}>Login</Button>
                    <Button  className="Login_Button bg-#1E3449 text-white hover: #162a3d-800" onClick={() => navigate('/registration')}>Sign Up</Button>
                </div>
            </div>
    );
};

export default Navbar;
