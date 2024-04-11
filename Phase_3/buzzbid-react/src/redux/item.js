const GET_ITEM = "item/GET_ITEM";

// action
const getItem= (item) => ({
    type: GET_ITEM,
    item,
})

//thunk -get item
export const thunkGetItem = (itemId) => async (dispatch)=> {
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