import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import buzzLogo from "../images/buzz.png";

function Dashboard() {
    const nav = useNavigate();
    const {state: {username: username, isAdmin: isAdmin, userRole : userRole}} = useLocation();
    const handleLogout = () => {
        nav('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
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
                                Welcome, {username}!<br/>
                                {userRole && <span>Administrative position: {userRole}</span>}
                            </p>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md={isAdmin ? "6" : "12"}>
                            <h3>Auction Options</h3>
                            <Link to="/search" state={{username: username, isAdmin: isAdmin, userRole: userRole}}>Search
                                for
                                Items</Link><br/>
                            <Link to="/listItem" state={{username: username, isAdmin: isAdmin, userRole: userRole}}>List
                                Item</Link><br/>
                            <Link to="/viewResults" state={{username: username, isAdmin: isAdmin, userRole: userRole}}>View
                                Auction Results</Link>
                        </MDBCol>
                        {isAdmin && <MDBCol md="6">
                            <h3>Reports</h3>
                            <a href="/categoryReport">Category Report</a><br/>
                            <a href="/userReport">User Report</a><br/>
                            <a href="/topRatedItemReport">Top Rated Items Report</a><br/>
                            <a href="/auctionStatistics">Auction Statistics</a><br/>
                            <a href="/cancelledAuctionDetails">Cancelled Auction Details</a>
                        </MDBCol>}
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="12">
                            <div className="text-center">
                                <button type="button" className="btn btn-primary mt-3" onClick={handleLogout}>Log Out
                                </button>
                            </div>
                        </MDBCol>
                    </MDBRow>

        </MDBContainer>
            </div>
</div>
)
    ;
}

export default Dashboard;