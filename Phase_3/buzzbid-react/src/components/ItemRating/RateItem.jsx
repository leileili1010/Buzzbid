import { useState } from 'react';
import { useModal } from '../../context/Modal';
import StarRatingInput from "./StarRatingInput";
import "./RateItem.css";
import axios from "axios";

const RateItem = ({username,itemId, setAddRating}) => {
    const { closeModal } = useModal();
    const [comment, setComment] = useState('');
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});
// console.log("=======================comment and stars", comment, stars)

    const onChange = (num) => {
        setStars(parseInt(num));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const validationErrors = {};

        if (stars === 0 && !comment) validationErrors.stars = "Please leave a comment for 0 star rating";

        if (Object.values(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        const newRating = {
            itemId,
            username,
            numberOfStars: stars,
            comment
        }

        axios.post('http://localhost:8081/rating/create', newRating)
            .then((response) => {
                setAddRating(prev => prev+1);
                closeModal();
            }).catch(function(error) {

        });

    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='rating-form'>
                <h2>How do you like the item?</h2>
                {"stars" in errors && <p className="rating-error">{errors.stars}</p>}
                <textarea
                    placeholder="Leave your comment here (optional)..."
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <div className='stars-rating-container'>
                    <StarRatingInput stars={stars} onChange={onChange}/>
                    <span>Stars</span>
                </div>
                <button type='submit'>Submit Your Rating</button>
            </form>
        </div>
    )
}

export default RateItem;