import {NavLink} from "react-router-dom";


const ItemRating = () => {
    return (
        <div className="item-rating-container">
            <h2>Item Rating</h2>
            <table className="item-rating-item">
                <tbody>
                <tr>
                    <td>Item ID</td>
                    <td>1001</td>
                </tr>
                <tr>
                    <td>Item Name</td>
                    <td>Gamin GPS 255W</td>
                </tr>
                <tr>
                    <td>Average Rating</td>
                    <td>3.5 stars</td>
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