import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
//const socket = io('http://65.20.91.47:4000');
const socket = io('https://boardsearch.ai');

// Create the context
export const HireCandidateContext = createContext();

let id;
// Context Provider component
export const HireCandidateProvider = ({ children }) => {
    const [appliedcandidate, setappliedcandidate] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [SearchLoading, setSearchLoading] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
        const [AiData, setAiData] = useState([]);
    const [seachBarData, setseachBarData] = useState({
        search: '',
        experience: '',
        location: ''
    });

    const [email_loading, setEmail_loading] = useState(null);
    const [resume_loading, setResume_loading] = useState(null);

    const [candidate_detials, set_candidate_detials] = useState(null);
    const [Identity, SetIdentity] = useState(null);
    const [profile, SetProfile] = useState(null);
    const [greenBatch, SetgreenBatch] = useState(null);

    // states for notification
    const [show, setShow] = useState(null);
    const [showHire, SetShowHire] = useState(null);
    const [candidateNoti, SetcandidateNoti] = useState(null);

    const handleCloseHire = id => {
        const token = localStorage.getItem('companyToken');
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken?._id;
        socket.emit('viewnotification', companyId, id);
        socket.on('view', data => {
            SetcandidateNoti(data);
        });

        setShow(false);
    };

    // subsciption data
    const [Subscription_Data, setSubscription_Data] = useState({});

    const get_subscription_details = async () => {
        const token = localStorage.getItem('companyToken');
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken?._id; // Assuming the token contains an 'id' for the company

        if (!companyId) {
            throw new Error('Invalid token');
        }
        try {
            const response = await axios.get(
                `${BaseUrl}company/subscription_count_status/${companyId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`

                    }
                }
            );

            setSubscription_Data(response?.data?.subscriptionData);
        } catch (error) {}
    };

    // Downlaod Emails
    const downloadSelectedEmails = async selectedCandidates => {
        if (selectedCandidates.length === 0) {
            toast.error('Please select at least one candidate.');
            return;
        }
        const token = localStorage.getItem('companyToken');
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken?._id; // Assuming the token contains an 'id' for the company

        if (!companyId) {
            throw new Error('Invalid token');
        }

        try {
            // Ensure selectedCandidateIds is an array of simple values

            const response = await axios.post(
                `${BaseUrl}company/download_email/${companyId}`,
                { selectedCandidates },
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    },
                    responseType: 'blob' // Must be inside the Axios config object
                }
                
            );

            // Create URL and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'selected_emails.csv'); // Filename for download
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading emails:', error);
        }
    };

    // Download Resumes
    const handleDownload_Resume = async selectedCandidates => {
        if (selectedCandidates.length === 0) {
            toast.error('Please select at least one candidate.');
            return;
        }
        setResume_loading(true);
        const token = localStorage.getItem('companyToken');
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken?._id; // Assuming the token contains an 'id' for the company

        if (!companyId) {
            throw new Error('Invalid token');
        }
        try {
            const response = await axios.post(
                `${BaseUrl}company/download_resume/${companyId}`,
                { selectedCandidates },
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    },
                    responseType: 'blob' // Must be inside the Axios config object
                }
            );
            if (response.status === 200) {
                setResume_loading(false);
            }

            // Create a URL and download the zip file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'selected_resumes.zip');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading resumes', error);
            alert('Failed to download resumes.');
        }
    };

    const get_Candidate_detials = async id => {
        const token = localStorage.getItem('companyToken');
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken?._id;
        try {
            const response = await axios.get(
                `${BaseUrl}company/get_candidatedetails/${id}/${companyId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`

                    }
                }
            );

            set_candidate_detials(response?.data);
        } catch (error) {}
    };

    const Search_bye_keyWord = async seachBarData => {
        setSearchLoading(true);

        const token = localStorage.getItem('companyToken');
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken?._id;
        try {
            const response = await axios.post(
                `${BaseUrl}company/get_searchcandiate/${companyId}`,
                {
                    search: seachBarData.search,
                    experience: seachBarData.experience,
                    location: seachBarData.location
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`

                    }
                }
            );
            if (response.status == 200) {
                setappliedcandidate(response?.data);
                get_subscription_details();
                setSearchLoading(false);
                // toast.success('jhgaj');
                setseachBarData({
                    search: '',
                    experience: '',
                    location: ''
                });
            }
        } catch (error) {
            toast.error(error?.response?.data?.error);
            setSearchLoading(false);
        }
    };

    async function CompanyProfile(id) {
        const token = localStorage.getItem('companyToken');
        try {
            const response = await axios.get(
                `${BaseUrl}company/profile/details/${id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`

                    }
                }
            );
            if (response.status === 200) {
                SetIdentity(response?.data.company_name);
                SetProfile(response?.data.profile);
                SetgreenBatch(response?.data?.verified_batch);
            }
        } catch (error) {}
    }

    useEffect(() => {
        get_subscription_details();
    }, []);

    return (
        <HireCandidateContext.Provider
            value={{
                resume_loading,
                appliedcandidate,
                setappliedcandidate,
                loading,
                setLoading,
                candidate_detials,
                currentPage,
                setCurrentPage,
                error,
                setError,
                Subscription_Data,
                downloadSelectedEmails,
                handleDownload_Resume,
                get_Candidate_detials,
                Search_bye_keyWord,
                seachBarData,
                setseachBarData,
                SearchLoading,
                handleCloseHire,
                showHire,
                SetShowHire,
                candidateNoti,
                show,
                setShow,
                Identity,
                profile,
                greenBatch,
                SetIdentity,
                SetProfile,
                CompanyProfile,
                get_subscription_details,
                AiData, setAiData
            }}
        >
            {children}
        </HireCandidateContext.Provider>
    );
};
