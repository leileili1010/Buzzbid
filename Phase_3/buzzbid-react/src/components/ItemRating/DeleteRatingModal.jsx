import { useDispatch } from "react-redux";
import { useModal} from "../../context/Modal";
import {thunkDeleteRating} from "../../redux/rating";
import "./DeleteRatingModal.css"
import {thunkGetItemWithAvgRating} from "../../redux/item";

const DeleteRatingModal = ({ratingId, setDeleteRating, itemId}) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const handleDelete = async (e) => {
        e.preventDefault()
        dispatch(thunkDeleteRating(ratingId))
        dispatch(thunkGetItemWithAvgRating(itemId))
        setDeleteRating(prev => prev + 1)
        closeModal()
    }

    const handleCancel = (e) => {
        e.preventDefault()
        closeModal()
    }

    return (
        <div className='delete-rating-modal'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this rating?</p>
            <button className='delete-yes-btn' onClick={handleDelete}>Yes (Delete)</button>
            <button className='delete-no-btn' onClick={handleCancel}>No (Keep)</button>
        </div>
    )
}

export default DeleteRatingModal;
