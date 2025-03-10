import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import { toast } from 'react-toastify';
import BaseUrl from '../../services/BaseUrl';
export const SearchJobContext = createContext();

let Years = [
    { year: 1, text: '0-1 Yrs' },
    { year: 2, text: '2 Yrs' },
    { year: 3, text: '3 Yrs' },
    { year: 4, text: '4 Yrs' },
    { year: 5, text: '5 Yrs' },
    { year: 6, text: '6 Yrs' },
    { year: 7, text: '7 Yrs' },
    { year: 8, text: '8 Yrs' },
    { year: 9, text: '9 Yrs' },
    { year: 10, text: '10 Yrs' },
    { year: 11, text: '11 Yrs' },
    { year: 12, text: '12 Yrs' },
    { year: 13, text: '13 Yrs' },
    { year: 14, text: '14 Yrs' },
    { year: 15, text: '15 Yrs' },
    { year: 16, text: '16 Yrs' },
    { year: 17, text: '17 Yrs' },
    { year: 18, text: '18 Yrs' },
    { year: 19, text: '19 Yrs' },
    { year: 20, text: '20 Yrs' },
    { year: 21, text: '21 Yrs' },
    { year: 22, text: '22 Yrs' },
    { year: 23, text: '23 Yrs' },
    { year: 24, text: '24 Yrs' },
    { year: 25, text: '25 Yrs' }
];

export const SearchJobProvider = ({ children }) => {
    const [years, setYears] = useState(Years);
    const [initialFetch, setInitailFrtch] = useState('initialFetch');
    const [hasMore, setHasMore] = useState(true);
    const [visibleItems, setVisibleItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [JobData, setJobdata] = useState();
    const [totalPage, SetTotalPage] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectValue, setselectValue] = useState(itemsPerPage);
    const [JobLinkExist,SetLinkExist]=useState(false)

    const fetch_search_job = async () => {
        const token = localStorage.getItem('Candidate_token');
        if (!token) {
        } else {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?._id;
            try {
                const response = await axios.get(
                    `${BaseUrl}candidate/getunappliedjob/${userId}/${currentPage}/${selectValue}/${JobLinkExist}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`
    
                        }
                    } 
                );
                let data = response?.data?.data;
                let page = response?.data?.totalPages;
                setInitailFrtch('initialFetch');
                SetTotalPage(page);

                setVisibleItems(data);
            } catch (err) {
                // setHasMore(false);
            }
        }
    };

    const handleSelect = e => {
        const value = parseInt(e.target.value, 10);

        setselectValue(value);
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when items per page change
    };

    const handlePageChange = pageNumber => {
        if (pageNumber >= 1 && pageNumber <= totalPage)
            setCurrentPage(pageNumber);
    };

    const applyTo_job = async jobId => {
        const token = localStorage.getItem('Candidate_token');
        if (!token) {
            return;
        } else {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?._id;
            try {
                const response = await axios.post(
                    `${BaseUrl}candidate/jobapply/${userId}/${jobId}`,
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${token}`
    
                        }
                    } 
                );
                if (response.status == 200 || response?.status == 201) {
                    toast.success('Job Applied successfully ');
                    fetch_search_job();
                }
            } catch (error) {}
        }
    };

    const save_job = async jobId => {
        const token = localStorage.getItem('Candidate_token');
        if (!token) {
            return;
        } else {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?._id;
            try {
                const response = await axios.post(
                    `${BaseUrl}candidate/savejob/${userId}/${jobId}`,
                    {},
                    {
                        headers: {
                            authorization:`Bearer ${token}`
    
                        }
                    } 
                );
                if (response.status == 200 || 201) {
                    toast.success('Job Saved successfully');
                    fetch_search_job();
                }
            } catch (error) {}
        }
    };
    const getSingleJobDetails = async id => {
        const token = localStorage.getItem('Candidate_token');
        try {
            const response = await axios.get(
                `${BaseUrl}candidate/getjobdetails/${id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`

                    }
                } 
            );

            setJobdata(response?.data);
        } catch (error) {}
    };

    return (
        <SearchJobContext.Provider
            value={{
                years,
                selectValue,
                JobData,
                setJobdata,
                fetch_search_job,
                applyTo_job,
                save_job,
                hasMore,
                visibleItems,
                setVisibleItems,
                currentPage,
                setCurrentPage,
                getSingleJobDetails,
                handleSelect,
                handlePageChange,
                totalPage,
                SetTotalPage,
                initialFetch,
                setInitailFrtch,
                JobLinkExist,SetLinkExist
            }}
        >
            {children}
        </SearchJobContext.Provider>
    );
};
