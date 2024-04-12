const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

// action creator
export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

export const removeUser = () => ({
    type: REMOVE_USER,
});


// thunk
export const thunkAuthenticate = () => async (dispatch) => {
    const response = await fetch("http://localhost:8081/auth/current-user");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }
        dispatch(setUser(data));
    }
};

// reducer
const initialState = { user: null };

function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;
    }
}
export default sessionReducer;