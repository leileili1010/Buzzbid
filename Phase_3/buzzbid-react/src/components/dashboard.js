import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import buzzLogo from "../images/buzz.png";
import '../css/style.css';
import NavigationBar from "./NavigationBar/NavigationBar";

function Dashboard() {
    const nav = useNavigate();
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);

    const handleLogout = () => {
        localStorage.clear();
        nav('/');
    };

    useEffect(() => {
        if (!userJsonString) {
            nav("/login");
        }
    }, [userJsonString, nav]);

    return (
        <>
            <NavigationBar/>
            <div className="d-flex justify-content-center align-items-center vh-100 bg">
                <div className="d-flex bg-body-tertiary mb-3 text-center" style={{width: 'auto', height: "auto"}}>
                    <MDBContainer className="border rounded-lg p-4">
                        <MDBRow>
                            <MDBCol md="6">
                                <img width={250} height={250} src={buzzLogo} alt="buzz"/>
                            </MDBCol>
                            <MDBCol md="6">
                                <h1 className="mb-4 text-center">Buzzbid</h1>
                                <h3 className="mb-4 text-center">It's not junk if someone will pay for it.</h3>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md="12">
                                <p className="mb-4 text-center">
                                    Welcome, {currentUser.username}!<br/>
                                    {currentUser.userRole && <span>Administrative position: {currentUser.userRole}</span>}
                                </p>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md={currentUser.isAdmin ? "6" : "12"}>
                                <h3>Auction Options</h3>
                                <Link to="/searchItem">Search for Items</Link><br/>
                                <Link to="/listItem" >List Item</Link><br/>
                                <Link to="/auctionresults">View Auction Results</Link>
                            </MDBCol>
                            {currentUser.isAdmin && <MDBCol md="6">
                                <h3>Reports</h3>
                                <Link to="/categoryreport">Category Report</Link><br/>
                                <Link to="/userReport">User Report</Link><br/>
                                <Link to="/topratedreport">Top Rated Items Report</Link><br/>
                                <Link to="/auctionstaticsreport">Auction Statistics</Link><br/>
                                <Link to="/cancelledreport">Cancelled Auction Details</Link><br/>
                            </MDBCol>}
                        </MDBRow>
                        <br/>
                        <MDBRow>
                            <MDBCol md="3"></MDBCol>
                            <MDBCol md="6">
                                <div className="text-center">
                                    <MDBBtn type="button" className="mb-4 d-block btn-primary"
                                            style={{height: '50px', width: '100%'}} onClick={handleLogout}>Log Out</MDBBtn>
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </div>
            </div>

        </>

    );
}

export default Dashboard;