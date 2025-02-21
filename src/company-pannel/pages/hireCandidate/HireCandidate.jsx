import React, { useContext, useEffect, useState } from 'react';
import Image from 'react-bootstrap/Image';
import {
    Button,
    Col,
    Row,
    Form,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import Ai from '../../../assets/images/Ai.png';
import SearchIcon from '../../../assets/images/SearchIcon.png';
import Crown from '../../../assets/images/Crown.png';
import Verified from '../../../assets/images/Verified.png';
import altprofile from '../../../assets/images/altprofile.jpg';
import './hireCandidate.css';
import { HireCandidateContext } from '../../../context/HireCandidateContex';
import profileimg from '../../../assets/images/profileimg.png';
import { toast } from 'react-toastify';
import BaseUrl from '../../../services/BaseUrl';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import InfiniteScroll from 'react-infinite-scroll-component';

const HireCandidate = () => {
    const {
        appliedcandidate,
        setappliedcandidate,
        resume_loading,
        SearchLoading,
        seachBarData,
        setseachBarData,
        setLoading,
        loading,
        setError,
        currentPage,
        setCurrentPage,
        error,
        Subscription_Data,
        downloadSelectedEmails,
        handleDownload_Resume,
        get_Candidate_detials,
        Search_bye_keyWord,
        get_subscription_details,
        setAiData
    } = useContext(HireCandidateContext);
    const navigate = useNavigate();
    const locate = useLocation();

    const [fiedEmpty, setfiedEmpty] = useState('');
    const [hasMore, setHasmore] = useState(true);
    const [totalUser, setTotalUser] = useState(0);

    const handle_sideBar_change = e => {
        const { name, value } = e.target;
        setseachBarData(prevedata => ({ ...prevedata, [name]: value }));
        setfiedEmpty('');
    };
    const handle_search = () => {
        Search_bye_keyWord(seachBarData);
    };

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedCandidates, setSelectedCandidates] = useState(
        appliedcandidate.map(() => false)
    );
    const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
    const [buttonText, setButtonText] = useState('Download Emails');
    const [ResumeButtonText, setResumeButtonText] = useState('Download Resume');
    const isEmail_Disabled = !(
        Subscription_Data[0]?.download_email_limit ||
        Subscription_Data[1]?.download_email_limit
    );

    //Subscription_Data[0]?.download_email_limit === false;
    const resume_Disabled = !(
        Subscription_Data[0]?.download_cv_limit ||
        Subscription_Data[1]?.download_cv_limit
    );

    // Handle the "select all" checkbox change
    const handleSelectAllChange = e => {
        const isChecked = e.target.checked;
        setSelectAllChecked(isChecked);
        setSelectedCandidates(appliedcandidate.map(() => isChecked));

        if (isChecked) {
            setSelectedCandidateIds(
                appliedcandidate.map(candidate => candidate._id)
            );
        } else {
            setSelectedCandidateIds([]);
        }
    };

    // Handle individual checkbox change
    const handleCheckboxChange = (index, candidate_id) => e => {
        const isChecked = e.target.checked;
        const updatedSelections = [...selectedCandidates];
        updatedSelections[index] = isChecked;
        setSelectedCandidates(updatedSelections);

        setSelectedCandidateIds(prevIds => {
            if (isChecked) {
                return [...prevIds, candidate_id];
            } else {
                return prevIds.filter(id => id !== candidate_id);
            }
        });

        setSelectAllChecked(updatedSelections.every(Boolean));
    };

    const download_emails = async () => {
        if (isEmail_Disabled) {
            toast.error('Buy Premium Plan');
        } else {
            await downloadSelectedEmails(selectedCandidateIds);
        }
    };

    const download_resumes = async () => {
        if (resume_Disabled) {
            toast.error('Buy Premium Plan');
        } else {
            await handleDownload_Resume(selectedCandidateIds);
        }
    };

    const handleMouseOver = () => {
        setButtonText('Buy Premium Plan');
    };
    const handleMouseOver_resmue = () => {
        setResumeButtonText('Buy Premium Plan');
    };
    const handleMouseOut_resume = () => {
        if (isEmail_Disabled) {
            setResumeButtonText('Download Emails');
        }
    };

    const handleMouseOut = () => {
        if (isEmail_Disabled) {
            setButtonText('Download Emails');
        }
    };
    const naviagte_view_candidate = async id => {
        if (!id) {
            return;
        } else {
            if (
                (typeof Subscription_Data[0]?.cv_view_limit == 'number' &&
                    Subscription_Data[0]?.cv_view_limit > 0) ||
                (typeof Subscription_Data[0]?.cv_view_limit == 'string' &&
                    Subscription_Data[0]?.cv_view_limit == 'Unlimited')
            ) {
                await get_Candidate_detials(id);

                navigate(`/main/view-candidate-details/${id}`);
            } else {
                if (
                    typeof Subscription_Data[0]?.cv_view_limit == 'number' &&
                    Subscription_Data[0]?.cv_view_limit == 0
                ) {
                    toast.error('Please Top up or Upgrade your plan');
                } else {
                    toast.error('Please buy subscription plan');
                }
            }
        }
    };

    const appliedcandidate_Count = appliedcandidate.length;

    const searchLimit =
        (Subscription_Data[0]?.search_limit || 0) +
        (Subscription_Data[1]?.search_limit || 0);

    function rendering() {
        const render = localStorage.getItem('render');

        if (render == 'company') {
            const token = localStorage.getItem('companyToken');
            if (!token) {
                navigate('/login');
            } else {
                navigate('/main/hire-candidate');
            }
        } else {
            navigate('/login');
        }
    }

    const fetchCandidates = async () => {
        setLoading(true);
        const token = localStorage.getItem('companyToken');
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken?._id;

        if (!companyId) {
            setLoading(false);
            toast.error('Invalid token');
            return;
        }

        try {
            const response = await axios.get(
                `${BaseUrl}company/get_appliedcandidate/${companyId}/${currentPage}/${50}`
            );
            const newCandidates = response.data?.data;
            setappliedcandidate(prevCandidates => [
                ...prevCandidates,
                ...newCandidates
            ]);
            setTotalUser(response.data?.TotalCandidate);

            if (newCandidates.length < 50) {
                setHasmore(false);
            } else {
                setCurrentPage(prevPage => prevPage + 1);
            }
        } catch (err) {
            setError(err.message);
            setHasmore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setAiData([])
        if (appliedcandidate.length == 0) {
            rendering();
            get_subscription_details();
            fetchCandidates();
        }
    }, []);

    useEffect(() => {
        return () => {
            setappliedcandidate([]);
            setCurrentPage(1);
        };
    }, []);

    return (
        <div className="hire-candidate">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Hire-Candidate</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Row>
                <Col xs={12} md={3}>
                    <Button className="ai-btn">
                        <img src={Ai} alt="" width="20px" />
                        <Link to="/main/ai-search">AI Assistant Search</Link>
                    </Button>
                </Col>
                <Col xs={12} md={9}>
                    <div className="Search">
                        <input
                            type="text"
                            placeholder="( Search by Job-title , skills , Qualification , Name ) "
                            name="search"
                            value={seachBarData.search}
                            onChange={handle_sideBar_change}
                        />
                        <select
                            id=""
                            name="experience"
                            value={seachBarData.experience}
                            className="custom-select"
                            onChange={handle_sideBar_change}
                        >
                            <option value="">Select Experience</option>
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(
                                year => (
                                    <option key={year} value={year}>
                                        {year} year
                                    </option>
                                )
                            )}
                        </select>
                        <div className="search-by-location">
                            <input
                                type="text"
                                placeholder="Search by location"
                                name="location"
                                value={seachBarData.location}
                                onChange={handle_sideBar_change}
                            />
                        </div>

                        <div className="serach-icon" onClick={handle_search}>
                            <span>{SearchLoading ? 'loading' : 'Search'}</span>
                        </div>
                    </div>
                    <p
                        style={{
                            fontSize: '0.7rem',
                            marginLeft: '-30px',
                            textAlign: 'end',
                            marginTop: '4px'
                        }}
                    >
                        ( {searchLimit}
                        <span style={{ marginLeft: '3px' }}>Search left</span>)
                    </p>
                </Col>
            </Row>
            <Row className="mt-1">
                <Col xs={12}>
                    <div className="serach-result">
                        <div className="para">
                            <p>
                                Results: {appliedcandidate_Count}
                                <span
                                    style={{
                                        fontSize: '0.8rem',
                                        margin: '0 5px'
                                    }}
                                >
                                    /
                                </span>
                                {totalUser}
                            </p>
                        </div>

                        <div className="download-email">
                            <Button
                                className="download-btn"
                                style={{ background: '#3b96e1' }}
                                // disabled={isEmail_Disabled}
                                onClick={download_emails}
                                onMouseOver={
                                    isEmail_Disabled ? handleMouseOver : ''
                                }
                                onMouseOut={
                                    isEmail_Disabled ? handleMouseOut : ''
                                }
                            >
                                {Subscription_Data ? (
                                    ''
                                ) : (
                                    <img src={Crown} alt="" width="20px" />
                                )}{' '}
                                {buttonText}
                            </Button>
                            <Button
                                className="download-btn"
                                style={{ background: '#3b96e1' }}
                                onClick={download_resumes}
                                // disabled={
                                //     Subscription_Data[0]?.download_cv_limit ===
                                //     false
                                // }
                                onMouseOver={
                                    resume_Disabled
                                        ? handleMouseOver_resmue
                                        : ''
                                }
                                onMouseOut={
                                    resume_Disabled ? handleMouseOut_resume : ''
                                }
                            >
                                {Subscription_Data ? (
                                    ''
                                ) : (
                                    <img src={Crown} alt="" width="20px" />
                                )}{' '}
                                <span>
                                    {' '}
                                    {resume_loading
                                        ? 'Downloading Resume'
                                        : 'Download Resume'}
                                </span>
                            </Button>
                            <div className="select-all">
                                <label htmlFor="">Select all</label>
                                <Form>
                                    <Form.Check
                                        type="checkbox"
                                        id="custom-checkbox"
                                        checked={selectAllChecked}
                                        onChange={handleSelectAllChange}
                                    />
                                </Form>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="mt-2">
                <InfiniteScroll
                    style={{ height: '100vh' }}
                    dataLength={appliedcandidate.length}
                    next={fetchCandidates}
                    hasMore={hasMore}
                    loader={<p>Loading...</p>}
                    endMessage={<p>No more candidates to display.</p>}
                    height={450}
                >
                    {appliedcandidate.map((candidate, index) => (
                        <Col xs={12} className="mb-2" key={index}>
                            <div className="result-array">
                                {}
                                <div
                                    className="result-left"
                                    onClick={() =>
                                        naviagte_view_candidate(candidate?._id)
                                    }
                                >
                                    <div className="result-img">
                                        <img
                                            src={
                                                candidate?.candidateDetails
                                                    ?.profile
                                                    ? candidate
                                                          ?.candidateDetails
                                                          ?.profile
                                                    : altprofile
                                            }
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        />
                                    </div>
                                    <div className="result-text">
                                        <h4>
                                            {candidate?.basicDetails[0]?.name}

                                            {/* Tool-tip componet */}
                                            {/* {candidate?.personalDetails[0]
                                                ?.Aadhar_verified_status &&
                                            candidate?.personalDetails[0]
                                                ?.Pan_verified_status ? ( */}
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <div
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                backgroundColor:
                                                                    'white',
                                                                padding:
                                                                    '2px 10px',
                                                                color: '#008000',
                                                                borderRadius: 3,
                                                                border: '1px solid #008000'
                                                            }}
                                                        >
                                                            Verified
                                                        </div>
                                                    }
                                                >
                                                    <img
                                                        src={Verified}
                                                        alt="Verified"
                                                        width="19"
                                                    />
                                                </OverlayTrigger>
                                            {/* ) : null} */}
                                        </h4>
                                        <p>
                                            {
                                                candidate?.workDetails[0]
                                                    ?.aspiring_position
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="right-">
                                    <Form>
                                        <Form.Check
                                            type="checkbox"
                                            id="custom-checkbox"
                                            style={{
                                                marginTop: '10px',
                                                marginRight: '6px'
                                            }}
                                            checked={selectedCandidates[index]}
                                            onChange={handleCheckboxChange(
                                                index,
                                                candidate?._id
                                            )}
                                        />
                                    </Form>
                                </div>
                            </div>
                        </Col>
                    ))}
                </InfiniteScroll>
            </Row>
            <Outlet />
        </div>
    );
};

export default HireCandidate;
