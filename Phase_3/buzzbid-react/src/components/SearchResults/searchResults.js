import React, {useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import '../../css/style.css';
import NavigationBar from "../NavigationBar/NavigationBar";
import "./SearchResults.css"

function SearchResults() {
    const {state: {searchResults : searchResults}} = useLocation();
    const nav = useNavigate();
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);

    useEffect(() => {
        if (!userJsonString) {
            nav("/login");
        }
    }, [userJsonString, nav]);

    const backToSearch = () => {
        nav('/searchItem');
    };

    return (
        <div className="search-results-page">
            <NavigationBar/>
        <div className="d-flex justify-content-center align-items-center search-results">
            <div className="bg border rounded-lg p-4" style={{width: '1150px'}}>
                <h2>Search Results</h2>
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
                                {s.itemId}
                            </MDBCol>
                            <MDBCol md="2">
                               <Link to="/viewItem" state={{auctionId: s.auctionId}}>
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
        </div>
    );
}

export default SearchResults;