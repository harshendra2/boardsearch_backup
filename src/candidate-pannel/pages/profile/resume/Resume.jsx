import React, { useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './resume.css';
import html2pdf, { f } from 'html2pdf.js';
import {
    Button,
    Col,
    Form,
    InputGroup,
    Modal,
    Row,
    Spinner
} from 'react-bootstrap';
import axios from 'axios';
import AiSearch from '../../../../assets/images/AiSearch.png';
import { CandidateProfileContext } from '../../../../context/candidateContext/CandidateProfileContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseUrl from '../../../../services/BaseUrl';
import AIBaseUrl from '../../../../services/AI_BaseUrl';
const Resume = () => {
    const {id}=useParams();
    
    const { CandidateProfile } = useContext(CandidateProfileContext);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [hideInput, setHideInput] = useState(false);
    const [description, setDescription] = useState('');
    const [resumeCount, setResumeCoun] = useState(0);
    const [applyLoading, setApplyLoading] = useState(false);
    const [downloading,setDownloading]=useState(false);

    const navigate = useNavigate();
    // Generate Resume from Backend
    const GenerateResume = async () => {
        const custom_id = CandidateProfile?.data?.custom_id;
        try {
            setLoading(true);
            const response = await axios.post(
                `${AIBaseUrl}pythonapi/generate_resume`,
                {
                    custom_id: custom_id
                }
            );
            if (response.status == 200 || response?.status == 201) {
                setResume(response.data);
                setHideInput(true);
                setLoading(false);
                await decreaseCount();
            }
        } catch (error) {
            setLoading(false);
            setHideInput(false);
            if (error?.response?.data?.error?.includes('not in index')) {
                // Extract the missing fields from the error message
                const missingFields = error.response.data.error.match(/'([^']+)'/g).map(field => field.replace(/'/g, ''));
        
                // Display a user-friendly error message
                toast.error(`Please provide the following required information: ${missingFields.join(', ')}`);
            } else {
                // Handle other errors
                toast.error('An error occurred while generating the resume. Please try again.');
            }
        }
    };

    const decreaseCount = async () => {
        const token = localStorage.getItem('Candidate_token');
        if (!token) {
            return;
        } else {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?._id;
            try {
                const response = await axios.put(
                    `${BaseUrl}candidate/resume_generate/count/${userId}`,
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${token}`
    
                        }
                    } 
                );
            } catch (error) {}
        }
    };
    const generateUsingPrompt = async () => {
        const custom_id = CandidateProfile?.data?.custom_id;
        if (description.trim() == '') {
            toast.error(
                'Please add text to generate or regenerate the resume.'
            );
        } else {
            try {
                setLoading(true);
                const response = await axios.post(
                      `${AIBaseUrl}pythonapi/generate_resume`,
                    {
                        custom_id: custom_id,
                        discriptions_data: description
                    }
                );
                if (response.status == 200 || response?.status == 201) {
                    setResume(response.data);
                    setHideInput(true);
                    setLoading(false);
                    await decreaseCount();
                }
            } catch (error) {
                console.error('Error generating resume:', error);
                setLoading(false);
                setHideInput(false);
            }
        }
    };
    // Download Resume

    const downloadResume = async () => {
        setDownloading(true);
        if (!resume) {
            alert('No resume content available to download!');
            setDownloading(false)
            return;
        }
    
        const base64Content = btoa(resume);
        try {
            let response = await axios.post(`${AIBaseUrl}pythonapi/generate-pdf`, {
                html_base64: base64Content
            });
            if (response?.data?.pdf_base64) { 
                const base64PDF = response.data?.pdf_base64; 
                const byteCharacters = atob(base64PDF);
                const byteNumbers = new Uint8Array(byteCharacters.length);
    
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
    
                const blob = new Blob([byteNumbers], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
    
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resume.pdf';
                document.body.appendChild(a);
                a.click();
    
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
                setDownloading(false)
            } else {
                setDownloading(false)
                alert('Failed to generate PDF');
            }
        } catch (error) {
            setDownloading(false);
            alert('An error occurred while downloading the resume.');
        }
    };
    

    const getCount = async () => {
        const token = localStorage.getItem('Candidate_token');
        if (!token) {
            return;
        } else {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?._id;
            try {
                const response = await axios.get(
                    `${BaseUrl}candidate/resume_generate/sub_count/${userId}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`
    
                        }
                    } 
                );

                if (response?.status == 200 || response?.status == 201) {
                    setResumeCoun(response?.data?.resum_count);
                }
            } catch (error) {
            }
        }
    };

    const storeResume = async () => {
        setApplyLoading(true);
        const token = localStorage.getItem('Candidate_token');
        const decodedToken = jwtDecode(token);
            const userId = decodedToken?._id;
        const base64Content = btoa(resume);
        try{
        let response=await axios.post(`${AIBaseUrl}pythonapi/generate-pdf`,
            {html_base64:base64Content}
        );
        if(response.status==200||response.status==201){
             const res= await axios.put(
                    `${BaseUrl}candidate/stor/resume/${userId}`,
                    {resume:response?.data},
                    {
                        headers: {
                            authorization: `Bearer ${token}`
    
                        }
                    } 
                );

                if (res?.status == 200 ||res?.status == 201) {
                    const response = await axios.post(
                        `${BaseUrl}candidate/jobapply_resume/${userId}/${id}`,
                        {},
                        {
                            headers: {
                                authorization: `Bearer ${token}`
        
                            }
                        } 
                    );
                    if (response.status == 200 || 201) {
                        toast.success('Job Applied successfully ');
                       navigate(-1)
                    }
                    setApplyLoading(false);
                }
        }
        }catch(error){
        toast.error(error?.response?.error);
        }

        // if (!token) {
        //     return;
        // } else {
        //     const decodedToken = jwtDecode(token);
        //     const userId = decodedToken?._id;
        //     try {
        //         const response = await axios.put(
        //             `${BaseUrl}candidate/stor/resume/${userId}`,
        //             {
        //                 resume: base64Content
        //             }
        //         );

        //         if (response?.status == 200 || response?.status == 201) {
        //             setApplyLoading(false);
        //         }
        //     } catch (error) {
        //         toast.error('Failed to apply Job');
        //         setApplyLoading(false);
        //     }
        // }
    };

    const NavigateToSavedJobs = async () => {
        let name = 'profile';
        await storeResume();
        navigate(`/candidate-dashboard/applied-job/saved-jobs/${name}`);
    };

    useEffect(() => {
        const fun = async () => {
            await getCount();
        };
        fun();
    }, []);

    return (
        <div className="resume">
            <div className="resume-view-section">
                {resume === null || loading ? (
                    loading ? (
                        <div className="spinnerdiv">
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                style={{ marginRight: '20px' }}
                            />
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                style={{ marginRight: '20px' }}
                            />
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        </div>
                    ) : (
                        <div className="resume-template">
                            <h4>Resume</h4>
                        </div>
                    )
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: resume }} />
                )}
            </div>
            {hideInput ? (
                <Row className="mt-2">
                    <Col md={2}></Col>
                    <Col md={8}>
                        <InputGroup style={{ width: '100%' }}>
                            <Form.Control
                                as="textarea"
                                name="description"
                                required
                                rows={1}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="If you want  add some data Enter description or Prompt"
                                style={{
                                    border: '1px solid #B4DDFF',
                                    background: '#F5F5F5',
                                    resize: 'vertical', // Allow the user to resize if needed
                                    fontSize: '0.9rem' // Optional for placeholder text size
                                }}
                            />
                            <Button
                                size="sm"
                                style={{
                                    background: 'none',
                                    border: '1px solid #B4DDFF'
                                }}
                                onClick={generateUsingPrompt}
                            >
                                <img src={AiSearch} alt="" width="30px" />
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col md={2}></Col>
                </Row>
            ) : (
                ''
            )}

            <div className="download-candidate-resume mt-2">
                {loading ? (
                    <Button size="sm" style={{ width: '10%' }}>
                        <Spinner size="sm" />{' '}
                    </Button>
                ) : (
                    <Button
                        disabled={resumeCount == 0 || hideInput}
                        size="sm"
                        onClick={GenerateResume}
                    >
                        Generate
                    </Button>
                )}

            
                <Button
                    size="sm"
                    className="btn-sm w-25 px-2"
                    disabled={hideInput&&id.length==3||!hideInput}
                    onClick={() => setSmShow(true)}
                >
                    Apply
                </Button>
                {downloading?(
                    <Button size="sm" style={{width:'88px'}}>
                    <Spinner size="sm" />{' '}
                </Button>
                ):(
           <Button
           size="sm"
           className="btn-sm w-15 px-2"
          disabled={!hideInput}
         onClick={downloadResume}
               >
           Download
              </Button>
                )}
                
            </div>

            <Modal
                size="sm"
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title
                        id="example-modal-sizes-title-sm"
                        style={{ fontSize: '1rem' }}
                    >
                       Are you sure you want to apply this job?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        size="sm"
                        onClick={() => setSmShow(false)}
                        style={{ width: '50%' }}
                    >
                        No
                    </Button>
                    {applyLoading ? (
                        <Button
                            size="sm"
                           
                            style={{ width: '50%' }}
                        >
                            <Spinner size="sm" />{' '}
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={NavigateToSavedJobs}
                            style={{ width: '50%' }}
                        >
                            Yes
                        </Button>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Resume;
