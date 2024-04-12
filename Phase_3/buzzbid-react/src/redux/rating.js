const RETURN_INITIAL_RATING = "rating/RETURN_INITIAL_RATING";
const GET_RATINGS = "rating/GET_RATINGS";
const DELETE_RATING = "rating/DELETE_RATING";

// action creator
export const returnInitialRating = () => {
    return {
        type: RETURN_INITIAL_RATING,
    };
};
const getRatings = (ratings) => ({
    type: GET_RATINGS,
    ratings
})

const deleteRating = (ratingId) => ({
    type: DELETE_RATING,
    ratingId
})

// thunk - get ratings for an item
export const thunkGetRatings = (itemId) => async (dispatch)=> {
    const res = await fetch (`http://localhost:8081/rating/item/${itemId}`);
    if (res.ok) {
        const ratings = await res.json();
        console.log(ratings)
        dispatch(getRatings(ratings));
    } else {
        const errs = await res.json();
        return errs;
    }
}

export const thunkDeleteRating = (ratingId) => async (dispatch) => {
    const tokenJsonString = localStorage.getItem('token');
    const token = JSON.parse(tokenJsonString);
    const res = await fetch(`http://localhost:8081/rating/delete/${ratingId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if (res.ok) {
        dispatch(deleteRating(ratingId));
        return ratingId;
    } else {
        const errs = await res.json();
        return errs;
    }
}


// reducer
const initialState = {};

function ratingReducer(state = initialState, action) {
    switch (action.type) {
        case GET_RATINGS: {
            const newState = { ...state };
            if (action.ratings) {
                action.ratings.forEach((rating) => {
                    newState[rating.ratingId] = rating;
                });
            }
            return newState;
        }
        case DELETE_RATING: {
            const newState = { ...state };
            delete newState[action.ratingId];
            return newState;
        }
        case RETURN_INITIAL_RATING: {
            return initialState;
        }
        default:
            return state;
    }
}

export default ratingReducer;