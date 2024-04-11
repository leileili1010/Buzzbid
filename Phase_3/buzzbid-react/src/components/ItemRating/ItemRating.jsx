import {NavLink} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useParams, useNavigate} from "react-router-dom";
import {thunkGetRatings} from "../../redux/rating";
import {thunkGetItemWithAvgRating} from "../../redux/item";
import "./ItemRating.css";
import {generateStars, formatDate} from "../helperFunctions/helperFunctions";
import OpenModalButton from "../OpenModalButton";
import DeleteRatingModal from "./DeleteRatingModal";

const ItemRating = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {itemId} = useParams();
    const item = useSelector(state => state.item[itemId])
    const ratingsObj = useSelector(state => state.rating)
    const ratings = Object.values(ratingsObj);
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);

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
    }, [dispatch, itemId]);

    useEffect(() => {
        dispatch(thunkGetItemWithAvgRating(itemId));
    }, [dispatch, itemId]);


    return (
        <div className="item-rating-container">
            <h2>Item Rating</h2>
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
                        {rating?.username == currentUser.username &&
                            < OpenModalButton
                                buttonText="Delete"
                                modalComponent={<DeleteRatingModal ratingId={rating?.ratingId} />}
                            />
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default ItemRating;