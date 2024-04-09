import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdb-react-ui-kit";
import axios from "axios";

function ViewItem() {
    const {state: {auctionId: auctionId, username: username, isAdmin: isAdmin, userRole : userRole}} = useLocation();
    const [auctionData, setAuctionData] = useState({});
    const nav = useNavigate();
    const[errors, setErrors] = useState({});
    const[bidAmount, setBidAmount] = useState('');

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

    const validator = (bidAmount) => {
        let errors = {};

        if (bidAmount === '' || isNaN(bidAmount)) {
            errors.bidAmount = 'Bid must be an amount';
        } else if (auctionData.getItNowPrice !== null && parseFloat(bidAmount) >= parseFloat(auctionData.getItNowPrice.substring(1))) {
            errors.bidAmount = 'Bid must be less than Get It Now price. Please use Get It Now instead.'
        } else if (auctionData.bids.length && parseFloat(bidAmount) <= parseFloat(auctionData.bids[0].bidAmount.substring(1))) {
            errors.bidAmount = 'Bid amount must be greater than the current high bid';
        } else if (parseFloat(bidAmount) < parseFloat(auctionData.startingBid.substring(1))) {
            errors.bidAmount = 'Bid must be greater than the minimum bid';
        }

        return errors;
    };

    const bid = () => {
        // validate bid amount
        let errors = validator(bidAmount);
        setErrors(errors);

        if (Object.keys(errors).length !== 0) {
            return;
        }

        axios.post(`http://localhost:8081/auction/${auctionId}/bid`, {
            username, bidAmount
        }).then((response) => {
            window.location.reload();
        }).catch(function(error) {

        });
    };

    const cancelItem = () => {
        axios.post(`http://localhost:8081/auction/${auctionId}/cancel`, {

        })
    };

    const close = () => {
        nav('/dashboard', {state : {username: username, isAdmin : isAdmin, userRole: userRole}});
    };

    const getItNow = () => {
        let bid = auctionData.getItNowPrice.substring(1);
        setBidAmount(bid);

        axios.post(`http://localhost:8081/auction/${auctionId}/getItNow`, {
            username: username, bidAmount: bid
        }).then((response) => {
            window.location.reload();
        }).catch(function(error) {

        });
    };

    const editDescription = () => {

    };

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
                        <MDBCol md="4">
                            <strong>{auctionData.description}</strong>
                        </MDBCol>
                        {username === auctionData.username && !auctionData.auctionEnded && <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn btn-primary mt-3" style={{width: '100%'}}
                                    onClick={editDescription}>
                                Edit Description
                            </MDBBtn>
                        </MDBCol>}
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
                        <MDBCol md="4">
                            <strong>{auctionData.getItNowPrice}</strong>
                        </MDBCol>
                        {auctionData.getItNowPrice && !auctionData.auctionEnded && <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn btn-primary mt-3" style={{width: '100%'}}
                                    onClick={getItNow}>
                                Get It Now!
                            </MDBBtn>
                        </MDBCol>}
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Auction Ends</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <strong>{auctionData.auctionEndTime}</strong>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="12">
                            <fieldset>
                                <MDBRow>
                                    <MDBCol md="8"></MDBCol>
                                    <MDBCol md="4">
                                        <strong>Latest Bids</strong>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol md="4">
                                        <strong>Bid Amount</strong>
                                    </MDBCol>
                                    <MDBCol md="4">
                                        <strong>Time of Bid</strong>
                                    </MDBCol>
                                    <MDBCol md="4">
                                        <strong>Username</strong>
                                    </MDBCol>
                                </MDBRow>
                                {auctionData.bids && auctionData.bids.map(b => (
                                    <MDBRow>
                                        <MDBCol md="4">
                                            {b.bidAmount}
                                        </MDBCol>
                                        <MDBCol md="4">
                                            {b.bidTime}
                                        </MDBCol>
                                        <MDBCol md="4">
                                            {b.username}
                                        </MDBCol>
                                    </MDBRow>
                                ))}
                            </fieldset>
                        </MDBCol>
                    </MDBRow>
                    <br/>
                    {!auctionData.auctionEnded && <MDBRow>
                        <MDBCol md="4">
                            <strong>Your Bid</strong>
                        </MDBCol>
                        <MDBCol md="4">
                            <MDBInput wrapperClass='mb-4' placeholder='$0.00' id="bid-amount" name="bidAmount"
                                      type='text'
                                      style={{ border: errors.bidAmount ? "2px solid red" : null }}
                                      onChange={(e) => setBidAmount(e.target.value)} />
                            <label>(Minimum bid {auctionData.startingBid})</label>
                            {errors.bidAmount ? <p className="error">{errors.bidAmount}</p> : null}
                        </MDBCol>
                    </MDBRow>}
                    <br/>
                    <MDBRow>
                        <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}
                                    onClick={e => close(e)}>
                                Close
                            </MDBBtn>
                        </MDBCol>
                        {isAdmin && !auctionData.auctionEnded && <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}>
                                Cancel This Auction
                            </MDBBtn>
                        </MDBCol>}
                        {!auctionData.auctionEnded && <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}} onClick={bid}>
                                Bid On This Item
                            </MDBBtn>
                        </MDBCol>}
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    );
}

export default ViewItem;