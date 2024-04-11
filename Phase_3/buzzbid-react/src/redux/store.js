import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk'; // Corrected import
import { createLogger } from 'redux-logger';
import ratingReducer from "./rating";

const rootReducer = combineReducers({
    rating: ratingReducer,
});

const initialState = {};
const middleware = [thunk];

// Conditionally add redux-logger in development environment only
if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({
        collapsed: true, // Collapses the log entries for easier reading
        // You can add more options here
    });
    middleware.push(logger);
}

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middleware),
    // other store enhancers if any
);

const store = createStore(rootReducer, initialState, enhancer);

export default store;
