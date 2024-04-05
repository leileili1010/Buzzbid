import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {MDBCol, MDBContainer} from "mdb-react-ui-kit";

function Dashboard() {
    const nav = useNavigate();
    const {state: {username: username, isAdmin: isAdmin, userRole : userRole}} = useLocation();
    const handleLogout = () => {
        nav('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <MDBContainer className="border rounded-lg p-4">
                <h2 className="mb-4 text-center">Buzzbid</h2>
                <p className="mb-4 text-center">
                    Welcome, {username}!<br/>
                    {userRole && <span>Administrative position: {userRole}</span>}
                </p>
                <div className="d-flex bg-body-tertiary mb-3 text-center" style={{height: "300px"}}>
                    <MDBCol>
                        <h3>Auction Options</h3>
                        <a href="/search">Search for Items</a><br/>
                        <a href="/listItem">List Item</a><br/>
                        <a href="/viewResults">View Auction Results</a>
                    </MDBCol>
                    {isAdmin && <MDBCol>
                        <h3>Reports</h3>
                        <a href="/categoryReport">Category Report</a><br/>
                        <a href="/userReport">User Report</a><br/>
                        <a href="/topRatedItemReport">Top Rated Items Report</a><br/>
                        <a href="/auctionStatistics">Auction Statistics</a><br/>
                        <a href="/cancelledAuctionDetails">Cancelled Auction Details</a>
                    </MDBCol>}
                </div>
                <div className="text-center">
                    <button type="button" className="btn btn-primary mt-3" onClick={handleLogout}>Log Out</button>
                </div>
            </MDBContainer>
        </div>
    );
}

export default Dashboard;