import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import axios from "axios";
import '../../css/style.css';

function CategoryReport() {
    const [categoryReport, setCategoryReport] = useState(null);
    const nav = useNavigate();
    const done = () => {
        nav('/dashboard');
    };
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);

    useEffect(() => {
        if (!userJsonString) {
            nav("/login");
        }
    }, [userJsonString, nav]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/report/category_report');
                const data = response.data;
                setCategoryReport(data);
            } catch (error) {
                console.error('Error fetching category report:', error);
            }
        };

        fetchData();
    }, []);

    if (!categoryReport) {
        return <div>Loading...</div>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg">
            <MDBContainer className="border rounded-lg">
                <fieldset>
                    <legend>Category Report</legend>
                    <MDBRow className="justify-content-center">
                        <MDBCol md="2">
                            <strong>Category</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Total Items</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Min Price</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Max Price</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Average Price</strong>
                        </MDBCol>
                    </MDBRow>
                    {categoryReport && categoryReport.map(b => (
                        <MDBRow className="justify-content-center">
                            <MDBCol md="2">
                                {b.category || '-'}
                            </MDBCol>
                            <MDBCol md="2">
                                {b.totalItems || '-'}
                            </MDBCol>
                            <MDBCol md="2">
                                {b.minPrice || '-'}
                            </MDBCol>
                            <MDBCol md="2">
                                {b.maxPrice || '-'}
                            </MDBCol>
                            <MDBCol md="2">
                                {b.avgPrice || '-'}
                            </MDBCol>
                        </MDBRow>
                    ))}
                    <MDBRow className="justify-content-end p-3">
                        <MDBBtn type="button" className="mb-4 d-block btn-primary"
                                style={{height: '40px', width: '100px'}}
                                onClick={e => done(e)}>
                            Done
                        </MDBBtn>
                    </MDBRow>
                </fieldset>
            </MDBContainer>
        </div>
    )
}

export default CategoryReport;