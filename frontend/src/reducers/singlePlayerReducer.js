import { FETCH_PLAYERS } from "../config/action-types";

const initialState = {
	players: [],
};

const SinglePlayerReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_PLAYERS: {
			return {...state, players: action.payload}
		}
		default: {
			return state;
		}
	}
};

export default SinglePlayerReducer;
