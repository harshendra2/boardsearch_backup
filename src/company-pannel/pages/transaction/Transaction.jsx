import React, { useEffect, useState } from 'react';
import { Col, Pagination, Row, Table } from 'react-bootstrap';
import arrowdown from '../../../assets/images/arrowdown.png';
import TrasactionsData from '../../../hooks/company_dashboard/TrasactionsData';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { initGA, trackEvent } from "../../../analytics";
const Transaction = () => {
    const { transactionData } = TrasactionsData(); // Fetch the data
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(7);
    const [selectValue, setSelectValue] = useState(itemsPerPage);

    const handleSelect = e => {
        const value = parseInt(e.target.value, 10);
        setItemsPerPage(value);
        setSelectValue(value);
        setCurrentPage(1); // Reset to first page when items per page change
    };

    const handlePageChange = pageNumber => {
        setCurrentPage(pageNumber);
    };

    // Ensure transactionData is an array before trying to paginate
    const isTransactionDataArray = Array.isArray(transactionData);

    // Fallback to an empty array if transactionData is not an array
    const validTransactionData = isTransactionDataArray ? transactionData : [];

    const totalItems = validTransactionData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current items based on pagination
    const currentItems = validTransactionData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatDate = dateString => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options); // 'en-GB' for DD/MM/YYYY format
    };

    function toCamelCase_Name(input) {
        if (typeof input == 'string') {
            return input
                ? input
                      .toLowerCase()
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                : null;
        } else {
            return input;
        }
    }

    useEffect(() => {
        initGA();  // Initialize Google Analytics
        trackEvent("Button", "Transaction", "BoardSearch Company");
      }, []);
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Transaction</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <div className="transaction">
                <Row
                    style={{
                        borderRadius: '12px',
                        background: '#fff',
                        marginLeft: '2px',
                        marginTop: '20px'
                    }}
                >
                    <Col xs={12} style={{ marginTop: '6px', width: '100%'}}>
                        <Table bordered responsive
                        striped
                       
                        >
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            fontSize: '0.8rem',
                                            borderLeft: '1px solid #dee2e6' // Ensure border is applied
                                        }}
                                        className="p-3"
                                        scope="col"
                                    >
                                        Sr.no
                                    </th>
                                    <th
                                        className="p-3"
                                        scope="col"
                                        style={{ fontSize: '0.8rem', borderLeft: '1px solid #dee2e6' }}
                                    >
                                        Type
                                    </th>
                                    <th
                                        className="p-3"
                                        scope="col"
                                        style={{ fontSize: '0.8rem', borderLeft: '1px solid #dee2e6' }}
                                    >
                                        Plan / Top-Up Name
                                    </th>
                                    <th
                                        className="p-3"
                                        scope="col"
                                        style={{ fontSize: '0.8rem', borderLeft: '1px solid #dee2e6' }}
                                    >
                                        Duration
                                    </th>
                                    <th
                                        className="p-3"
                                        scope="col"
                                        style={{ fontSize: '0.8rem', borderLeft: '1px solid #dee2e6' }}
                                    >
                                        Amount
                                    </th>
                                    <th
                                        className="p-3"
                                        scope="col"
                                        style={{ fontSize: '0.8rem', borderLeft: '1px solid #dee2e6' }}
                                    >
                                        Transaction ID
                                    </th>
                                    <th
                                        className="p-3"
                                        scope="col"
                                        style={{ fontSize: '0.8rem', borderLeft: '1px solid #dee2e6' }}
                                    >
                                        Purchased Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '0.8rem' }}>
                                {currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ borderLeft: '1px solid #dee2e6' }}>
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td style={{ borderLeft: '1px solid #dee2e6' }}>{item?.type}</td>
                                        <td style={{ borderLeft: '1px solid #dee2e6' }}>
                                            {toCamelCase_Name(item?.Plane_name)}
                                        </td>
                                        <td style={{ borderLeft: '1px solid #dee2e6' }}>
                                            {item?.purchesed_data
                                                ? `${formatDate(item?.purchesed_data)} -
                                          ${formatDate(item?.Expire_date)}`
                                                : 'N/A'}
                                        </td>
                                        <td style={{ borderLeft: '1px solid #dee2e6' }}>
                                            <span
                                                style={{
                                                    fontWeight: '600',
                                                    fontSize: '1rem',
                                                    marginRight: '4px'
                                                }}
                                            >
                                                &#8377;
                                            </span>
                                            {item?.price}
                                        </td>
                                        <td style={{ borderLeft: '1px solid #dee2e6' }}>{item?.transaction_Id}</td>
                                        <td style={{ borderLeft: '1px solid #dee2e6' }}>
                                            {item?.purchesed_data
                                                ? formatDate(item?.purchesed_data)
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                    <Row
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingRight: '20px'
                        }}
                    >
                        <Col
                            xs={8}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end'
                            }}
                        >
                            {/* Pagination controls */}
                            <span
                                style={{
                                    fontSize: '0.7rem',
                                    marginRight: '20px',
                                    fontWeight: '600'
                                }}
                            >
                                Result per page
                            </span>
                            <Col xs={2}>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    onChange={handleSelect}
                                    value={selectValue}
                                    style={{
                                        fontSize: '0.6rem',
                                        background: '#3B96E1',
                                        color: 'white',
                                        fontWeight: '600',
                                        width: '60px',
                                        height: '36px',
                                        backgroundImage: `url(${arrowdown})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.5rem center',
                                        appearance: 'none',
                                        backgroundSize: '20px',
                                        padding: '10px 10px'
                                    }}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="6">6</option>
                                    <option value="8">8</option>
                                    <option value="10">10</option>
                                </select>
                            </Col>
                            <Col
                                xs={2}
                                style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '600'
                                }}
                            >
                                {currentPage}-{itemsPerPage} out of {totalItems}
                            </Col>
                            <Col
                                xs={2}
                                style={{
                                    marginTop: '20px',
                                    marginRight: '-160px'
                                }}
                            >
                                <Pagination className="custom-pagination">
                                    <Pagination.First
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                    />
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    />
                                    <Pagination.Item active>
                                        {currentPage}
                                    </Pagination.Item>
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                    <Pagination.Last
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </Col>
                        </Col>
                    </Row>
                </Row>
            </div>
        </>
    );
};

export default Transaction;