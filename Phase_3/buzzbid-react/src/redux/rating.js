const GET_RATINGS = "rating/GET_RATINGS";

// action creator
const getRatings = (ratings) => ({
    type: GET_RATINGS,
    ratings
})

// thunk - get ratings for an item
export const thunkGetRatings = (itemId) => async (dispatch)=> {
    const res = await fetch (`http://localhost:8081/rating/item/${itemId}`);
    console.log("inside thunk get ratings")
    if (res.ok) {
        const ratings = await res.json();
        console.log(ratings)
        dispatch(getRatings(ratings));
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
        default:
            return state;
    }
}

export default ratingReducer;