import { useState } from 'react';
import axios from 'axios';
import BaseUrl from './../services/BaseUrl';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        setpassword: '',
        terms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = e => {
        const { name, value, type, checked } = e.target;

        if (type == 'checkbox') {
            setFormData(prevData => ({
                ...prevData,
                [name]: checked
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.email) tempErrors.email = 'Email is required';
        if (!formData.password) tempErrors.password = 'Password is required';
        if (formData.password !== formData.setpassword)
            tempErrors.setpassword = 'Passwords must match';
        if (!formData.username) tempErrors.username = 'Username is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async e => {
        sessionStorage.setItem('formData', JSON.stringify(formData));
        e.preventDefault();

        try {
            const response = await axios.post(
                `${BaseUrl}company/registration`,
                formData
            );
            if (response.status == 200 || response.status == 201) {
                navigate('/company-registration');
                setSuccessMessage('Registration successful!');
                setErrorMessage('');
            }

            // Optionally redirect or perform additional actions here
        } catch (error) {
            toast.error(`${error?.response?.data?.error}`);
            setErrorMessage('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handle_candidate_registration = async () => {
        try {
            const response = await axios.post(
                `${BaseUrl}candidate/reg`,
                formData
            );
            if (response?.status == 200 || response?.status == 201) {
                toast.success('Candidate Registered Successfully');
                navigate('/login');
            }

            // Optionally redirect or perform additional actions here
        } catch (error) {
            toast.error(`${error?.response?.data?.error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        successMessage,
        errorMessage,
        isSubmitting,
        validate,
        handleChange,
        handleSubmit,
        handle_candidate_registration
    };
};

export default useRegistration;
