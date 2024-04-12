import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";

function SearchResults() {
    const {state: {searchResults : searchResults, username: username, isAdmin: isAdmin, userRole : userRole}} = useLocation();
    const nav = useNavigate();

    const backToSearch = () => {
        nav('/searchItem', {state : {username: username, isAdmin : isAdmin, userRole: userRole}});
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{width: '1100px', height: 'auto'}}>
                <MDBContainer className="p-3">
                    <MDBRow>
                        <MDBCol md="1">
                            <strong>ID</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Item Name</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Current Bid</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>High Bidder</strong>
                        </MDBCol>
                        <MDBCol md="3">
                            <strong>Get It Now Price</strong>
                        </MDBCol>
                        <MDBCol md="2">
                            <strong>Auction Ends</strong>
                        </MDBCol>
                    </MDBRow>
                    {searchResults && searchResults.map(s => (
                        <MDBRow>
                            <MDBCol md="1">
                                {s.auctionId}
                            </MDBCol>
                            <MDBCol md="2">
                               <Link to="/viewItem" state={{auctionId: s.auctionId, username: username, isAdmin: isAdmin, userRole : userRole}}>
                                   {s.itemName}
                               </Link>
                            </MDBCol>
                            <MDBCol md="2">
                                {s.currentBid}
                            </MDBCol>
                            <MDBCol md="2">
                                {s.highBidder}
                            </MDBCol>
                            <MDBCol md="3">
                                {s.getItNowPrice}
                            </MDBCol>
                            <MDBCol md="2">
                                {s.auctionEndTime}
                            </MDBCol>
                        </MDBRow>
                        ))}
                    <br/>
                    <MDBRow>
                        <MDBCol md="4"></MDBCol>
                        <MDBCol md="4"></MDBCol>
                        <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary " style={{height: '50px', width: '100%'}}
                                    onClick={backToSearch}>Back to Search
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    );
}

export default SearchResults;