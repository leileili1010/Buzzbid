import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useParams, useNavigate} from "react-router-dom";
import {thunkGetRatings} from "../../redux/rating";
import {thunkGetItemWithAvgRating} from "../../redux/item";
import "./ItemRating.css";
import {generateStars, formatDate} from "../helperFunctions/helperFunctions";
import OpenModalButton from "../OpenModalButton";
import DeleteRatingModal from "./DeleteRatingModal";
import {thunkGetAuctionResults} from "../../redux/auction";
import {returnInitialRating} from "../../redux/rating";
import RateItem from "./RateItem";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import NavigationBar from "../NavigationBar/NavigationBar";
import '../../css/style.css';

const ItemRating = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {itemId} = useParams();
    const item = useSelector(state => state.item[itemId])
    const ratingsObj = useSelector(state => state.rating)
    const ratings = Object.values(ratingsObj);
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);
    const auctionResult = useSelector(state => state.auction.auctionResults[itemId]);
    const [addRating, setAddRating] = useState(0);
    const [deleteRating, setDeleteRating] = useState(0)
    const isWinner = auctionResult?.winner === currentUser.username;
    let ifRated = false;
    const nav = useNavigate();

    for (let rating of ratings) {
        if (rating?.username === currentUser.username) {
            ifRated = true;
            break;
        }
    }

    let averageRating;
    if (parseInt(item?.avgRating) > 1) {
        averageRating = `${item?.avgRating} stars`;
    } else if (parseInt(item?.avgRating) <= 1) {
        averageRating = `${item?.avgRating} star`;
    } else {
        averageRating = item?.avgRating;
    }

    useEffect(() => {
        if (!userJsonString) navigate("/login");
    }, [userJsonString, navigate]);

    useEffect(() => {
        dispatch(thunkGetRatings(itemId));
        return () => {
            dispatch(returnInitialRating())
        }
    }, [dispatch, itemId, addRating, deleteRating]);

    useEffect(() => {
        dispatch(thunkGetItemWithAvgRating(itemId));
    }, [dispatch, itemId, addRating, deleteRating]);

    useEffect(() => {
        dispatch(thunkGetAuctionResults());
    }, [dispatch, itemId]);

    const close = () => {
        nav(-1)
    };

    return (
        <>
            <NavigationBar/>
        <div className="d-flex justify-content-center align-items-center vh-100 bg">
            <div className="border rounded-lg p-4 item-rating-container" style={{width: '900px', height: 'auto'}}>
                <h2>Item Rating</h2>
                <MDBContainer className="p-3">
                    <MDBRow>
                        <MDBCol md="12">
                            <table className="item-rating-item">
                                <tbody>
                                <tr>
                                    <td className="table-title">Item ID</td>
                                    <td>{item?.itemId}</td>
                                </tr>
                                <tr>
                                    <td className="table-title">Item Name</td>
                                    <td>{item?.itemName}</td>
                                </tr>
                                <tr>
                                    <td className="table-title">Average Rating</td>
                                    <td>{averageRating}</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="comment-rating-container">
                                {ratings.map((rating, index) =>
                                    <div key={index} className="ratings">
                                        <div className="user-star">
                                            <div className="user-details">
                                                <div><i className="fa-solid fa-user" id="user-icon"></i></div>
                                                <p>{rating?.username}</p>
                                            </div>
                                            <div className="stars">
                                                {generateStars(rating)}
                                            </div>
                                        </div>
                                        <p className="rating-time">{formatDate(rating?.ratingTime)}</p>
                                        <p className="rating-comment">{rating?.comment}</p>
                                        {(rating?.username == currentUser.username || currentUser.isAdmin) &&
                                            < OpenModalButton
                                                buttonText="Delete"
                                                modalComponent={<DeleteRatingModal
                                                    ratingId={rating?.ratingId}
                                                    setDeleteRating={setDeleteRating}
                                                    itemId={itemId}
                                                />}
                                            />
                                        }
                                    </div>
                                )}
                            </div>
                            {(isWinner && !ifRated) && < OpenModalButton
                                buttonText="Rate This Item"
                                modalComponent={<RateItem username={currentUser.username} itemId={itemId}
                                                          setAddRating={setAddRating}/>}
                            />}
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4"></MDBCol>
                        <MDBCol md="4"></MDBCol>
                        <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary"
                                    style={{height: '50px', width: '100%'}}
                                    onClick={e => close(e)}>Close
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
        </>
    )
}

export default ItemRating;