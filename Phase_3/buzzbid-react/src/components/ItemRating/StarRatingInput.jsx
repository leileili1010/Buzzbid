import { useState } from 'react';
import "./RateItem.css";

const StarRatingInput = ({stars, onChange}) => {
    const [activeRating, setActiveRating] = useState(stars);

    function starsRating(num) {
        return (
            <div className={`star ${activeRating >= num ? "filled" : "empty"}`}>
                <i id="star" className="fa-solid fa-star"
                   onMouseEnter={() => setActiveRating(num)}
                   onMouseLeave={() => setActiveRating(stars) }
                   onClick={() => onChange(num)} ></i>
            </div>
        )
    }

    return (
        <>
            {starsRating(1)}
            {starsRating(2)}
            {starsRating(3)}
            {starsRating(4)}
            {starsRating(5)}
        </>
    )
}
export default StarRatingInput;