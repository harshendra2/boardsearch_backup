import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import './dashboard.css';
import carbon_send from '../../../assets/images/carbon_send.png';
import useDashboardData from '../../../hooks/company_dashboard/useDashboardData';
import CandidateHiredIcon from '../../../assets/images/CandidateHiredIcon.png';
import CandidateOnboardedIcon from '../../../assets/images/CandidateOnboardedIcon.png';
import building from '../../../assets/images/building.png';
import Calendar from '../../../assets/images/Calendar.png';
import shortListCount from '../../../assets/images/shortListCount.png';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BaseUrl from '../../../services/BaseUrl';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import BuyPlanDesign from './../../../components/BuyplanDesign/BuyPlanDesign';

const Dashboard = () => {
    const { data, loading, error, VerifyJob, verfifyOffer, sethide, hide } =
        useDashboardData();
    const yearStartISO = moment().startOf('year').toISOString();
    const yearEndISO = moment().endOf('year').toISOString();
    const navigate = useNavigate();
    const loacate = useLocation();
    const startRef = useRef();
    const [PAN, setPAN] = useState(null);
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [SelectedData, setSelectedData] = useState('All');
    const [dasboardData, setDashboardData] = useState(null);
    const [startDate, setStartDate] = useState(yearStartISO);
    const [EndDate, setEndDate] = useState(yearEndISO);

    // const handleVerifyJob = e => {
    //     e.preventDefault();
    //     VerifyJob(PAN);
    // };

    // const validatePAN = pan => {
    //     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    //     return panRegex.test(pan);
    // };

    // onChange handler for the input field
    // const handleChange = e => {
    //     const value = e.target.value.toUpperCase(); // Convert input to uppercase
    //     setPAN(value);

    //     // Validate the PAN and update validation status and error message
    //     if (value === '') {
    //         setErrorMessage(''); // Clear error message if input is empty
    //     } else if (validatePAN(value)) {
    //         setErrorMessage(''); // PAN is valid, no error message
    //     } else {
    //         setErrorMessage('PAN number format is invalid.'); // Set error message
    //     }
    // };

    const getSelectedData = async () => {
        const token = localStorage.getItem('companyToken');
        if (!token) {
            return;
        } else {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?._id;
            try {
                const response = await axios.get(
                    `${BaseUrl}company/subscription/count/${userId}/${startDate}/${EndDate}`
                );
                setDashboardData(response?.data);
            } catch (error) {}
        }
    };
    // const handlSelectChange = async e => {
    //     const selectedText = e.target.value;
    //     setSelectedData(selectedText);
    //     const token = localStorage.getItem('companyToken');
    //     if (!token) {
    //         return;
    //     } else {
    //         const decodedToken = jwtDecode(token);
    //         const userId = decodedToken?._id;
    //         try {
    //             const response = await axios.get(
    //                 `${BaseUrl}company/subscription/count/${userId}/${selectedText}`
    //             );
    //             setDashboardData(response?.data);
    //         } catch (error) {}
    //     }
    // };

    // const getSelectedData = async () => {
    //     const token = localStorage.getItem('Candidate_token');
    //     if (!token) {
    //         return;
    //     } else {
    //         setloading(true);
    //         const decodedToken = jwtDecode(token);
    //         const userId = decodedToken?._id;
    //         try {
    //             const response = await axios.get(
    //                 `${BaseUrl}candidate/dashboard/job/status/${userId}/${startDate}/${EndDate}`
    //             );
    //             setApiResponse(response?.data);
    //             if (response.status == 200 || response.status == 201) {
    //                 setloading(false);
    //             }
    //         } catch (error) {}
    //     }
    // };

    const handleStartChange = async e => {
        const date = new Date(e.target.value);
        const isoDate = date.toISOString();
        setStartDate(isoDate);
    };
    const handleEndChange = async e => {
        const date = new Date(e.target.value);
        const isoDate = date.toISOString();
        setEndDate(isoDate);

         getSelectedData();
    };
    useEffect(() => {
        setTimeout(() => {
            sethide(null);
        }, 10000);
    }, [hide]);

    function rendering() {
        const render = localStorage.getItem('render');

        if (render == 'company') {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                navigate('/login');
            } else {
                navigate('/main/dashboard');
            }
        } else {
            navigate('/login');
        }
    }
    const handleStartDatePick = () => {
        startRef.current.ShowPicker(); // This will bring up the date picker
    };

    useEffect(() => {
        const fun = async () => {
            await getSelectedData();
        };
        fun();
        rendering();
    }, []);

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Dashboard</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Dashboard</title>
                    <link rel="canonical" href="http://mysite.com/example" />
                </Helmet>
                {/*First Row Card */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <div className="c-dsahboard-top-cards">
                        <img src={building} alt="" />
                        <div className="c-card-content">
                            <h3>Total Job Created</h3>
                            <p>{dasboardData?.data?.totalJobs || 0}</p>
                        </div>
                        <div
                            className="custom-select-company"
                            style={{
                                display: 'flex',
                                gap: '5px'
                            }}
                        >
                            <div
                                className="custom-select-sub-date"
                                style={{
                                    display: 'flex',
                                    gap: '5px'
                                }}
                            >
                                <p>From: </p>
                                <input
                                    type="date"
                                    style={{
                                        width: '24px',
                                        marginTop: '-3px',
                                        height: '25px'
                                    }}
                                    onChange={handleStartChange}
                                />
                            </div>
                            <div
                                className="custom-select-sub-date"
                                style={{ display: 'flex', gap: '5px' }}
                            >
                                <p>To: </p>
                                <input
                                    type="date"
                                    style={{
                                        width: '24px',
                                        marginTop: '-3px',
                                        height: '25px'
                                    }}
                                    onChange={handleEndChange}
                                />
                            </div>
                        </div>

                        {/* <div
                            className="serach-icon"
                            onClick={getSelectedData}
                            style={{
                                marginTop: '30px',
                                marginLeft: '20px',
                                width: '100px',
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <span>Filter</span>
                        </div> */}
                    </div>

                    <div className="c-dsahboard-top-cards">
                        <img src={CandidateOnboardedIcon} alt="" />
                        <div className="c-card-content">
                            <h3>Total Applications Received</h3>
                            <p>
                                {dasboardData?.count[0]
                                    ?.totalAppliedCandidates || 0}
                            </p>
                        </div>
                    </div>

                    <div className="c-dsahboard-top-cards">
                        <img src={CandidateHiredIcon} alt="" />
                        <div className="c-card-content">
                            <h3>Total Candidates Hired</h3>
                            <p>
                                {dasboardData?.count[0]?.totalHiredCandidates ||
                                    0}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row mt-2 mx-1 ">
                    {loading || data?.subscriptionData.length > 0 ? (
                        <div class="col-5  dashboard-card  first-row  ">
                            <div className="col-12  mt-2 dashboard-div d-flex">
                                <p className="myplan-p ">My Plan:</p>
                                <p className="myplan-btn">
                                    {data?.subscriptionData[0].plane_name ||
                                        'N/A'}
                                </p>
                                {data?.subscriptionData[1]?.plane_name ? (
                                    <p className="myplan-btn">
                                        {data?.subscriptionData[1]?.plane_name}
                                    </p>
                                ) : null}
                            </div>

                            <div className="col-12 candidate-searches">
                                <p className="Candidates">
                                    Candidates Searches
                                </p>
                                <h3 className="Candidates-s">
                                    {' '}
                                    {data?.subscriptionData[0].search_limit +
                                        ((data?.subscriptionData[1] &&
                                            data?.subscriptionData[1]
                                                ?.search_limit) ||
                                            0)}/ {
                                                (data?.subscriptionData[0]?.Temp_search_limit || 0) +
                                                  (data?.subscriptionData[1]?.Temp_search_limit || 0)
                                              }
                                </h3>
                            </div>
                            <div className="col-12 cv-views">
                                <p className="Candidates">CV Views</p>
                                <h3 className="Candidates-s">
                                    {data?.subscriptionData[0].cv_view_limit +
                                        ((data?.subscriptionData[1] &&
                                            data?.subscriptionData[1]
                                                ?.cv_view_limit) ||
                                            0)}/
                                              {(data?.subscriptionData[0].Temp_cv_view_limit||0) +
                                        (data?.subscriptionData[1]
                                                ?.Temp_cv_view_limit||
                                            0)}
                                </h3>
                            </div>
                            {/* <div className="col-12 ai-searches">
                                <p className="Candidates">Ai Searches</p>
                                <h3 className="Candidates-s">0</h3>
                            </div> */}
                            <div className="col-12 mt-2 ai-searches">
                                <p className="Candidates-cv">
                                    Multiple CV downloads
                                </p>
                                <h3 className="Candidates-s">
                                    {data?.subscriptionData[0]
                                        ?.download_cv_limit
                                        ? 'Unlimited':data?.subscriptionData[1]
                                        ?.download_cv_limit?'Unlimited'
                                        : 'N/A'}
                                </h3>
                            </div>
                            <div className="col-12 ai-searches">
                                <p className="Candidates-cv">
                                    Multiple Emails downloads
                                </p>
                                {}
                                <h3 className="Candidates-s">
                                    {' '}
                                    {data?.subscriptionData[0]
                                        ?.download_email_limit
                                        ? 'Unlimited':data?.subscriptionData[1]
                                        ?.download_email_limit?'Unlimited'
                                        : 'N/A'}
                                </h3>
                            </div>
                            <div className="col-12 ai-searches">
                                <p className="Candidates-cv">Listed Job</p>
                                <h3 className="Candidates-s">
                                    {data?.subscriptionData[0]?.job_posting +
                                        ((data?.subscriptionData[1] &&
                                            data?.subscriptionData[1]
                                                ?.job_posting) ||
                                            0)}/ {(data?.subscriptionData[0]?.Temp_job_posting||0) +
                                                (data?.subscriptionData[1]
                                                        ?.Temp_job_posting||
                                                    0)}
                                </h3>
                            </div>
                            <div className="col-12 ai-searches">
                                <p className="Candidates-cv">Ai Job Description</p>
                                <h3 className="Candidates-s">
                                    {data?.subscriptionData[0]?.ai_job_description +
                                        ((data?.subscriptionData[1] &&
                                            data?.subscriptionData[1]
                                                ?.ai_job_description) ||
                                            0)}/ {(data?.subscriptionData[0]?.Temp_ai_job_description||0) +
                                                (data?.subscriptionData[1]
                                                        ?.Temp_ai_job_description||
                                                    0)}
                                </h3>
                            </div>
                            <div className="col-12 ">
                                <p className="only">
                                    {/* {/ Only for Premium/Enterprise - UPGRADE /} */}
                                </p>
                                <p className="ends-on">
                                    {data?.subscriptionData[0]?.expiresAt}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div class="col-5  dashboard-card  first-row  ">
                            <BuyPlanDesign />
                        </div>
                    )}

                    {/*2 Row Card */}

                    <div className="col-12 col-md-7 bg-white mx-2">
                        <div className="company-dashboard-card">
                            <div className="companydashboaord-child-card">
                                <div>
                                    <img alt="" />
                                </div>
                                <div>
                                    <h3>Total Shortlisted Candidate</h3>
                                    <p>
                                        {' '}
                                        {dasboardData?.count[0]
                                            ?.totalShortlistedCandidates || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="companydashboaord-child-card">
                                <div></div>
                                <div>
                                    <h3>Total Offer Letters</h3>
                                    <p>
                                        {' '}
                                        {dasboardData?.count[0]
                                            ?.totalOfferLetters || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="companydashboaord-child-card">
                                <div></div>
                                <div>
                                    <h3>Candidates CV View Count</h3>
                                    <p>
                                        {' '}
                                        {dasboardData?.cv_view_count
                                            ?.totalViewCV || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="companydashboaord-child-card">
                                <div></div>
                                <div>
                                    <h3>Total CV Download Count</h3>
                                    <p>
                                        {dasboardData?.cv_view_count
                                            ?.totalDownloadCount || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="companydashboaord-child-card">
                                <div></div>
                                <div>
                                    <h3>Total Promoted Jobs</h3>
                                    <p>
                                        {' '}
                                        {dasboardData?.data
                                            ?.totalPromotedJobs || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="companydashboaord-child-card">
                                <div></div>
                                <div>
                                    <h3>Total Unpromoted Jobs</h3>
                                    <p>
                                        {dasboardData?.data
                                            ?.totalUnpromotedJobs || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
};

export default Dashboard;
