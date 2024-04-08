import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {MDBCol, MDBContainer, MDBInput, MDBRow} from "mdb-react-ui-kit";
import axios from "axios";

function ViewItem() {
    const {state: {auctionId: auctionId, username: username, isAdmin: isAdmin, userRole : userRole}} = useLocation();
    const [auctionData, setAuctionData] = useState({});
    const nav = useNavigate();

    useEffect(() => {
        function getAuctionData() {
            axios.get(`http://localhost:8081/auction/${auctionId}`)
                .then((response) => {
                   const data = response.data;
                   setAuctionData(data);
                }).catch(function(error) {

            });
       }

       getAuctionData();
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{width: '700px', height: 'auto'}}>
                <MDBContainer className="p-3">
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Item ID</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <strong>{auctionData.itemId}</strong>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Item Name</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <strong>{auctionData.itemName}</strong>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Description</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <strong>{auctionData.description}</strong>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Category</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <strong>{auctionData.category}</strong>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Condition</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <strong>{auctionData.conditionLabel}</strong>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Returns Accepted?</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <strong>{auctionData.isReturnable === 'true' ? 'Yes' : 'No'}</strong>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Get It Now Price</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <strong>{auctionData.getItNowPrice}</strong>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Auction Ends</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <strong>{auctionData.auctionEndTime}</strong>
                        </MDBCol>
                    </MDBRow>
                    <br/>
                    <MDBRow>
                        <MDBCol md="6">
                            <button className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}>
                               Close
                            </button>
                        </MDBCol>
                        {isAdmin && <MDBCol md="6">
                            <button className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}>
                                Cancel this item
                            </button>
                        </MDBCol>}
                        <MDBCol md="6">
                            <button className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}>
                                Bid on this item
                            </button>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    );
}

export default ViewItem;