import React from "react";
import "./Footer.css";
import group_business from "../../assets/images/group-business.png";
import Boardsearchvertical_logo from "../../assets/images/Boardsearchvertical_logo.png";
import Facebook_Circled from "../../assets/images/Facebook_Circled.png";
import LinkedIn_Circled from "../../assets/images/LinkedIn_Circled.png";
import Instagram_Circle from "../../assets/images/Instagram_Circle.png";
import Phones from "../../assets/images/Phones.png";
import Letter from "../../assets/images/Letter.png";
import Location from "../../assets/images/Location.png";

import { Button, Container, Form } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <div
        className="Footer-background-container"
        style={{
          backgroundImage: `url(${group_business})`,
        }}
      >
        <div className="Footer_Sub_container">

            <div className="Foooter_section_container">
                {/* firsttab */}
                <div className="Footer_first_tab_container">
                    <div className="Footer_logo_container">
                        <img className="Footer_logo" src={Boardsearchvertical_logo} width='400px'/>
                    </div>
                    <div className="Footer_container_details" style={{color:'white',fontSize:"15px", fontFamily: "Nunito Sans" }}>
                    Whether you're a candidate seeking your next 
opportunity or a company looking for top talent, 
our AI-powered platform has you covered.
                    </div>
                    <div className="footer_contact_tab">
                    <a
                            href="https://www.facebook.com/profile.php?id=61569318327675"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img width="50px" height='40px' src={Facebook_Circled}/>
                        </a>
                       
                        <a
                            href="https://www.linkedin.com/showcase/105695325/admin/dashboard/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                           <img width="50px" height='40px' src={LinkedIn_Circled}/>
                        </a>
                        
                        <a
                            href="https://www.instagram.com/boardsearch.ai/profilecard/?igsh=MWQ5dGo0ZGM4dGl2eA=="
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                             <img width="50px" height='40px' src={Instagram_Circle}/>
                        </a>
                    </div>

                </div>



                {/* Line */}
                <div  className="divider"
            style={{
              backgroundColor: "white",
              width: "1.5px",
              height: "270px",
            }}></div>

                {/* lastfooter */}
                <div className="footer_last_tab_container">
                    <p style={{color:'white',fontSize:"18px", fontFamily: "Nunito Sans" }}>Get In Touch With Us</p>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'start',alignContent:'center',textAlign:'center',gap:'2px'}}>
                    <img src={Phones} width='25px' height='auto'/>
                    <p style={{color:'white',fontSize:"15px", fontFamily: "Nunito Sans" }}> {'   '}  +91 7420002760</p>
                    </div>
                    
                    <p style={{color:'white',fontSize:"15px", fontFamily: "Nunito Sans" }}><img src={Letter}/>   {'   '}subscriber@boardsearch.ai </p>

                    {/* <p style={{color:'white',fontSize:"15px", fontFamily: "Nunito Sans" }}><img src={Location} /> {`   `}   Unit 503 & 504, Tower 1, World Trade Centre, Opp. Eon IT Park, Dhole Patil Road, Kharadi, Pune - 14 </p> */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", fontSize: "13px", fontFamily: "Nunito Sans",marginTop:"-20px" }}>
  <img src={Location} alt="Location Icon" />
  <p style={{marginTop:"25px"}}>Unit 4, Tower 1, World Trade Centre, Opp. Eon IT Park, Dhole Patil Road, Kharadi, Pune - 14</p>
</div>

                </div>
            </div>
            <p style={{color:'white',fontSize:"15px",marginTop:'20px', fontFamily: "Nunito Sans" }}>©2025 by BoardSearch</p>

        </div>
      </div>
    </>
  );
};

export default Footer;