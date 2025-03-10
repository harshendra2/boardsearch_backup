import { useState, useEffect } from 'react';
import axios from 'axios';
import BaseUrl from '../../services/BaseUrl';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming you are using react-toastify for notifications

const useProfileData = (userId) => {
    const [profileData, setProfileData] = useState(null); // Profile data state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [success, setSuccess] = useState(null);
    const [hideForm, setHideForm] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [smShow, setSmShow] = useState(false);

    const fetchProfileData = async () => {
        const token = localStorage.getItem('companyToken');

        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

        try {
            // Decode the token to get the payload
            const decodedToken = jwtDecode(token);
            const companyId = decodedToken?._id;

            if (!companyId) {
                throw new Error('Invalid token');
            }
            
            const response = await axios.get(`${BaseUrl}company/profile/${companyId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`

                    }
                }  
            );
            setProfileData(response.data); // Store data in state
        } catch (err) {
            setError(err.message || 'Failed to fetch profile data');
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };


    const submitForm = async (formFields, gstImage, panImage, profileImage) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            Object.keys(formFields).forEach(key => {
                formData.append(key, formFields[key]);
            });

            // Append the images if present
            if (gstImage) {
                formData.append('gstImage', gstImage);
            }
            if (panImage) {
                formData.append('panImage', panImage);
            }
            if (profileImage) {
                formData.append('profile', profileImage);
            }

            const token = localStorage.getItem('companyToken');
            const decodedToken = jwtDecode(token);
            const companyId = decodedToken?._id;

            if (!companyId) {
                throw new Error('Invalid token');
            }

            const response = await axios.put(
                `${BaseUrl}company/edit/profile/${companyId}`,
                formData,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            await fetchProfileData()
            if (response.status === 200 || response.status === 201) {
                toast.success('Profile updated successfully');
                setSuccess(response.data);
                setLgShow(false);
              
            }
        } catch (error) {
            const customError = error?.response?.data?.error || error.message;
            toast.error(customError);
            setError(customError);
        } finally {
            setLoading(false);
        }
    };

    const fetchFormData = async () => {
        try {
            const token = localStorage.getItem('companyToken');
            const decodedToken = jwtDecode(token);
            const companyId = decodedToken?._id;

            if (!companyId) {
                throw new Error('Invalid token');
            }

            const response = await axios.get(`${BaseUrl}company/get/saved/data/${companyId}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            const customError = error?.response?.data?.error || error.message;
            toast.error(customError);
            setError(customError);
        }
    };
    useEffect(()=>{
        fetchProfileData()
    },[lgShow])

    // Return data, loading, and error for consumption in components
    return {
        profileData,
        setProfileData,
        loading,
        error,
        fetchProfileData,
        submitForm,
        success,
        hideForm,
        lgShow,
        setLgShow,
        smShow,
        setSmShow,
        fetchFormData,
    };
};

export default useProfileData;