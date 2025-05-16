import React, { useEffect, useState } from "react";
import "./Body.css";
import markman from "../../assets/images/markman.png";
import Company from "../../assets/images/Company.png";
import Interview from "../../assets/images/Interview.png";
import { Container, Image } from "react-bootstrap";

const BoardSearchpool = () => {
  return (
    <>
      <Container className="body-container">
        <div
          className="sub_contans"
        >
          <div style={{ display: "flex", flexDirection: "row", gap: "50px" }} >
            <div style={{ width: "220px" }} className="MarkMan">
              <img src={markman} width="100%" />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "30px" }}
            >
              <div style={{ width: "90px" }}>
                <img src={Interview} width="100%" />
              </div>
              <div>
                <h1
                  style={{
                    color: "white",
                    fontFamily:
                      "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                    fontSize: "22px",
                    fontWeight: "bolder",
                  }}
                >
                  For Candidates
                </h1>
              </div>
              <div
                style={{
                  marginLeft: "-15px",
                  marginTop: "-10px",
                  fontSize: "18px",
                  color: "white",
                }}
              >
                <ul>
                  <li>Tailored Job Recommendations</li>
                  <li>Discover Relevant Roles</li>
                  <li>Save Time</li>
                  <li>Stay Updated</li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className="divider"
            style={{
              backgroundColor: "white",
              width: "1.5px",
              height: "350px",
            }}
          ></div>

          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <div style={{ width: "90px" }}>
              <img src={Company} width='100%'/>
            </div>
            <div>
            <h1
                 style={{
                    color: "white",
                    fontFamily:
                      "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                      fontSize: "22px",
                    fontWeight: "bolder",
                  }}
              >
                For Companies
              </h1>
            </div>
            <div  style={{
                  marginLeft: "-15px",
                  marginTop: "-10px",
                  fontSize: "18px",
                  color: "white",
                }}>
              <ul>
                <li>Find Top Talent Quickly</li>
                <li>Enhanced Candidate Filtering</li>
                <li>Reduce Hiring Time</li>
                <li>Continuous Improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default BoardSearchpool;
