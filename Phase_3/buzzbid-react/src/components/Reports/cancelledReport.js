import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import axios from "axios";
import NavigationBar from "../NavigationBar/NavigationBar";
import '../../css/style.css';

function CancelledReport() {
    const [cancelledReport, setCancelledReport] = useState(null);
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
                const response = await axios.get('http://localhost:8081/report/cancelled_report');
                const data = response.data;
                setCancelledReport(data);
            } catch (error) {
                console.error('Error fetching user report:', error);
            }
        };

        fetchData();
    }, []);

    if (!cancelledReport) {
        return <div>Loading...</div>;
    }

    return (
        <div className="outer-container">
            <NavigationBar/>
            <div className="d-flex justify-content-center align-items-center">
                <div className="bg border rounded-lg" style={{width: '1250px'}}>
                    <MDBContainer>
                        <fieldset>
                            <legend>Cancelled Auction Details</legend>
                            <MDBRow className="justify-content-center">
                                <MDBCol md="3">
                                    <strong>ID</strong>
                                </MDBCol>
                                <MDBCol md="3">
                                    <strong>Listed by</strong>
                                </MDBCol>
                                <MDBCol md="3">
                                    <strong>Cancelled Date</strong>
                                </MDBCol>
                                <MDBCol md="3">
                                    <strong>Reason</strong>
                                </MDBCol>
                            </MDBRow>
                            {cancelledReport && cancelledReport.map(b => (
                                <MDBRow className="justify-content-center">
                                    <MDBCol md="3">
                                        {b.itemID}
                                    </MDBCol>
                                    <MDBCol md="3">
                                        {b.listedBy}
                                    </MDBCol>
                                    <MDBCol md="3">
                                        {b.cancelledDate}
                                    </MDBCol>
                                    <MDBCol md="3">
                                        {b.reason}
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
            </div>
        </div>
    )
}

export default CancelledReport;