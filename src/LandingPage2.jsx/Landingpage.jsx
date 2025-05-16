import React, { useEffect } from 'react';
import './Landingpage.css';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import Homes from './Homes/Homes';
import RecentApplication from './RecentApplication/Recentappl'
import BoardSearchpool from './BoardSearchPool/Boardsearchpool';
import LanddingPageForm from './Form/Form'
import Body from './Body/Body'
import Footer from './Footer/footer';
const Landingpage = () => {
    const navigate = useNavigate();
    function rendering() {
        const render = localStorage.getItem('render');

        if (render == 'candidate') {
            const token = localStorage.getItem('Candidate_token');
            if (token) {
                navigate('/candidate-dashboard/search-job');
            }
        } else if (render == 'company') {
            const token = localStorage.getItem('companyToken');
            if (token) {
                navigate('/main/dashboard');
            }
        }
    }

    useEffect(() => {
        rendering();
    }, []);


    return (
         <div style={{ background: 'white'}}>
            <Container style={{ background: 'white', paddingTop:"17px",height:'auto'}}>
                <Navbar />
            </Container>
            <div className="container-background">
            <Homes />
            </div>
            <RecentApplication/>
            <BoardSearchpool/>
            <div  className='body-container'>
            <Body/>
            </div>
       <LanddingPageForm/>
       <Footer/>
        </div>
    );
};

export default Landingpage;
