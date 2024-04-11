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
                    <td>{item?.avgRating}</td>
                </tr>
                </tbody>
            </table>
            <div className="comment-rating-container">
                <div>
                    <p>thinkmcfly </p>
                    <p>2/2/2024 12:22PM</p>
                    <p>This product is great for getting aroundtwon but the battery life is extremely limited. It's out of juice when I really need it the most.</p>
                    <button>Delete</button>
                </div>

            </div>
        </div>
    )
}

export default ItemRating;