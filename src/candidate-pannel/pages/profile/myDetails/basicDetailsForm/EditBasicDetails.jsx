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
    const isValid = isPhoneValid(formData?.mobile);
    // State for errors
    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        linkedin: ''
    });

    const locate = useLocation();

    const [validated, setValidated] = useState(false);

    // State for dynamic input fields (other profiles)
    const [other_profile, setInputFields] = useState([
        { profile_name: '', link: '' }
    ]);

    // Handle basic field changes
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle dynamic input field changes
    const handleProfileChange = (index, field, value) => {
        const updatedFields = [...other_profile];
        updatedFields[index][field] = value;
        setInputFields(updatedFields);
    };
    // Remove the Other profile one bye one
    const handleDelete = index => {
        const updatedFields = other_profile.filter((_, i) => i !== index); // Remove the item at the given index
        setInputFields(updatedFields);
    };

    // Add new dynamic profile input fields
    const handleAddProfile = () => {
        setInputFields([...other_profile, { profile_name: '', link: '' }]); // Add new blank row
    };

    // Validation for email, phone, and LinkedIn
    const validateEmail = email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = phone => {
        const phoneRegex = /^\d{10}$/; // Validates a 10-digit phone number
        return phoneRegex.test(phone);
    };

    const validateLinkedIn = linkedin => {
        const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/;
        return linkedInRegex.test(linkedin);
    };

    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault();
        // const Data = new FormData();
        // Data.append('other_profile', other_profile);
        // Data.append('email', formData?.email);
        // Data.append('mobile', formData?.mobile);
        // Data.append('name', formData?.name);
        // Data.append('linkedIn', formData?.linkedIn);
        const token = localStorage.getItem('Candidate_token');
        const combinedData = {
            ...formData, // Spread the formData (email, phone, linkedin)
            other_profile: other_profile // Add other_profile array to the combined object
        };
        if(!isValid){
            toast.error("Please enter a valid phone number.");
            return;
        }
        if (!token) {
            return;
        } else {
            const decodedToken = jwtDecode(token);
            const user_id = decodedToken?._id;
            try {
                const response = await axios.put(
                    `${BaseUrl}candidate/profile/edit_basic/${user_id}`,
                    combinedData
                );
                if (response?.status == 200 || response?.status == 201) {
                    await fetchCandidateProfile();
                    toast.success(response.data.message);

                    showModal();
                }
            } catch (error) {
                toast.error(`${error?.response?.data?.error}`);
            }
        }

        // Validate basic fields
        const newErrors = {
            email: validateEmail(formData.email) ? '' : 'Invalid email format.',
            mobile: validatePhone(formData.phone)
                ? ''
                : 'Phone number must be 10 digits.',
            linkedIn: validateLinkedIn(formData.linkedin)
                ? ''
                : 'Invalid LinkedIn profile URL.'
        };

        setErrors(newErrors);
        setValidated(true);

        // Check if there are no errors in the basic details
        if (!newErrors.email && !newErrors.phone && !newErrors.linkedIn) {
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
                    `${BaseUrl}candidate/profile/get_basic/${id}`
                );

                const { email, mobile, linkedIn, name, contact_email } =
                    response?.data?.basic_details;
                setInputFields(response.data?.basic_details?.other_profile);
                // Set the API data into formData
                setFormData({
                    email: email || '',
                    mobile: mobile || '',
                    linkedIn: linkedIn || '',
                    name: name || '',
                    contact_email: contact_email || ''
                });
            } catch (error) {}
        }
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, mobile: value });
      };

    useEffect(() => {
        const fun = async () => {
            await fetchCandidateMydetails();
        };
        fun();
    }, [locate]);
    return (
        <>
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
                            style={{
                                 fontSize: '0.8rem',
                                marginTop: '-6px',
                                height: '30px',
                                border: '1.3px solid rgb(221 215 215)'
                            }}
                        />
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
                            isInvalid={validated && !!errors.email}
                            style={{
                                fontSize: '0.8rem',
                                marginTop: '-6px',
                                height: '30px',
                               border: '1.3px solid rgb(221 215 215)'
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="email" className="mt-3">
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
                            isInvalid={validated && !!errors.email}
                            style={{
                                fontSize: '0.8rem',
                                marginTop: '-6px',
                                height: '30px',
                                border: '1.3px solid rgb(221 215 215)'
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
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
                            isInvalid={validated && !!errors.linkedin}
                            style={{
                                fontSize: '0.8rem',
                                marginTop: '-6px',
                                height: '30px',
                                border: '1.3px solid rgb(221 215 215)'
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.linkedin}
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
          inputComponent={CustomInput} // Use custom input component
        />
         {!isValid && <div style={{ color: 'red',fontSize: '0.7rem',marginTop:'2px'}}>Phone is not valid</div>}
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
                                    />
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
                                    />
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

                {/* {validated &&
                    !errors.email &&
                    !errors.phone &&
                    !errors.linkedin && (
                        <Alert variant="success" className="mt-4">
                            Form is valid!
                        </Alert>
                    )} */}
            </div>
        </>
    );
};

export default EditBasicDetails;
