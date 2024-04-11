import {get} from "axios";

const RETURN_INITIAL_ITEM = "item/RETURN_INITIAL_ITEM"
const GET_ITEM = "item/GET_ITEM";
const GET_ITEM_WITH_AVG_RATING = 'item/GET_ITEM_WITH_AVG_RATING';

// action
export const returnInitialItem = () => {
    return {
        type: RETURN_INITIAL_ITEM,
    };
};
const getItem= (item) => ({
    type: GET_ITEM,
    item,
})
const getItemWithAvgRating = (itemWithAvgRating) => ({
    type: GET_ITEM_WITH_AVG_RATING,
    itemWithAvgRating,
});

//thunk -get item
export const thunkGetItem = (itemId) => async (dispatch)=> {
    const res = await fetch (`http://localhost:8081/item/${itemId}`);
    console.log("inside thunk get item")
    if (res.ok) {
        const item = await res.json();
        dispatch(getItem(item));
    } else {
        const errs = await res.json();
        return errs;
    }
}

export const thunkGetItemWithAvgRating = (itemId) => async (dispatch) => {
    try {
        const itemRes = await fetch(`http://localhost:8081/item/${itemId}`);
        if (!itemRes.ok) {
            throw new Error("Failed to fetch item details");
        }
        const item = await itemRes.json();

        const ratingRes = await fetch(`http://localhost:8081/rating/avg/${itemId}`);
        if (!ratingRes.ok) {
            throw new Error("Failed to fetch item average rating");
        }
        const {avgRating} = await ratingRes.json();

        const itemWithAvgRating = {
            ...item,
            avgRating: avgRating
        };

        dispatch(getItemWithAvgRating(itemWithAvgRating));
    } catch (error) {
        console.error("Error fetching item with average rating:", error);
    }
};


// reducer
const initialState = {};

function itemReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ITEM: {
            const newState = { ...state };
            if (action.item) {
                    newState[action.item.itemId] = action.item;
                }
            return newState;
        }
        case GET_ITEM_WITH_AVG_RATING: {
            const newState = { ...state };
            if (action.itemWithAvgRating) {
                newState[action.itemWithAvgRating.itemId] = action.itemWithAvgRating;
            }
            return newState;
        }
        case RETURN_INITIAL_ITEM: {
            return initialState;
        }
        default:
            return state;
    }
}

export default itemReducer;