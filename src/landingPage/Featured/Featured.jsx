import React, { useEffect, useRef } from 'react';
import './featured.css';
import { Button, Image } from 'react-bootstrap';
import Featured_left from '../../assets/images/Featured_left.png';
import listIcon from '../../assets/images/listIcon.png';
import featured_right from '../../assets/images/featured_right.png';

function Featured() {
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (entry.target === leftRef.current) {
                            entry.target.classList.add('slide-in-left');
                        } else if (entry.target === rightRef.current) {
                            entry.target.classList.add('slide-in-right');
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
            }
        );

        if (leftRef.current) {
            observer.observe(leftRef.current);
        }
        if (rightRef.current) {
            observer.observe(rightRef.current);
        }

        return () => {
            if (leftRef.current) {
                observer.unobserve(leftRef.current);
            }
            if (rightRef.current) {
                observer.unobserve(rightRef.current);
            }
        };
    }, []);

    return (
        <>
            <div className="featured-container">
                <div className="featured-h1">
                    <h2>AI-Powered Search</h2>
                    <p>AI-Powered Search to Match Jobs with Talent</p>
                </div>
                <div className="featred-main">
                    <div className="featured-left" ref={leftRef}>
                        <div className="featured-left-contents">
                            <h4>FOR CANDIDATE</h4>
                            <ul>
                                <li>
                                    <img src={listIcon} alt="" />
                                    Tailored Job Recommendations
                                </li>
                                <li>
                                    {' '}
                                    <img src={listIcon} alt="" />
                                    Discover Relevant Roles
                                </li>
                                <li>
                                    {' '}
                                    <img src={listIcon} alt="" />
                                    Save Time
                                </li>
                                <li>
                                    {' '}
                                    <img src={listIcon} alt="" />
                                    Stay Updated
                                </li>
                            </ul>
                        </div>
                        <div className="featured-left-image">
                            <Image
                                src={Featured_left}
                                rounded
                                alt="Rounded"
                                width="100%"
                            />
                        </div>
                    </div>
                    <div className="featured-left" ref={rightRef}>
                        <div className="featured-left-contents">
                            <h4>FOR COMPANIES</h4>
                            <ul>
                                <li>
                                    <img src={listIcon} alt="" />
                                    Find Top Talent Quickly
                                </li>
                                <li>
                                    {' '}
                                    <img src={listIcon} alt="" />
                                    Enhanced Candidate Filtering
                                </li>
                                <li>
                                    {' '}
                                    <img src={listIcon} alt="" />
                                    Reduce Hiring Time
                                </li>

                                <li>
                                    {' '}
                                    <img src={listIcon} alt="" />
                                    Continuous Improvement
                                </li>
                            </ul>
                        </div>
                        <div className="featured-left-image">
                            <Image
                                src={featured_right}
                                rounded
                                alt="Rounded"
                                width="100%"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Featured;