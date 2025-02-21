import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import blackCross from '../../../../assets/images/blackCross.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useContext } from 'react';
import { AccessManagementContext } from '../../../../context/AccessManagementContext';
import { toast } from 'react-toastify';

const CreateNewHr = () => {
    const { AddNewHR, showModule, setShowModule } = useContext(
        AccessManagementContext
    );
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        dashboard: true,
        hire_candidate: false,
        create_job: false,
        creadibility: false,
        subscription: false,
        transaction: false,
        support: false,
        access_management: false,
        email: '',
        password: ''
    });

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'password') {
            validatePassword(value);
        }
    };

    const validatePassword = password => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            setPasswordError('Password must be at least 8 characters long.');
        } else if (!hasUpperCase) {
            setPasswordError('Password must contain at least one uppercase letter.');
        } else if (!hasLowerCase) {
            setPasswordError('Password must contain at least one lowercase letter.');
        } else if (!hasNumber) {
            setPasswordError('Password must contain at least one number.');
        } else if (!hasSpecialChar) {
            setPasswordError('Password must contain at least one special character.');
        } else {
            setPasswordError('');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevVisible => !prevVisible);
    };

    const SubmitHrDetails = async e => {
        e.preventDefault();

        if (passwordError) {
            toast.error('Please fix the password errors before submitting.');
            return;
        }

        if (
            !formData.hire_candidate &&
            !formData.create_job &&
            !formData.creadibility &&
            !formData.subscription &&
            !formData.transaction &&
            !formData.support &&
            !formData.access_management
        ) {
            toast.error('Please Select at least one checkbox');
        } else {
            await AddNewHR(formData);
        }
    };

    return (
        <>
            <Row>
                <Col md={11} xs={10}>
                    Add New HR
                </Col>
                <Col md={1} xs={2}>
                    <img
                        src={blackCross}
                        alt=""
                        width="20px"
                        onClick={() => setShowModule(prev => !prev)}
                        style={{ cursor: 'pointer' }}
                    />
                </Col>
            </Row>
            <Form onSubmit={e => SubmitHrDetails(e)}>
                <Row>
                    <Col md={12}>
                        <Form.Label
                            className="mt-2"
                            style={{ fontSize: '0.8rem' }}
                        >
                            Enter Email
                            <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="email"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            placeholder="Ex: www@gmail.com"
                            required
                            name="email"
                            value={formData?.email}
                            onChange={e => handleInputChange(e)}
                        />
                    </Col>

                    <Col md={12} className="mb-2">
                        <Form.Label
                            className="mt-2 "
                            style={{ fontSize: '0.8rem' }}
                        >
                            Enter Password
                            <span className="text-danger">*</span>
                        </Form.Label>
                        <div style={{ position: 'relative' }}>
                            <Form.Control
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Enter your password"
                                aria-label="Password input"
                                required
                                name="password"
                                value={formData?.password}
                                onChange={handleInputChange}
                            />
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1
                                }}
                            >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                        </div>
                        {passwordError && (
                            <div className="text-danger" style={{ fontSize: '0.8rem' }}>
                                {passwordError}
                            </div>
                        )}
                    </Col>

                    {/* Checkbox Inputs */}
                    {[
                        { name: 'hire_candidate', label: 'Hire Candidate' },
                        { name: 'create_job', label: 'Create Job' },
                        { name: 'creadibility', label: 'Creadibility' },
                        { name: 'subscription', label: 'Subscription' },
                        { name: 'transaction', label: 'Transaction' },
                        { name: 'support', label: 'Support' },
                        {
                            name: 'access_management',
                            label: 'Access Management'
                        }
                    ].map(({ name, label }) => (
                        <Col md={4} xs={12} className="mt-2" key={name}>
                            <Form.Check
                                className="check-box-hr"
                                type="checkbox"
                                label={label}
                                name={name}
                                checked={formData[name]}
                                onChange={handleInputChange}
                            />
                        </Col>
                    ))}
                </Row>
                <Row className="mt-3">
                    <Button style={{ background: '#3b96e1' }} type="submit">
                        Submit
                    </Button>
                </Row>
            </Form>
        </>
    );
};

export default CreateNewHr;