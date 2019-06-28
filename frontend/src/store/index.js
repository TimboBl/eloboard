import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import SinglePlayerReducer from "../reducers/singlePlayerReducer";
import MultiplayerReducer from "../reducers/multiplayerReducer";

const reducers = combineReducers({
	singlePlayer: SinglePlayerReducer,
	multiplayer: MultiplayerReducer,
});

const store = process.env.NODE_ENV === "development" ? createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))
	: createStore(reducers, applyMiddleware(thunk));

export default store;
