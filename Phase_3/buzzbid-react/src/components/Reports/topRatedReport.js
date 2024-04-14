import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import axios from "axios";
import NavigationBar from "../NavigationBar/NavigationBar";
import '../../css/style.css';

function TopRatedReport() {
    const [topRatedReport, setRatedReport] = useState(null);
    const nav = useNavigate();
    const done = () => {
        nav('/dashboard');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/report/toprate_report');
                const data = response.data;
                setRatedReport(data);
            } catch (error) {
                console.error('Error fetching user report:', error);
            }
        };

        fetchData();
    }, []);

    if (!topRatedReport) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <NavigationBar/>
        <div className="d-flex justify-content-center align-items-center vh-100 bg">
            <MDBContainer className="border rounded-lg">
                <fieldset>
                    <legend>Top Rated Items</legend>
                    <MDBRow className="justify-content-center">
                        <MDBCol md="3">
                            <strong>Item Name</strong>
                        </MDBCol>
                        <MDBCol md="3">
                            <strong>Average Rating</strong>
                        </MDBCol>
                        <MDBCol md="3">
                            <strong>Rating Count</strong>
                        </MDBCol>
                    </MDBRow>
                    {topRatedReport && topRatedReport.map(b => (
                        <MDBRow className="justify-content-center">
                            <MDBCol md="3">
                                {b.itemName}
                            </MDBCol>
                            <MDBCol md="3">
                                {b.avgRating}
                            </MDBCol>
                            <MDBCol md="3">
                                {b.ratingCount}
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
        </>
    )
}

export default TopRatedReport;