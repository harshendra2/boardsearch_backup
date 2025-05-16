import React, { useState } from "react";
import "./Form.css";
import Hande_image from "../../assets/images/Hande-images.png";
import { Button, Container, Form ,Spinner} from "react-bootstrap";
import axios from "axios"
import BaseUrl from '../../services/BaseUrl';
import { toast } from "react-toastify";
const LandingPageForm = () => {
  const [state,SetState]=useState({
                                   firstName:"",
                                   lastName:"",
                                   Phone:"",
                                   Email:"",
                                   OrganisationName:"",
                                   YourDesignation:"",
                                   agreement:false
                                  });

                                  const [loading,SetLoading]=useState(false)

                                  const [errors, setErrors] = useState({});

                                  const validate = () => {
                                    let tempErrors = {};
                                    if (!state.firstName) tempErrors.firstName = "First name is required";
                                    if (!state.lastName) tempErrors.lastName = "Last name is required";
                                    if (!state.Phone) {
                                      tempErrors.Phone = "Phone number is required";
                                    } else if (!/^[0-9]{10,15}$/.test(state.Phone)) {
                                      tempErrors.Phone = "Enter a valid phone number";
                                    }
                                    if (!state.Email) {
                                      tempErrors.Email = "Email is required";
                                    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(state.Email)) {
                                      tempErrors.Email = "Enter a valid email";
                                    }
                                    if (!state.agreement) tempErrors.agreement = "You must agree to proceed";
                                    
                                    setErrors(tempErrors);
                                    return Object.keys(tempErrors).length === 0;
                                  };
                                


  const HandleChange = (e) => {
    const { name, type, value, checked } = e.target;
    SetState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors({ ...errors, [name]: "" });
  };


   const Sendmail = async () => {
    if (!validate()) return;
          try {
            SetLoading(true)
              const response = await axios.post(
                  `${BaseUrl}admin/Send_mail/enquiry`,
                    state 
              );
              if(response.status==200||response.status==201){
                SetLoading(false)
                SetState({
                  firstName:"",
                  lastName:"",
                  Phone:"",
                  Email:"",
                  OrganisationName:"",
                  YourDesignation:"",
                  agreement:false
                 })
                toast.success("Enquiry form submitted successfully!");
              }
          } catch (error){
            SetLoading(false)
          }
      };
                                
  return (
    <>
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${Hande_image})`,
        }}
      >
        <div className="Sub_container">
          <div className="heading_container">
            <h1 className="headdings" style={{fontFamily:'Poppins'}}>Fill the Enquiry Form </h1>
          </div>

          <div className="Form_main_container">
            <div className="Form_main">
              <Form.Group>
                <Form.Label style={{ color: "white",fontFamily: "Nunito Sans" }}>First Name *</Form.Label>
                <Form.Control
                  className="FormInput"
                  type="text"
                  required
                  placeholder="Enter Your First Name"
                  name="firstName"
                  value={state?.firstName}
                  onChange={HandleChange}
                />
                 {errors.firstName && <p style={{color:'red',fontSize:"0.8rem",marginBottom:'-17px'}} className="error-text">{errors.firstName}</p>}
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ color: "white",fontFamily: "Nunito Sans"  }}>Last Name *</Form.Label>
                <Form.Control
                  className="FormInput"
                  type="text"
                  name="lastName"
                  required
                  value={state.lastName}
                  placeholder="Enter Your Last Name"
                  onChange={HandleChange}
                />
                 {errors.lastName && <p style={{color:'red',fontSize:"0.8rem",marginBottom:'-17px'}} className="error-text">{errors.lastName}</p>}
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ color: "white" ,fontFamily: "Nunito Sans" }}>
                  Phone (With Country Code) *
                </Form.Label>
                <Form.Control
                  className="FormInput"
                  type="tel"
                  name="Phone"
                  required
                  value={state.Phone}
                  placeholder="Enter Your Phone Number"
                  onChange={HandleChange}
                />
                 {errors.Phone && <p style={{color:'red',fontSize:"0.8rem",marginBottom:'-17px'}} className="error-text">{errors.Phone}</p>}
              </Form.Group>
              <Form.Group    className="form_aggrement">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px",fontFamily: "Nunito Sans"  }}
                >
                  <Form.Check
                    type="checkbox"
                    name="agreement"
                    checked={state.agreement}
                    onChange={HandleChange}
                    style={{ width: "30px", height: "30px", cursor: "pointer" }}
                  />
                  <Form.Label
                    style={{
                      color: "white",
                      fontSize: "16px",
                      lineHeight: "1.5",
                      fontFamily: "Nunito Sans" 
                    }}
                  
                  >
                    I agree to be contacted by the BoardSearch team for any
                    <br />
                    activities related to this website via calls, WhatApp and
                    Email.
                    <br />
                    (Note: The BoardSearch Team is strictly against spamming.)*
                  </Form.Label>
                </div>
              </Form.Group>
            </div>

            <div className="Form_main">
              <Form.Group>
                <Form.Label style={{ color: "white",fontFamily: "Nunito Sans"  }}>
                  Office Email Address *
                </Form.Label>
                <Form.Control
                  className="FormInput"
                  type="email"
                  name="Email"
                  required
                  value={state.Email}
                  placeholder="Enter Your Work Email"
                  onChange={HandleChange}
                />
                 {errors.Email && <p style={{color:'red',fontSize:"0.8rem",marginBottom:'-17px'}} className="error-text">{errors.Email}</p>}
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ color: "white",fontFamily: "Nunito Sans"  }}>
                  Organisation Name 
                </Form.Label>
                <Form.Control
                  className="FormInput"
                  type="text"
                  name="OrganisationName"
                  value={state.OrganisationName}
                  placeholder="Enter Your Organisation Name"
                  onChange={HandleChange}
                />
                 {errors.OrganisationName && <p style={{color:'red',fontSize:"0.8rem",marginBottom:'-17px'}} className="error-text">{errors.OrganisationName}</p>}
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ color: "white",fontFamily: "Nunito Sans"  }}>
                  Your Designation
                </Form.Label>
                <Form.Control
                  className="FormInput"
                  type="text"
                  name="YourDesignation"
                  value={state.YourDesignation}
                  placeholder="Enter Your Designation"
                  onChange={HandleChange}
                />
                 {errors.YourDesignation && <p style={{color:'red',fontSize:"0.8rem",marginBottom:'-17px'}} >{errors.YourDesignation}</p>}
              </Form.Group>

              <Form.Group    className="form_aggrements">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px",marginLeft:'10px',fontFamily: "Nunito Sans"  }}
                >
                  <Form.Check
                    type="checkbox"
                    name="agreement"
                    checked={state.agreement}
                    onChange={HandleChange}
                    style={{ width: "30px", height: "30px", cursor: "pointer",fontFamily: "Nunito Sans"  }}
                  />
                  <Form.Label
                    style={{
                      color: "white",
                      fontSize: "16px",
                      lineHeight: "1.5",
                      fontFamily: "Nunito Sans" 
                    }}
                  >
                    I agree to be contacted by the BoardSearch
                   
                    team for any
                    activities related to this website via calls,
                   WhatApp and Email.
                   
                    (Note: The BoardSearch Team is strictly against spamming.)*
                  </Form.Label>
                </div>
              </Form.Group>

              <Form.Group className="Button_cont">
                {loading?(
 <Button style={{backgroundColor: state?.agreement ? "#1E3449" : "#1E3449"}}  className="Button" >
 <Spinner size="sm" />{' '}
</Button>
                ):(
                  <Button disabled={!state?.agreement} onClick={Sendmail} style={{backgroundColor: state?.agreement ? "#1E3449" : "#1E3449"}} className="Button">Submit</Button>
                )}
               
              </Form.Group>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPageForm;
