import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Image, Spinner, Form } from 'react-bootstrap';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Verified from '../../../../assets/images/Verified.png';
import { AppliedJobContext } from '../../../../context/candidateContext/AppliedJobContext';
import altprofile from '../../../../assets/images/altprofile.jpg';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import BaseUrl from '../../../../services/BaseUrl';
const AppliedJobs = () => {
    const { id } = useParams();
    const {
        fetch_applied_job,
        appliedJobData,
        setAppliedJobData,
        setCurrentPage,
        hasMore
    } = useContext(AppliedJobContext);
    const [seletedValue, setSelectedValue] = useState('All');

    const navigate = useNavigate();
    const handleNavigate = id => {
        localStorage.setItem('job_id', id);
        navigate(`/candidate-dashboard/viewAppliedJobDetails/${id}`);
    };
    const formatDate = dateString => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000); // convert ms to minutes

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
    };

    const handleSelectchange = async e => {
        const { value } = e.target;

        setSelectedValue(value);

        if (value) {
            await fetch_applied_job(value);
        }
    };
    useEffect(() => {
        if (appliedJobData && appliedJobData.length == 0) {
            fetch_applied_job();
        }
    }, []);

    useEffect(() => {
        return () => {
            setAppliedJobData([]);
            setCurrentPage(1);
            setSelectedValue('All');
        };
    }, []);

    return (
        <>
            <InfiniteScroll
                style={{ height: '100vh', marginTop: '10px' }}
                dataLength={appliedJobData && appliedJobData.length}
                next={fetch_applied_job}
                hasMore={hasMore}
                loader={
                    <div style={{ textAlign: 'center' }}>
                        {appliedJobData &&
                        appliedJobData.length < 1 &&
                        hasMore == true ? (
                            <Spinner size="sm" variant="primary" />
                        ) : null}
                    </div>
                }
                endMessage={
                    appliedJobData && appliedJobData.length > 1 ? (
                        <p className="text-center mt-4">
                            No more data to show...
                        </p>
                    ) : null
                }
                height={540}
            >
                <div style={{marginTop:'5%'}}></div>
                <div className="appliedJobs-card-div">
                    {appliedJobData && appliedJobData.length > 0 ? (
                        appliedJobData.map((item, index) => (
                            <div
                                className="card-job"
                                style={{ cursor: 'pointer'}}
                                onClick={() => handleNavigate(item?._id)}
                                key={index}

                            >
                                <div className="search-job-top">
                                    <Image
                                        src={
                                            item?.profileUrl
                                                ? item?.profileUrl
                                                : altprofile
                                        }
                                        roundedCircle
                                        alt="Profile"
                                        width="40" // Set the desired width
                                        height="40" // Set the desired height
                                    />
                                    <h6>
                                        {item?.job_title.length > 22
                                                ? `${item.job_title.substring(
                                                      0,
                                                      22
                                                  )}...`
                                                : item?.job_title}
                                        <p
                                            style={{
                                                color: '#3B96E1',

                                                fontSize: '0.8rem',
                                                width: '180px' /* Adjust this value to your desired width */,
                                                wordWrap: 'break-word'
                                            }}
                                        >
                                           
                                                {item?.company_details
                                                ?.company_name.length > 22
                                                ? `${item?.company_details
                                                    ?.company_name.substring(
                                                      0,
                                                      22
                                                  )}...`
                                                : item?.company_details?.company_name}
                                        </p>
                                    </h6>
                                    <div className="green-thik">
                                        {item?.Green_Batch ? (
                                            <img
                                                src={Verified}
                                                alt=""
                                                height="20px"
                                            />
                                        ) : null}
                                    </div>
                                </div>

                                <div>
                                    <table
                                        style={{
                                            cursor: 'pointer',
                                            marginTop: '-4px'
                                        }}
                                    >
                                        <tr>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    paddingRight: '30px'
                                                }}
                                            >
                                                <span className="card-table-span">
                                                    Experience:
                                                </span>{' '}
                                            </td>
                                            <td>
                                                {' '}
                                                <span className="card-table-span">
{item?.experience &&
                                              item?.experience.length > 13
                                                    ? `${item?.experience.substring(
                                                          0,
                                                          13
                                                      )}...`
                                                    :`${item?.experience} Years`||'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    paddingRight: '30px'
                                                }}
                                            >
                                                <span className="card-table-span">
                                                    Location:
                                                </span>{' '}
                                            </td>
                                            <td>
                                                {' '}
                                                <span className="card-table-span">
                                                    {item?.location
                                                        ? item.location.length >
                                                          13
                                                            ? `${item.location.substring(
                                                                  0,
                                                                  13
                                                              )}...`
                                                            : item.location
                                                        : 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    paddingRight: '30px'
                                                }}
                                            >
                                                <span className="card-table-span">
                                                    Salary:
                                                </span>{' '}
                                            </td>
                                            <td>
                                                {' '}
                                                <span className="card-table-span">
                                                {item?.salary &&
                                                        item?.salary.length > 10
                                                            ? `${item.salary.substring(
                                                                  0,
                                                                  12
                                                              )}...`
                                                            : item?.salary}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    paddingRight: '30px'
                                                }}
                                            >
                                                <span className="card-table-span">
                                                    Qualification:
                                                </span>{' '}
                                            </td>
                                            <td>
                                                {' '}
                                                <span className="card-table-span">
                                                    {item?.education
                                                        ? item.education
                                                              .length > 15
                                                            ? `${item.education.substring(
                                                                  0,
                                                                  15
                                                              )}...`
                                                            : item.education
                                                        : 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    paddingRight: '30px'
                                                }}
                                            >
                                                <span className="card-table-span">
                                                    Posted:
                                                </span>{' '}
                                            </td>
                                            <td>
                                                {' '}
                                                <span className="card-table-span">
                                                    {formatDate(
                                                        item?.createdDate
                                                    )}{' '}
                                                </span>
                                            </td>
                                        </tr>
                                    </table>
                                    <div
                                        className="search-job-bnt mt-2"
                                        // onClick={handleNavigate}
                                    >
                                        <Button
                                            size="sm"
                                            style={{
                                                background: '#B4DDFF',
                                                color: '#3B96E1',
                                                width: '100%',
                                                border: 'none'
                                            }}
                                        >
                                            Applied
                                        </Button>
                                    </div>
                                    <div className="status-div ">
                                        <p>Status:</p>
                                        <p
                                            className="application-p"
                                            style={{
                                                color:
                                                    item?.Shortlisted.length ==
                                                    0
                                                        ? '#3B96E1'
                                                        : item?.Shortlisted
                                                              ?.length !== 0 &&
                                                          item?.Shortlisted[0]
                                                              ?.shorted_status ==
                                                              false &&
                                                          item?.Shortlisted[0]
                                                              ?.reject_status ==
                                                              false
                                                        ? 'green'
                                                        : item?.Shortlisted[0]
                                                              ?.shorted_status ==
                                                              true &&
                                                          item?.Shortlisted[0]
                                                              ?.short_Candidate
                                                              ?.offer_accepted_status ==
                                                              'Processing'
                                                        ? 'green'
                                                        : item?.Shortlisted[0]
                                                              ?.reject_status ==
                                                          true
                                                        ? 'red'
                                                        : item?.Shortlisted[0]
                                                              ?.short_Candidate
                                                              ?.offer_accepted_status ==
                                                          'Processing'
                                                        ? '#3B96E1'
                                                        : item?.Shortlisted[0]
                                                              ?.short_Candidate
                                                              ?.offer_accepted_status ==
                                                          'Accepted'
                                                        ? 'green'
                                                        : 'red'
                                            }}
                                        >
                                            {item?.Shortlisted.length == 0
                                                ? 'Application send'
                                                : item?.Shortlisted?.length !==
                                                      0 &&
                                                  item?.Shortlisted[0]
                                                      ?.shorted_status ==
                                                      false &&
                                                  item?.Shortlisted[0]
                                                      ?.reject_status == false
                                                ? 'Application Shortlisted'
                                                : item?.Shortlisted[0]
                                                      ?.shorted_status ==
                                                      true &&
                                                  item?.Shortlisted[0]
                                                      ?.short_Candidate
                                                      ?.offer_accepted_status ==
                                                      'Processing'
                                                ? 'Job offered'
                                                : item?.Shortlisted[0]
                                                      ?.reject_status == true
                                                ? 'Application Rejected'
                                                : item?.Shortlisted[0]
                                                      ?.short_Candidate
                                                      ?.offer_accepted_status ==
                                                  'Processing'
                                                ? 'Application processing'
                                                : item?.Shortlisted[0]
                                                      ?.short_Candidate
                                                      ?.offer_accepted_status ==
                                                  'Accepted'
                                                ? 'Hired'
                                                : 'Job offer rejected'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-jobs-container">
                            <span>You haven't applied to any jobs yet.</span>
                        </div>
                    )}
                </div>
            </InfiniteScroll>
        </>
    );
};

export default AppliedJobs;
