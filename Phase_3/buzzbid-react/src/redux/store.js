import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk';
import { createLogger } from 'redux-logger';
import ratingReducer from "./rating";
import itemReducer from "./item";

const rootReducer = combineReducers({
    rating: ratingReducer,
    item: itemReducer,
});

const initialState = {};
const middleware = [thunk];

// Conditionally add redux-logger in development environment only
if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({
        collapsed: true,
    });
    middleware.push(logger);
}

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middleware),
);

const store = createStore(rootReducer, initialState, enhancer);

export default store;
