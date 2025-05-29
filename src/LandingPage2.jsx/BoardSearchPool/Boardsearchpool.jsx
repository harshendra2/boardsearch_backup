import React, { useEffect, useState, useRef } from 'react';
import './BoardSearchpool.css';
import Ellipse from '../../assets/images/Ellipse6.png';
import Ellipse7 from '../../assets/images/Ellipse7.png';
import Region_Wise from "../../assets/images/Region_Wise.png"
import marketdonutwithshadow from "../../assets/images/marketdonutwithshadow.png"
import DomainWisedonutwithshadow from "../../assets/images/DomainWisedonutwithshadow.png"
import { Container, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";

const BoardSearchpool = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isListVisible, setIsListVisible] = useState(false);
    const firstImageRef = useRef(null);
    const firstListRef = useRef(null);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 767.98);
            setIsTablet(window.innerWidth <= 991.98 && window.innerWidth > 767.98);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        if (!isMobile && !isTablet) {
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
                window.removeEventListener('resize', checkScreenSize);
            };
        }
    }, [isMobile, isTablet]);

    const [SecondisVisible, setSecondIsVisible] = useState(false);
    const [SecondListVisible, setSecondListVisible] = useState(false);
    const SecondImageRef = useRef(null);
    const SecondListRef = useRef(null);

    useEffect(() => {
        if (!isMobile && !isTablet) {
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
    }, [isMobile, isTablet]);
        
    const [ThiredisVisible, setThiredIsVisible] = useState(false);
    const [ThiredListVisible, setThiredListVisible] = useState(false);
    const ThiredImageRef = useRef(null);
    const ThiredListRef = useRef(null);

    useEffect(() => {
        if (!isMobile && !isTablet) {
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
    }, [isMobile, isTablet]);

    return(
        <>
            <div className="ellipse-top">
                <img src={Ellipse} alt="decorative ellipse" className="ellipse-img" />
            </div>
            <div className="ellipse-bottom">
                <img src={Ellipse} alt="decorative ellipse" className="ellipse-img" />
            </div>
            
            <Container className='recent-app board-search-container'>
                <div className='headding-body'>
                    <p className="headding">
                        BoardSearch Pool Insights
                        <svg viewBox="0 0 100 2" preserveAspectRatio="none">
                            <rect width="100" height="2" />
                        </svg>
                    </p>
                </div>
                
                <div className="content-wrapper" style={{marginTop:"-40px"}}>
                    {/* Region Wise */}
                    <div className="BoardSearch_data">
                        <div ref={firstImageRef} className={`First_images ${(isMobile || isTablet || isVisible) ? "animate" : ""}`}>
                            <img src={Region_Wise} className='PoolImage' alt="Region Wise Profiles Availability"/>
                        </div>
                        {!isMobile && !isTablet && (
                            <div className='divider'></div>
                        )}
                        <div style={{ textAlign: "left",display:"flex",flexDirection:"column"}} ref={firstListRef}
                            className={`First_list ${(isMobile || isTablet || isListVisible) ? "animate" : ""}`}>
                           <div>
                             <p className="section-title">
                                Region Wise Profiles Availability
                            </p>
                           </div>
                            <div>
                                <ul className="data-list1">
                                <li><span className="highlight">United Kingdom</span> - 17%</li>
                                <li><span className="highlight">United States of America</span> - 22%</li>
                                <li><span className="highlight">India</span> - 15%</li>
                                <li><span className="highlight">Europe</span> - 18%</li>
                                <li><span className="highlight">Australia & New Zealand</span> - 8%</li>
                                <li><span className="highlight">Africa</span> - 10%</li>
                                <li><span className="highlight">Middle East</span> - 10%</li>
                            </ul>
                            </div>
                        </div>
                    </div>

                    {/* Skill Wise */}
                    <div className="BoardSearch_datas">
                        <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }} ref={SecondListRef}
                            className={`Second_list ${(isMobile || isTablet || SecondListVisible) ? "animate" : ""}`}>
                          <div>
                              <p className='section-title'>
                                Skillwise Profiles Availability
                            </p>
                          </div>
                          <div>
                              <ul className="data-list2">
                                <li><span className="highlight">Marketing & Brand Management</span> - 7%</li>
                                <li><span className="highlight">Finance & Investment Strategy</span> - 6%</li>
                                <li><span className="highlight">Sales & Business Development</span> - 10%</li>
                                <li><span className="highlight">Data Science & Analytics</span> - 8%</li>
                                <li><span className="highlight">Technology & Digital Transformation</span> - 9%</li>
                                <li><span className="highlight">Human Resources & Talent Management</span> - 10%</li>
                                <li><span className="highlight">Legal & Corporate Governance</span> - 12%</li>
                                <li><span className="highlight">Strategy & Management Consulting</span> - 7%</li>
                                <li><span className="highlight">Product Management & Innovation</span> - 5%</li>
                                <li><span className="highlight">Risk Management & Compliance</span> - 7%</li>
                                <li><span className="highlight">Cybersecurity & IT Governance</span> - 11%</li>
                                <li><span className="highlight">Operations & Supply Chain Management</span> - 8%</li>
                            </ul>
                          </div>
                        </div>
                        {!isMobile && !isTablet && (
                            <div className='divider'></div>
                        )}
                        <div ref={SecondImageRef}
                                className={`Image-container ${(isMobile || isTablet || SecondisVisible) ? "animate" : ""}`} >
                            <img src={marketdonutwithshadow} className='PoolImages' alt="Skillwise Profiles Availability"/>
                        </div>
                    </div>

                    {/* Domain Wise */}
                    <div className="BoardSearch_datass">
                        <div ref={ThiredImageRef}
                                className={`Thired-Image-container ${(isMobile || isTablet || ThiredisVisible) ? "animate" : ""}`} >
                            <img src={DomainWisedonutwithshadow} className='PoolImages' alt="Domain Wise Profiles Availability"/>
                        </div>
                        {!isMobile && !isTablet && (
                            <div className='divider'></div>
                        )}
                        <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }} ref={ThiredListRef}
                            className={`Thired_list ${(isMobile || isTablet || ThiredListVisible) ? "animate" : ""}`}>
                          <div>
                              <p className="section-title">
                                Domain wise Profiles Availability
                            </p>
                          </div>
                            <div>
                                <ul className="data-list3">
                                <li><span className="highlight">Finance & Banking</span> - 8%</li>
                                <li><span className="highlight">Technology & IT Services</span> - 26%</li>
                                <li><span className="highlight">Energy & Utilities</span> - 13%</li>
                                <li><span className="highlight">Manufacturing</span> - 17%</li>
                                <li><span className="highlight">Retail & E-commerce</span> - 19%</li>
                                <li><span className="highlight">Hospitality & Tourism</span> - 5%</li>
                                <li><span className="highlight">Other</span> - 6%</li>
                
                            </ul>
                            
                            
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            
            <div className="ellipse-left">
                <img src={Ellipse7} alt="decorative ellipse" className="ellipse-img" />
            </div> 
            <div className="ellipse-lefts">
                <img src={Ellipse7} alt="decorative ellipse" 
                 />
            </div> 
        </>
    )
}

export default BoardSearchpool;