const GET_AUCTION_RESULTS = "auction/GET_AUCTION_RESULTS";

// action creator
const getAuctionResults = (auctionResults) => ({
    type: GET_AUCTION_RESULTS,
    auctionResults
})

// thunk
export const thunkGetAuctionResults = () => async (dispatch)=> {
    const res = await fetch ("http://localhost:8081/auction/auction-results");
    if (res.ok) {
        const auctionResults = await res.json();
        dispatch(getAuctionResults(auctionResults));
    } else {
        const errs = await res.json();
        return errs;
    }
}

// reducer
const initialState = {auctionResults: {}};

function auctionReducer(state = initialState, action) {
    switch (action.type) {
        case GET_AUCTION_RESULTS: {
            const newState = { ...state };
            if (action.auctionResults) {
                action.auctionResults.forEach((auctionResult) => {
                    newState.auctionResults[auctionResult.itemId] = auctionResult;
                });
            }
            return newState;
        }
        default:
            return state;
    }
}

export default auctionReducer;