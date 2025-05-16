import React, { useEffect, useState } from 'react';
import { Button, Image,Container} from 'react-bootstrap';
import '@fontsource/poppins';
import './Homes.css';
import HeroSection from '../../assets/images/HeroSection.png';
import { useNavigate } from 'react-router-dom';
import CountUp from "react-countup";
const Homes= () => {
    const navigate = useNavigate();

    const [startAnimation, setStartAnimation] = useState(false);

    // Trigger animation when the component is in the viewport
    useEffect(() => {
      const handleScroll = () => {
        const element = document.querySelector(".home-counts");
        if (element) {
          const top = element.getBoundingClientRect().top;
          if (top < window.innerHeight) {
            setStartAnimation(true);
          }
        }
      };
      handleScroll()
     
    }, []);

    return (
        <>
        <Container>
        <div className="home-conatiner">
                <div className="home-conatents">
                    <div className="home-p">
                        <p style={{fontWeight:'normal',marginTop:"-50px",fontFamily: "'Poppins', sans-serif",lineHeight: "1.2"}}>
                            <span style={{fontWeight:"bolder"}}>Find Top Jobs</span> and Hire 
                            Verified Talent with
                            <span style={{fontWeight:"bolder"}}> AI-Powered Solutions</span>
                        </p>
                    </div>
                    <div className="home-span">
                            <p style={{color:"#1E3449",fontFamily: "'Poppins', sans-serif", fontSize:'20px'}}>
                            Whether you're a candidate seeking your next
                            opportunity or a company looking for top talent, our
                            <span style={{fontWeight:'bolder'}}> AI-powered </span>
                            platform has you covered.
                            </p>
                    </div>
                    <div style={{height:"3rem"}}>

                    </div>
                    <div className="home-buttons">
                        <Button onClick={() => navigate('/login')}>
                            Explore Jobs
                        </Button>
                        <Button onClick={() => navigate('/login')}>
                            Post a Job Now
                        </Button>
                    </div>
                </div>
                <div className="home-image-left">
                    <Image src={HeroSection} rounded alt="Rounded" width="100%" />
                </div>
            </div>
        </Container>
        </>
    );
};

export default Homes;
