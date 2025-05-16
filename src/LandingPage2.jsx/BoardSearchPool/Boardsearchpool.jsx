import React, { useEffect,useState,useRef} from 'react';
import './BoardSearchpool.css';
import Ellipse from '../../assets/images/Ellipse6.png';
import Ellipse7 from '../../assets/images/Ellipse7.png';
import Region_Wise from "../../assets/images/Region_Wise.png"
import marketdonutwithshadow from "../../assets/images/marketdonutwithshadow.png"
import DomainWisedonutwithshadow from "../../assets/images/DomainWisedonutwithshadow.png"
import { Container,Image} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";

const BoardSearchpool=()=>{
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isListVisible, setIsListVisible] = useState(false);
    const firstImageRef = useRef(null);
    const firstListRef = useRef(null);

    useEffect(() => {
        // Check if mobile on component mount
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 575.98);
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        if (!isMobile) {
            AOS.init({ duration: 1000 });

            const imageObserver = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                },
                { threshold: 0.2 }
            );

            const listObserver = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsListVisible(true);
                    }
                },
                { threshold: 0.2 }
            );

            if (firstImageRef.current) {
                imageObserver.observe(firstImageRef.current);
            }
            if (firstListRef.current) {
                listObserver.observe(firstListRef.current);
            }

            return () => {
                if (firstImageRef.current) {
                    imageObserver.unobserve(firstImageRef.current);
                }
                if (firstListRef.current) {
                    listObserver.unobserve(firstListRef.current);
                }
                window.removeEventListener('resize', checkIfMobile);
            };
        }
    }, [isMobile]);

    const [SecondisVisible, setSecondIsVisible] = useState(false);
    const [SecondListVisible, setSecondListVisible] = useState(false);
    const SecondImageRef = useRef(null);
    const SecondListRef = useRef(null);

    useEffect(() => {
        if (!isMobile) {
            AOS.init({ duration: 1000 });

            const imageObserver = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setSecondIsVisible(true);
                    }
                },
                { threshold: 0.2 }
            );

            const listObserver = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setSecondListVisible(true);
                    }
                },
                { threshold: 0.2 }
            );

            if (SecondImageRef.current) {
                imageObserver.observe(SecondImageRef.current);
            }
            if (SecondListRef.current) {
                listObserver.observe(SecondListRef.current);
            }

            return () => {
                if (SecondImageRef.current) {
                    imageObserver.unobserve(SecondImageRef.current);
                }
                if (SecondListRef.current) {
                    listObserver.unobserve(SecondListRef.current);
                }
            };
        }
    }, [isMobile]);
        
    const [ThiredisVisible, setThiredIsVisible] = useState(false);
    const [ThiredListVisible, setThiredListVisible] = useState(false);
    const ThiredImageRef = useRef(null);
    const ThiredListRef = useRef(null);

    useEffect(() => {
        if (!isMobile) {
            AOS.init({ duration: 1000 });

            const imageObserver = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setThiredIsVisible(true);
                    }
                },
                { threshold: 0.2 }
            );

            const listObserver = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setThiredListVisible(true);
                    }
                },
                { threshold: 0.2 }
            );

            if (ThiredImageRef.current) {
                imageObserver.observe(ThiredImageRef.current);
            }
            if (ThiredListRef.current) {
                listObserver.observe(ThiredListRef.current);
            }

            return () => {
                if (ThiredImageRef.current) {
                    imageObserver.unobserve(ThiredImageRef.current);
                }
                if (ThiredListRef.current) {
                    listObserver.unobserve(ThiredListRef.current);
                }
            };
        }
    }, [isMobile]);

    return(
        <>
         <div style={{width:'100%', display:'flex',justifyContent:'end',position:"absolute",marginTop:"-10px"}}>
            <img src={Ellipse} width="130px" />
        </div>
        <div style={{width:'100%', display:'flex',justifyContent:'end',position:"absolute",marginTop:"76rem"}}>
            <img src={Ellipse} width="130px" />
        </div>
        <Container className='recent-app' style={{ zIndex: 1,marginTop:'-80px' }}>
            <div className='headding-body'>
                <p className="headding" style={{ fontFamily: "Poppins" }}>
                BoardSearch Pool Insights
                    <svg viewBox="0 0 100 2" preserveAspectRatio="none">
                        <rect width="100" height="2" />
                    </svg>
                </p>
            </div>
            <div>
                <div className="BoardSearch_data">
                    <div ref={firstImageRef}
                        className={`First_images ${isMobile || isVisible ? "animate" : ""}`}>
                        <img src={Region_Wise} className='PoolImage'/>
                    </div>
                    <div className='divider' style={{ backgroundColor: "#1E3449", width: "1.5px", height: "350px" }}></div>
                    <div style={{ textAlign: "center" }} ref={firstListRef}
                        className={`First_list ${isMobile || isListVisible ? "animate" : ""}`}>
                        <p style={{
                            color: '#1E3449',
                            fontFamily: "Nunito Sans", 
                            fontSize: "22px",
                            fontWeight: '900'
                        }}>
                            Region Wise Profiles Availability
                        </p>
                        <ul style={{
                            color: '#1E3449',
                            fontFamily: "Nunito Sans", 
                            fontSize: "18px",
                            textAlign: "left",
                            lineHeight:"2"
                        }}>
                            <li><span style={{fontWeight:"bolder"}}>United Kingdom</span> - 17%</li>
                            <li><span style={{fontWeight:"bolder"}}>United States of America</span> - 22%</li>
                            <li><span style={{fontWeight:"bolder"}}>India </span> - 15%</li>
                            <li><span style={{fontWeight:"bolder"}}>Europe</span> - 18%</li>
                            <li><span style={{fontWeight:"bolder"}}>Australia & New Zealand</span> - 8%</li>
                            <li><span style={{fontWeight:"bolder"}}>Africa</span> - 10%</li>
                            <li><span style={{fontWeight:"bolder"}}>Middle East</span> - 10%</li>
                        </ul>
                    </div>
                </div>

                {/* Skill wise profile availability */}
                <div className="BoardSearch_datas">
                    <div style={{ textAlign: "center" }} ref={SecondListRef}
                        className={`Second_list ${isMobile || SecondListVisible ? "animate" : ""}`}>
                        <h1  className='headding_text' style={{
                            color: '#1E3449',
                            fontFamily: "Nunito Sans", 
                            fontSize: "22px",
                            fontWeight: '900'
                        }} >
                            Skillwise Profiles Availability
                        </h1>
                        <ul style={{
                            color: '#1E3449',
                            fontFamily: "Nunito Sans", 
                            fontSize: "18px",
                            textAlign: "left",
                                lineHeight:"2"
                        }}>
                            <li><span style={{fontWeight:"bolder"}}>Marketing & Brand Management</span> - 7%</li>
                            <li><span style={{fontWeight:"bolder"}}>Finance & Investment Strategy</span> - 6%</li>
                            <li><span style={{fontWeight:"bolder"}}>Sales & Business Development</span> - 10%</li>
                            <li><span style={{fontWeight:"bolder"}}>Data Science & Analytics</span> - 8%</li>
                            <li><span style={{fontWeight:"bolder"}}>Technology & Digital  Transformation</span> - 9%</li>
                            <li><span style={{fontWeight:"bolder"}}>Human Resources & Talent Management</span> - 10%</li>
                            <li><span style={{fontWeight:"bolder"}}>Legal & Corporate Governance</span> - 12%</li>
                            <li><span style={{fontWeight:"bolder"}}>Strategy & Management Consulting</span> - 7%</li>
                            <li><span style={{fontWeight:"bolder"}}>Product Management & Innovation</span> - 5%</li>
                            <li><span style={{fontWeight:"bolder"}}>Risk Management & Compliance</span> - 7%</li>
                            <li><span style={{fontWeight:"bolder"}}>Cybersecurity & IT Governance</span> - 11%</li>
                            <li><span style={{fontWeight:"bolder"}}>Operations & Supply Chain  Management</span> - 8%</li>
                        </ul>
                    </div>
                    <div className='divider' style={{ backgroundColor: "#1E3449", width: "1.9px", height: "400px" }}></div>
                
                    <div ref={SecondImageRef}
                            className={`Image-container ${isMobile || SecondisVisible ? "animate" : ""}`} >
                        <img src={marketdonutwithshadow} className='PoolImages'/>
                    </div>
                </div>

                {/* Domain wise Profiles Availability */}
                <div className="BoardSearch_datass">
                    <div ref={ThiredImageRef}
                            className={`Thired-Image-container ${isMobile || ThiredisVisible ? "animate" : ""}`} >
                        <img src={DomainWisedonutwithshadow} className='PoolImages'/>
                    </div>
                    <div className='divider' style={{ backgroundColor: "#1E3449", width: "1.5px", height: "350px" }}></div>
                    
                    <div style={{ textAlign: "center" }} ref={ThiredListRef}
                        className={`Thired_list ${isMobile || ThiredListVisible ? "animate" : ""}`}>
                        <h1 style={{
                            color: '#1E3449',
                            fontFamily: "Nunito Sans", 
                            fontSize: "22px",
                            fontWeight: '900'
                        }}>
                        Domain wise 
                        Profiles Availability
                        </h1>
                        <ul style={{
                            color: '#1E3449',
                            fontFamily: "Nunito Sans", 
                            fontSize: "18px",
                            textAlign: "left",
                                lineHeight:"2"
                        }}>
                            <li><span style={{fontWeight:"bolder"}}>Finance & Banking</span> - 8%</li>
                            <li><span style={{fontWeight:"bolder"}}>Technology & IT Services</span> - 26%</li>
                            <li><span style={{fontWeight:"bolder"}}>Energy & Utilities</span> - 13%</li>
                            <li><span style={{fontWeight:"bolder"}}>Manufacturing</span> - 17%</li>
                            <li><span style={{fontWeight:"bolder"}}>Retail & E-commerce</span> - 19%</li>
                            <li><span style={{fontWeight:"bolder"}}>Hospitality & Tourism</span> - 5%</li>
                            <li><span style={{fontWeight:"bolder"}}>Other</span> - 6%</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Container>
        <div style={{width:'100%', display:'flex',justifyContent:'start',position:"absolute",marginTop:"-700px"}}>
            <img src={Ellipse7} width="130px" />
        </div> 
        </>
    )
}

export default BoardSearchpool;