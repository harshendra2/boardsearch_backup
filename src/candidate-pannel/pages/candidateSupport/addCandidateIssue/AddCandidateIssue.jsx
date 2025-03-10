import React, { useContext, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import ep_back from '../../../../assets/images/ep_back.png';
import uploadImg from '../../../../assets/images/uploadImg.png';

import axios from 'axios';

import { jwtDecode } from 'jwt-decode';
import BaseUrl from '../../../../services/BaseUrl';
import { CandidateSupportContext } from '../../../../context/candidateContext/CandidateSupportContext';
import { toast } from 'react-toastify';
function AddCandidateIssue() {
    const { fetch_Candidate_issue } = useContext(CandidateSupportContext);
    const { modalShow, setModalShow } = useContext(CandidateSupportContext);
    const [loading, setLoading] = useState(false);
    const [FileData, setFileData] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        Issue_type: '',
        description: '',
        file: null
    });

    const fileRef = useRef();

    // Handle text input changes
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle file input changes
    const handleFileChange = e => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          if (!selectedFile.type.startsWith('image/')) {
            setError('Please upload an image file (e.g., JPEG, PNG).');
            return;
          }}

        setFormData({
            ...formData,
            file: e.target.files[0]
        });
        const file = e.target.files[0];
        setFileData(file);
        setError('')
    };

    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault();

        // Check if the file is present
        if (!formData?.file) {
            toast.error('Please Upload File'); // Show toast message
            return; // Stop execution if no file is provided
        }

        try {
            // Prepare form data
            const formDataToSend = new FormData();
            formDataToSend.append('Issue_type', formData.Issue_type);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('file', formData.file);

            // Retrieve token and decode it to get the company ID
            const token = localStorage.getItem('Candidate_token');
            if (!token) throw new Error('No token found');

            const decodedToken = jwtDecode(token);
            const userId = decodedToken?._id;

            // Ensure ID exists
            if (!userId) throw new Error('Invalid token, no ID found');

            // Send the form data via POST request
            const response = await axios.post(
                `${BaseUrl}candidate/add_issue/${userId}`,
                formDataToSend,
                {
                    headers: {
                        authorization: `Bearer ${token}`, // Send the token in headers
                        'Content-Type': 'multipart/form-data' // Necessary for file uploads
                    }
                }
            );

            // Check response status
            if (response.status === 200) {
                toast.success('Issue Added Successfully');
                setModalShow(prev => !prev);
                await fetch_Candidate_issue();

                // Reset form fields
                setFormData({
                    Issue_type: '',
                    description: '',
                    file: null
                });
            } else {
                toast.error('Failed to add issue');
            }
        } catch (error) {
            console.error('Error submitting the form:', error.message);
            const customError =
                error?.response?.data?.error || 'An error occurred';
            toast.error(customError);
        }
    };

    const handle_file = () => {
        fileRef.current.click();
    };

    return (
        <>
            <div className="add-issue" style={{ padding: '30px 40px' }}>
                <img
                    src={ep_back}
                    alt=""
                    width="20px"
                    onClick={() => setModalShow(prev => !prev)}
                    style={{ cursor: 'pointer' }}
                />
                <p
                    style={{
                        textAlign: 'center',
                        fontWeight: '700',
                        color: '#424242'
                    }}
                >
                    Issue Ticket
                </p>
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formIssueType">
        <Form.Label style={{ fontSize: '0.8rem' }}>
            Select Issue type
        </Form.Label>
        <Form.Select
            aria-label="Default select example"
            value={formData.Issue_type}
           onChange={handleChange}
            style={{ border: '1px solid #000' }}
            name="Issue_type"
        >
           <option value="">Select an issue type</option>
<option value="subscription_plan">Subscription Plan issue</option>
<option value="kyc_verification">KYC verification issue</option>
<option value="job_applying">Job Applying issue</option>
<option value="job_filtering">Job Filtering issue</option>
<option value="offer_letter_rejecting">Offer letter Rejecting issue</option>
        </Form.Select>
    </Form.Group>

                    <Form.Group controlId="formLastName" className="mt-3">
                        <Form.Label style={{ fontSize: '0.8rem' }}>
                            Describe your Issue
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description "
                            style={{ background: '#F5F5F5' }}
                        />
                    </Form.Group>

                    <div
                        className="upload-img mt-2"
                        style={{ display: 'flex', cursor: 'pointer' }}
                        onClick={handle_file}
                    >
                        <img
                            src={uploadImg}
                            alt=""
                            height="20px"
                            style={{ marginRight: '10px' }}
                        />
                        <p style={{ fontSize: '0.8rem' }}>
                            {FileData
                                ? FileData?.name
                                : 'Upload a screenshot of the Issue'}
                        </p>
                        
                    </div>
                    {error && <p style={{ color: 'red',fontSize:'0.8rem'}}>{error}</p>}

                    <input
                        style={{ display: 'none' }}
                        accept="image/*"
                        type="file"
                        ref={fileRef}
                        onChange={handleFileChange}
                    />

                    <Button
                        variant="primary"
                        type="submit"
                        className="mt-3"
                        style={{ width: '100%', background: '#3B96E1' }}
                    >
                        Submit
                    </Button>
                </Form>
            </div>
        </>
    );
}

export default AddCandidateIssue;
