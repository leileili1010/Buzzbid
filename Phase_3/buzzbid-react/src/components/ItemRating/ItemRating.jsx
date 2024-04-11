import {NavLink} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useParams} from "react-router-dom";
import {thunkGetRatings} from "../../redux/rating";
import {thunkGetItemWithAvgRating} from "../../redux/item";

const ItemRating = () => {
    const dispatch = useDispatch();
    const {itemId} = useParams();
    const item = useSelector(state => state.item[itemId])
    const ratingsObj = useSelector(state => state.rating)
    const ratings = Object.values(ratingsObj);

    let averageRating;
    if (parseInt(item?.avgRating) > 1) {
        averageRating = `${item?.avgRating} stars`;
    } else if (parseInt(item?.avgRating) <= 1) {
        averageRating = `${item?.avgRating} star`;
    } else {
        averageRating = item?.avgRating;
    }

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
                    <td>Item ID</td>
                    <td>{item?.itemId}</td>
                </tr>
                <tr>
                    <td>Item Name</td>
                    <td>{item?.itemName}</td>
                </tr>
                <tr>
                    <td>Average Rating</td>
                    <td>{averageRating}</td>
                </tr>
                </tbody>
            </table>
            <div className="comment-rating-container">
                    {ratings.map(rating =>
                        <div key={rating?.ratingId}>
                            <p>{rating?.username}</p>*
                            <p>{rating?.ratingTime}</p>
                            <p>{rating?.comment}</p>
                        </div>
                    )}
                    <button>Delete</button>
                </div>
        </div>
    )
}

export default ItemRating;