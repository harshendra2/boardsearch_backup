import React, { useRef, useState, useEffect } from 'react';
import './editprofile.css';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Cross from '../../../../assets/images/Cross.png';
import useProfileData from '../../../../hooks/company_dashboard/useProfiledata';
import clarity_note_edit_line from '../../../../assets/images/clarity_note-edit-line.png';
import Verified from '../../../../assets/images/Verified.png';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { toast } from 'react-toastify';

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const EditCompanyProfile = ({ setLgShow }) => {
    const [Gstimage, setGstImage] = useState(null);
    const [Panimage, setPAnImage] = useState(null);
    const [GST, Setgst] = useState(null);
    const [PAN, Setpan] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [ProfileImageURL, setProfileImageURL] = useState('');
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const fileInputRefPan = useRef(null);
    const profileInputref = useRef(null);
    const [formFields, setFormFields] = useState({
        company_name: '',
        email: '',
        mobile: '',
        overView: '',
        address: '',
        industry: '',
        company_size: '',
        GST: '',
        PAN: '',
        website_url: '',
        location: '',
        contact_email: '',
        contact_No: '',
        headQuater_add: '',
        status: ''
    });
    const isValidMobile = isPhoneValid(formFields?.mobile);
    const isValidContactnumber = isPhoneValid(formFields?.contact_No);

    const handlePhoneChange = (value) => {
        setFormFields({ ...formFields, mobile: value });
      };

      const handleContactNumberChange = (value) => {
        setFormFields({ ...formFields, contact_No: value });
      };

    const {submitForm,fetchFormData,fetchProfileData} = useProfileData();

    const handleFieldChange = e => {
        const { name, value } = e.target;

        setFormFields(prevState => ({
            ...prevState,
            [name]: value
        }));
        const regex = /^\d{0,10}$/;

        if (regex.test(value)) {
        }
    };
    const handleImageUpload = event => {
        const file = event.target.files[0];
        const maxSize = 1 * 1024 * 1024; // 1MB limit

    if (file && file.size > maxSize) {
        toast.error("File size exceeds 1MB. Please choose a smaller file.")
        event.target.value = ""; // Clear the file input
        return;
    }

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            Setgst(file);
            setGstImage(imageUrl);
            setProfileImageURL(imageUrl);
        } else {
            console.error('error While uploading Profile Image file ');
        }
    };
    const remove_gst = () => {
        setGstImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input so the user can upload again
        }
    };
    const handleImageUploadPan = event => {
        const file = event.target.files[0];
        const maxSize = 1 * 1024 * 1024; // 1MB limit

    if (file && file.size > maxSize) {
        toast.error("File size exceeds 1MB. Please choose a smaller file.")
        event.target.value = ""; // Clear the file input
        return;
    }
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            Setpan(file);
            setPAnImage(imageUrl);
        }
    };
    const remove_pan = () => {
        setPAnImage(null);
        if (fileInputRefPan.current) {
            fileInputRefPan.current.value = ''; // Reset the file input so the user can upload again
        }
    };
    const handleProfileUpload = event => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(file); // Store the file in state
            setPreview(URL.createObjectURL(file)); // Generate a URL for the image preview
        }
    };
    const handleSubmit = async e => {
        e.preventDefault();
         if(!isValidContactnumber){
        toast.error("Please enter a valid phone number.");
              return;
      }
        if(!isValidMobile){
         toast.error("Please enter a valid phone number.");
            return;
         }
        await submitForm(formFields, GST, PAN, profileImage);
        setLgShow(false)
        await fetchProfileData()
    };

    const fromData = async () => {
        const res = await fetchFormData();
        setFormFields(res);
        setPreview(res?.profileUrl);
    };

    useEffect(() => {
        fromData();
    }, []);

    return (
        <>
           <div className="editProfilepage">
    <h3
        style={{
            textAlign: 'center',
            marginTop: '-1px',
            paddingRight: '15px',
            fontSize: '1.5rem',
            color: '#3B96E1'
        }}
    >
        Profile Details
    </h3>
    <h1
        style={{
            textAlign: 'end',
            marginTop: '-35px',
            paddingRight: '15px',
            cursor:'pointer'
        }}
        onClick={() => setLgShow(false)}
    >
        <img src={Cross} alt="" width={27} />
    </h1>
    <Form onSubmit={handleSubmit}>
        <Row>
            <Col xs={12} className="custom-img">
                <div className="profileImageEdit">
                    <div className="imahesection">
                        <img
                            src={preview}
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                            className="profileView"
                        />
                        <img
                            src={clarity_note_edit_line}
                            alt=""
                            className="profile"
                            style={{cursor:'pointer'}}
                            onClick={() =>
                                profileInputref.current.click()
                            }
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        id="fileInputprofile"
                        style={{ display: 'none' }}
                        onChange={handleProfileUpload}
                        ref={profileInputref}
                    />
                </div>
            </Col>
        </Row>
        <Row className="mt-3">
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    Company name <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                    <Form.Control
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Ex: World Development Corporation"
                        name="company_name"
                        required
                        value={formFields.company_name}
                        onChange={handleFieldChange}
                    />
                </InputGroup>
            </Col>
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    Email <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                    placeholder="email"
                >
                    <Form.Control
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Ex: example@gmail.com"
                        name="email"
                        required
                        value={formFields.email}
                        onChange={handleFieldChange}
                    />
                </InputGroup>
            </Col>
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    Mobile No <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                    

                     <PhoneInput
                              defaultCountry="in"
                             
                              required
                             value={formFields?.mobile}
                             onChange={handlePhoneChange}
                            
                            />
                              {!isValidMobile &&formFields?.mobile&&formFields?.mobile.length>6&& <div style={{ color: 'red',fontSize: '0.7rem',marginTop:'2px'}}>Mobile Number is not valid</div>}
                </InputGroup>
            </Col>
        </Row>
        <Row className="">
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                 Website URL <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                    <Form.Control
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Ex: Company123.com"
                        name="website_url"
                        required
                        value={formFields.website_url}
                        onChange={handleFieldChange}
                    />
                </InputGroup>
            </Col>
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    Contact email address <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                    <Form.Control
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Ex: hr.company@gmail.com"
                        name="contact_email"
                        required
                        value={formFields.contact_email}
                        onChange={handleFieldChange}
                    />
                </InputGroup>
            </Col>
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    Contact No <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                  

<PhoneInput
                              defaultCountry="in"
                             
                              required
                             value={formFields.contact_No}
                             onChange={handleContactNumberChange}
                            
                            />
                            
                              {!isValidContactnumber &&formFields.contact_No&&formFields.contact_No.length>6&& <div style={{ color: 'red',fontSize: '0.7rem',marginTop:'2px'}}>Contact Number is not valid</div>}
                </InputGroup>
            </Col>
        </Row>
        <Row className="">
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    Location(s) <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                    <Form.Control
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Ex: Pune, Mumbai"
                        name="location"
                        required
                        value={formFields.location}
                        onChange={handleFieldChange}
                    />
                </InputGroup>
            </Col>
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    Industry <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                    <Form.Control
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Ex: IT"
                        name="industry"
                        required
                        value={formFields.industry}
                        onChange={handleFieldChange}
                    />
                </InputGroup>
            </Col>
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    Company size <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                    <Form.Control
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Ex: 100-200"
                        name="company_size"
                        required
                        value={formFields.company_size}
                        onChange={handleFieldChange}
                    />
                </InputGroup>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Form.Label className="custom-input-group-label">
                    Overview <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                    <Form.Control
                        as="textarea"
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Enter description about company"
                        name="overView"
                        required
                        value={formFields.overView}
                        onChange={handleFieldChange}
                    />
                </InputGroup>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Form.Label className="custom-input-group-label">
                    Headquarters address <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup
                    size="sm"
                    className="mb-1 custom-input-group"
                >
                    <Form.Control
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Enter full address"
                        name="headQuater_add"
                        required
                        value={formFields.headQuater_add}
                        onChange={handleFieldChange}
                    />
                </InputGroup>
            </Col>
        </Row>
        <Row>
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    GSTIN<span className="text-danger">*</span>
                </Form.Label>
                <div className="verify">
                    <input
                        type="text"
                        placeholder="Ex: PCMNP7474G"
                        name="GST"
                        required
                        value={formFields.GST}
                        onChange={handleFieldChange}
                        readOnly={formFields?.status == 'approve'}
                    />
                    {formFields?.status == 'approve' ?
                        <img src={Verified} alt="" width="30px" /> : null
                    }
                </div>
            </Col>
            <Col xs={12} md={2}>
                {formFields?.status !== 'approve' ? (
                    Gstimage ? (
                        <div className="UploadImagediv">
                            <div
                                style={{
                                    width: '140px',
                                    overflow: 'hidden',
                                    height: '100px',
                                    marginTop: '50px'
                                }}
                            >
                                <img
                                    src={Gstimage}
                                    alt="Uploaded"
                                    style={{
                                        width: '40%'
                                    }}
                                />
                            </div>
                            <img
                                src={Cross}
                                alt=""
                                width="20px"
                                className="cross"
                                onClick={remove_gst}
                            />
                        </div>
                    ) : (
                        <Button
                            className="btn-upload"
                            onClick={() =>
                                document
                                    .getElementById('fileInput')
                                    .click()
                            }
                        >
                            Upload Image
                        </Button>
                    )
                ) : null}
                <input
                    type="file"
                     accept="image/*,application/pdf"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                />
            </Col>
            <Col xs={12} md={4}>
                <Form.Label className="custom-input-group-label">
                    PAN <span className="text-danger">*</span>
                </Form.Label>
                <div className="verify">
                    <input
                        type="text"
                        placeholder="Ex: PCMNP7474G"
                        name="PAN"
                        required
                        value={formFields.PAN}
                        readOnly={formFields?.status == 'approve'}
                        onChange={handleFieldChange}
                    />
                    {formFields?.status == 'approve' ?
                        <img src={Verified} alt="" width="30px" /> : null
                    }
                </div>
            </Col>
            <Col xs={12} md={2}>
                {formFields?.status !== 'approve' ? (
                    Panimage ? (
                        <div className="UploadImagediv">
                            <div
                                style={{
                                    width: '140px',
                                    overflow: 'hidden',
                                    height: '100px',
                                    marginTop: '50px'
                                }}
                            >
                                <img
                                    src={Panimage}
                                    alt="Uploaded"
                                    style={{
                                        width: '40%'
                                    }}
                                />
                            </div>
                            <img
                                src={Cross}
                                alt=""
                                height="20px"
                                className="cross"
                                onClick={remove_pan}
                            />
                        </div>
                    ) : (
                        <Button
                            className="btn-upload"
                            onClick={() =>
                                document
                                    .getElementById('fileInputpan')
                                    .click()
                            }
                        >
                            Upload Image
                        </Button>
                    )
                ) : null}
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    id="fileInputpan"
                    style={{ display: 'none' }}
                    onChange={handleImageUploadPan}
                    ref={fileInputRefPan}
                />
            </Col>
        </Row>
        <Row>
            <Col xs={12} className="mt-3 saveprofile">
                <Button className="saveprofile-btn" type="submit">
                    Update profile
                </Button>
            </Col>
        </Row>
    </Form>
</div>
        </>
    );
};

export default EditCompanyProfile;
