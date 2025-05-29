import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import BaseUrl from '../../../../../services/BaseUrl';
import oui_cross from '../../../../../assets/images/oui_cross.png';
import blackCross from '../../../../../assets/images/blackCross.png';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { CandidateProfileContext } from '../../../../../context/candidateContext/CandidateProfileContext';
import { toast } from 'react-toastify';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const CustomInput = React.forwardRef((props, ref) => (
  <input
    {...props}
    ref={ref}
    required
    style={{
      border: "1.3px solid #AEAEAE",
      height: "30px"
    }}
  />
));

const EditBasicDetails = () => {
    const { modalShow, showModal, fetchCandidateProfile } = useContext(
        CandidateProfileContext
    );
    const [formData, setFormData] = useState({
        email: '',
        mobile: '',
        linkedIn: '',
        name: '',
        contact_email: ''
    });
    const [isValidPhone, setIsValidPhone] = useState(true);
    
    // State for errors
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        contact_email: '',
        mobile: '',
        linkedIn: '',
        other_profiles: []
    });

    const locate = useLocation();
    const [validated, setValidated] = useState(false);

    // State for dynamic input fields (other profiles)
    const [other_profile, setInputFields] = useState([
        { profile_name: '', link: '' }
    ]);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateLinkedIn = (linkedin) => {
        const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/;
        return linkedInRegex.test(linkedin);
    };

    const validateLink = (link) => {
        const linkRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/;
        return linkRegex.test(link);
    };

    const validateName = (name) => {
        const NameRegex = /^[a-zA-Z\s]{2,50}$/;
        return NameRegex.test(name);
    }

    // Handle basic field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Validate immediately on change
        let error = '';
        switch (name) {
            case 'name':
                if (!validateName(value)) {
                    error = 'Name must be 2-50 characters and contain only letters';
                }
                break;
            case 'email':
                if (!validateEmail(value)) {
                    error = 'Invalid email format';
                }
                break;
            case 'contact_email':
                if (!validateEmail(value)) {
                    error = 'Invalid email format';
                }
                break;
            case 'linkedIn':
                if (value && !validateLinkedIn(value)) {
                    error = 'Invalid LinkedIn profile URL';
                }
                break;
        }
        
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Handle dynamic input field changes
    const handleProfileChange = (index, field, value) => {
        const updatedFields = [...other_profile];
        updatedFields[index][field] = value;
        setInputFields(updatedFields);
        
        // Validate the changed field
        const profileErrors = [...errors.other_profiles];
        if (!profileErrors[index]) profileErrors[index] = {};
        
        if (field === 'profile_name') {
            profileErrors[index].profile_name = !validateName(value) ? 
                'Profile name must be 2-50 characters and contain only letters' : '';
        } else if (field === 'link') {
            profileErrors[index].link = !validateLink(value) ? 
                'Please provide a valid URL' : '';
        }
        
        setErrors(prev => ({
            ...prev,
            other_profiles: profileErrors
        }));
    };

    // Remove the Other profile one by one
    const handleDelete = (index) => {
        const updatedFields = other_profile.filter((_, i) => i !== index);
        const updatedErrors = errors.other_profiles.filter((_, i) => i !== index);
        setInputFields(updatedFields);
        setErrors(prev => ({
            ...prev,
            other_profiles: updatedErrors
        }));
    };

    // Add new dynamic profile input fields
    const handleAddProfile = () => {
        setInputFields([...other_profile, { profile_name: '', link: '' }]);
        setErrors(prev => ({
            ...prev,
            other_profiles: [...prev.other_profiles, {}]
        }));
    };

    const handlePhoneChange = (value) => {
        const isValid = isPhoneValid(value);
        setFormData({ ...formData, mobile: value });
        setIsValidPhone(isValid || value === '');
        setErrors(prev => ({
            ...prev,
            mobile: isValid || value === '' ? '' : 'Please enter a valid phone number'
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);
        
        // Validate all fields
        let hasErrors = false;
        const newErrors = { ...errors };
        
        // Validate name
        if (!validateName(formData.name)) {
            newErrors.name = 'Name must be 2-50 characters and contain only letters';
            hasErrors = true;
        }
        
        // Validate contact email
        if (!validateEmail(formData.contact_email)) {
            newErrors.contact_email = 'Invalid email format';
            hasErrors = true;
        }
        
        // Validate LinkedIn (if provided)
        if (formData.linkedIn && !validateLinkedIn(formData.linkedIn)) {
            newErrors.linkedIn = 'Invalid LinkedIn profile URL';
            hasErrors = true;
        }
        
        // Validate phone
        if (!isPhoneValid(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid phone number';
            hasErrors = true;
        }
        
        // Validate other profiles
        const profileErrors = [];
        other_profile.forEach((profile, index) => {
            const profileError = {};
            let hasProfileErrors = false;
            
            if (!validateName(profile.profile_name)) {
                profileError.profile_name = 'Profile name must be 2-50 characters and contain only letters';
                hasProfileErrors = true;
            }
            
            if (!validateLink(profile.link)) {
                profileError.link = 'Please provide a valid URL';
                hasProfileErrors = true;
            }
            
            if (hasProfileErrors) hasErrors = true;
            profileErrors[index] = profileError;
        });
        
        newErrors.other_profiles = profileErrors;
        setErrors(newErrors);
        
        if (hasErrors) {
            toast.error('Please correct the errors in the form');
            return;
        }
        
        const token = localStorage.getItem('Candidate_token');
        const combinedData = {
            ...formData,
            other_profile: other_profile 
        };
        
        if (!token) {
            return;
        }
        
        const decodedToken = jwtDecode(token);
        const user_id = decodedToken?._id;
        try {
            const response = await axios.put(
                `${BaseUrl}candidate/profile/edit_basic/${user_id}`,
                combinedData,
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                } 
            );
            if (response?.status == 200 || response?.status == 201) {
                await fetchCandidateProfile();
                toast.success(response.data.message);
                showModal();
            }
        } catch (error) {
            toast.error(`${error?.response?.data?.error}`);
        }
    };

    const fetchCandidateMydetails = async () => {
        const token = localStorage.getItem('Candidate_token');
        if (!token) {
            return;
        } else {
            const decodedToken = jwtDecode(token);
            const id = decodedToken?._id;
            try {
                const response = await axios.get(
                    `${BaseUrl}candidate/profile/get_basic/${id}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    } 
                );

                const { email, mobile, linkedIn, name, contact_email } =
                    response?.data?.basic_details;
                setInputFields(response.data?.basic_details?.other_profile || []);
                setFormData({
                    email: email || '',
                    mobile: mobile || '',
                    linkedIn: linkedIn || '',
                    name: name || '',
                    contact_email: contact_email || ''
                });
            } catch (error) {
                console.error('Error fetching candidate details:', error);
            }
        }
    };

    useEffect(() => {
        fetchCandidateMydetails();
    }, [locate]);

    return (
        <div style={{ padding: '10px' }}>
            <img
                src={oui_cross}
                alt=""
                style={{
                    float: 'right',
                    width: '24px',
                    cursor: 'pointer',
                    marginTop: '-10px'
                }}
                onClick={showModal}
            />
            <p
                style={{
                    marginTop: '0',
                    textAlign: 'center',
                    color: '#051F50',
                    fontWeight: '600'
                }}
            >
                Basic Details
            </p>
            <Form
                noValidate
                onSubmit={handleSubmit}
                style={{ maxWidth: '600px', margin: '0 auto' }}
            >
                <Form.Group controlId="name" style={{ marginTop: '-8px' }}>
                    <Form.Label
                        style={{ fontSize: '0.8rem', fontWeight: '500' }}
                    >
                        Name
                        <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={validated && !!errors.name}
                        style={{
                            fontSize: '0.8rem',
                            marginTop: '-6px',
                            height: '30px',
                            border: '1.3px solid rgb(221 215 215)'
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email" className="mt-3">
                    <Form.Label
                        style={{ fontSize: '0.8rem', fontWeight: '500' }}
                    >
                        Email Address
                        <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        style={{
                            fontSize: '0.8rem',
                            marginTop: '-6px',
                            height: '30px',
                            border: '1.3px solid rgb(221 215 215)'
                        }}
                    />
                </Form.Group>

                <Form.Group controlId="contact_email" className="mt-3">
                    <Form.Label
                        style={{ fontSize: '0.8rem', fontWeight: '500' }}
                    >
                        Contact Email Address
                        <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="email"
                        name="contact_email"
                        placeholder="Enter Contact email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        isInvalid={validated && !!errors.contact_email}
                        style={{
                            fontSize: '0.8rem',
                            marginTop: '-6px',
                            height: '30px',
                            border: '1.3px solid rgb(221 215 215)'
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.contact_email}
                    </Form.Control.Feedback>
                </Form.Group>
               
                <Form.Group controlId="linkedin" className="mt-3">
                    <Form.Label
                        style={{ fontSize: '0.8rem', fontWeight: '500' }}
                    >
                        LinkedIn Profile
                        <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        name="linkedIn"
                        placeholder="Enter LinkedIn profile URL"
                        value={formData.linkedIn}
                        onChange={handleChange}
                        isInvalid={validated && !!errors.linkedIn}
                        style={{
                            fontSize: '0.8rem',
                            marginTop: '-6px',
                            height: '30px',
                            border: '1.3px solid rgb(221 215 215)'
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.linkedIn}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="phone" className="mt-3">
                    <Form.Label
                        style={{ fontSize: '0.8rem', fontWeight: '500' }}
                    >
                        Phone Number
                        <span className="text-danger">*</span>
                    </Form.Label>
                    <PhoneInput
                        defaultCountry="in"
                        required
                        value={formData.mobile}
                        onChange={handlePhoneChange}
                        inputComponent={CustomInput}
                    />
                    {validated && errors.mobile && (
                        <div style={{ color: 'red', fontSize: '0.7rem', marginTop: '2px' }}>
                            {errors.mobile}
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="profile" className="mt-3">
                    <Form.Label
                        style={{ fontSize: '0.8rem', fontWeight: '500' }}
                    >
                        Add other profiles
                    </Form.Label>
                    {other_profile.map((field, index) => (
                        <Row key={index} className="mt-2">
                            <Col xs={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: Github"
                                    style={{
                                        fontSize: '0.8rem',
                                        height: '30px',
                                        border: '1.3px solid rgb(221 215 215)'
                                    }}
                                    value={field.profile_name}
                                    onChange={e =>
                                        handleProfileChange(
                                            index,
                                            'profile_name',
                                            e.target.value
                                        )
                                    }
                                    isInvalid={validated && errors.other_profiles[index]?.profile_name}
                                />
                                {validated && errors.other_profiles[index]?.profile_name && (
                                    <div style={{ color: 'red', fontSize: '0.7rem' }}>
                                        {errors.other_profiles[index].profile_name}
                                    </div>
                                )}
                            </Col>
                            <Col md={7}>
                                <Form.Control
                                    type="text"
                                    placeholder="Paste or Enter Link"
                                    style={{
                                        fontSize: '0.8rem',
                                        height: '30px',
                                        border: '1.3px solid rgb(221 215 215)'
                                    }}
                                    value={field.link}
                                    onChange={e =>
                                        handleProfileChange(
                                            index,
                                            'link',
                                            e.target.value
                                        )
                                    }
                                    isInvalid={validated && errors.other_profiles[index]?.link}
                                />
                                {validated && errors.other_profiles[index]?.link && (
                                    <div style={{ color: 'red', fontSize: '0.7rem' }}>
                                        {errors.other_profiles[index].link}
                                    </div>
                                )}
                            </Col>
                            <Col md={1} onClick={e => handleDelete(index)}>
                                <img src={blackCross} width="24px" alt="" />
                            </Col>
                        </Row>
                    ))}
                </Form.Group>

                <div className="text-start mt-3">
                    <Button
                        size="sm"
                        style={{
                            background: '#F8F8F8',
                            color: '#141416',
                            border: 'none',
                            fontWeight: '500'
                        }}
                        onClick={handleAddProfile}
                    >
                        + ADD
                    </Button>
                </div>

                <div className="text-end mt-4">
                    <Button
                        style={{
                            background: '#3B96E1',
                            padding: '6px 30px',
                            borderRadius: '4px',
                            fontSize: '0.9rem'
                        }}
                        type="submit"
                    >
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default EditBasicDetails;