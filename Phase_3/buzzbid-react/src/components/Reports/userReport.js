import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import axios from "axios";

function UserReport() {
    const [userReport, setUserReport] = useState(null);
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
                const response = await axios.get('http://localhost:8081/report/user_report');
                const data = response.data;
                setUserReport(data);
            } catch (error) {
                console.error('Error fetching user report:', error);
            }
        };

        fetchData();
    }, []);

    if (!userReport) {
        return <div>Loading...</div>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <MDBContainer className="border rounded-lg" style={{width: '2000px', height: "auto"}}>
                <fieldset>
                    <legend>User Report</legend>
                    <MDBRow className="justify-content-center">
                        <MDBCol md="2">
                            <strong>User name</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Listed</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Sold</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Won</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Rated</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong style={{fontSize: 16}}>Most Frequent Condition</strong>
                        </MDBCol>
                    </MDBRow>
                    {userReport && userReport.map(b => (
                        <MDBRow className="justify-content-center">
                            <MDBCol md="2">
                                {b.userName}
                            </MDBCol>
                            <MDBCol md="2">
                                {b.listed}
                            </MDBCol>
                            <MDBCol md="2">
                                {b.sold}
                            </MDBCol>
                            <MDBCol md="2">
                                {b.won}
                            </MDBCol>
                            <MDBCol md="2">
                                {b.rated}
                            </MDBCol>
                            <MDBCol md="2">
                                {b.mostFreCondition}
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

export default UserReport;