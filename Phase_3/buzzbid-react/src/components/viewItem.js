import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    MDBBtn,
    MDBCol,
    MDBContainer,
    MDBInput,
    MDBRow,
    MDBModal,
    MDBModalDialog,
    MDBModalContent, MDBModalHeader, MDBModalTitle, MDBTextArea, MDBModalFooter
} from "mdb-react-ui-kit";
import axios from "axios";
import '../css/style.css';

function ViewItem() {
    const {state: {auctionId: auctionId}} = useLocation();
    const [auctionData, setAuctionData] = useState({});
    const nav = useNavigate();
    const [errors, setErrors] = useState({});
    const [bidAmount, setBidAmount] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [editedDesc, setEditedDesc] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);

    useEffect(() => {
        if (!userJsonString) {
            nav("/login");
        }
    }, [userJsonString, nav]);

    useEffect(() => {
        function getAuctionData() {
            axios.get(`http://localhost:8081/auction/${auctionId}`)
                .then((response) => {
                    const data = response.data;
                    setAuctionData(data);
                }).catch(function (error) {

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
            username: currentUser.username, bidAmount: bidAmount
        }).then((response) => {
            window.location.reload();
        }).catch(function (error) {

        });
    };

    const close = () => {
        nav(-1)
    };

    const getItNow = () => {
        let bid = auctionData.getItNowPrice.substring(1);
        setBidAmount(bid);

        axios.post(`http://localhost:8081/auction/${auctionId}/getItNow`, {
            username: currentUser.username, bidAmount: bid
        }).then((response) => {
            window.location.reload();
        }).catch(function (error) {

        });
    };

    const editDescription = () => {
        if (editedDesc === '') {
            return;
        }

        axios.post(`http://localhost:8081/auction/${auctionId}/edit`, {
            description: editedDesc
        }).then((response) => {
            toggleEditModal();
            setTimeout(function () {
                window.location.reload();
            }, 1500);
        }).catch(function (error) {

        });
    };

    const cancelAuction = () => {
        axios.post(`http://localhost:8081/auction/${auctionId}/cancel`, {
            username: currentUser.username, cancelReason: cancelReason
        }).then((response) => {
            toggleCancelModal();
            setTimeout(function () {
                window.location.reload();
            }, 1500);
        }).catch(function (error) {

        });
    };

    const viewRating = () => {
        nav(`/itemRating/${auctionData.itemId}`);
    };

    const toggleEditModal = () => setEditModal(!editModal);
    const toggleCancelModal = () => setCancelModal(!cancelModal);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="bg border rounded-lg p-4" style={{width: '700px', height: 'auto'}}>
                <h2>{auctionData.auctionEnded ? 'Item Results' : 'Item For Sale'}</h2>
                <MDBContainer className="p-3">
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Item ID</label>
                        </MDBCol>
                        <MDBCol md="4">
                            <strong>{auctionData.itemId}</strong>
                        </MDBCol>
                        <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn btn-primary mt-3" style={{width: '100%'}}
                                    onClick={viewRating}>
                                View Rating
                            </MDBBtn>
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
                        {currentUser.username === auctionData.username && !auctionData.auctionEnded && <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn btn-primary mt-3" style={{width: '100%'}}
                                    onClick={toggleEditModal}>
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
                        {currentUser.username !== auctionData.username && auctionData.getItNowPrice && !auctionData.auctionEnded &&
                            <MDBCol md="4">
                                <MDBBtn type="button" className="mb-4 d-block btn btn-primary mt-3"
                                        style={{width: '100%'}}
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
                            <strong>{auctionData.cancelledTime ? auctionData.cancelledTime : auctionData.auctionEndTime}</strong>
                        </MDBCol>
                    </MDBRow>
                    <br/>
                    <MDBRow>
                        <MDBCol md="12">
                            <fieldset>
                                <MDBRow>
                                    <MDBCol md="4">
                                        <h3>{auctionData.auctionEnded ? 'Bid History' : 'Latest Bids'}</h3>
                                    </MDBCol>
                                </MDBRow>
                                <hr/>
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
                                {auctionData.bids && auctionData.bids.map((b, i) => {
                                    if (i == 0 && auctionData.auctionEnded) {
                                        if (auctionData.cancelledTime) {
                                            return <MDBRow style={{background: 'red'}}>
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
                                        } else if (auctionData.minSalePriceMet) {
                                            return <MDBRow style={{background: 'green'}}>
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
                                        } else if (!auctionData.minSalePriceMet) {
                                            return <MDBRow style={{background: 'yellow'}}>
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
                                        } else {
                                            return <MDBRow>
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
                                        }
                                    } else {
                                        return <MDBRow>
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
                                    }
                                })}
                            </fieldset>
                        </MDBCol>
                    </MDBRow>
                    <hr/>
                    {currentUser.username !== auctionData.username && !auctionData.auctionEnded && <MDBRow>
                        <MDBCol md="4">
                            <strong>Your Bid</strong>
                        </MDBCol>
                        <MDBCol md="4">
                            <MDBInput wrapperClass='mb-4' placeholder='$0.00' id="bid-amount" name="bidAmount"
                                      type='text'
                                      style={{border: errors.bidAmount ? "2px solid red" : null}}
                                      onChange={(e) => setBidAmount(e.target.value)}/>
                            <label>(Minimum bid {auctionData.startingBid})</label>
                            {errors.bidAmount ? <p className="error">{errors.bidAmount}</p> : null}
                        </MDBCol>
                    </MDBRow>}
                    <br/>
                    <MDBRow className="item-btns">
                        <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary"
                                    style={{height: '50px', width: '100%'}}
                                    onClick={e => close(e)}>Close
                            </MDBBtn>
                        </MDBCol>
                        {currentUser.isAdmin && !auctionData.auctionEnded && <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary"
                                    style={{height: '50px', width: '100%'}}
                                    onClick={toggleCancelModal}>Cancel This Auction
                            </MDBBtn>
                        </MDBCol>}
                        {currentUser.username !== auctionData.username && !auctionData.auctionEnded && <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary"
                                    style={{height: '50px', width: '100%'}}
                                    onClick={bid}>Bid On This Item
                            </MDBBtn>
                        </MDBCol>}
                    </MDBRow>
                    <MDBModal open={editModal} setOpen={setEditModal} tabIndex="-1">
                        <MDBModalDialog>
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Edit Item Description</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleEditModal}></MDBBtn>
                                </MDBModalHeader>
                                <MDBModalContent>
                                    <MDBContainer className="p-3">
                                        <MDBRow>
                                            <MDBCol md="12">
                                                <MDBTextArea wrapperClass='mb-4' placeholder='Item Description'
                                                             id='edit-description' name="edit_description"
                                                             type='text'
                                                             onChange={(e) => setEditedDesc(e.target.value)}/>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBContainer>
                                </MDBModalContent>
                                <MDBModalFooter>
                                    <MDBBtn color="secondary" onClick={toggleEditModal}>Close</MDBBtn>
                                    <MDBBtn onClick={editDescription}>Update Description</MDBBtn>
                                </MDBModalFooter>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                    <MDBModal open={cancelModal} setOpen={setCancelModal} tabIndex="-1">
                        <MDBModalDialog>
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle>Cancel Auction</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleCancelModal}></MDBBtn>
                                </MDBModalHeader>
                                <MDBModalContent>
                                    <MDBContainer className="p-3">
                                        <MDBRow>
                                            <MDBCol md="12">
                                                <MDBInput wrapperClass='mb-4' placeholder='Cancel reason'
                                                          id='cancel-reason' name="cancelReason" type='text'
                                                          onChange={(e) => setCancelReason(e.target.value)}/>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBContainer>
                                </MDBModalContent>
                                <MDBModalFooter>
                                    <MDBBtn color="secondary" onClick={toggleCancelModal}>Close</MDBBtn>
                                    <MDBBtn onClick={cancelAuction}>Cancel Auction</MDBBtn>
                                </MDBModalFooter>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                </MDBContainer>
            </div>
        </div>
    );
}

export default ViewItem;