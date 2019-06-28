import { FETCH_PLAYERS, FETCH_SINGLEPLAYER_BOARDS } from "../config/action-types";

const initialState = {
	players: [],
	boards: [],
};

const SinglePlayerReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_PLAYERS: {
			return {...state, players: action.payload}
		}
		case FETCH_SINGLEPLAYER_BOARDS: {
			return {...state, boards: action.payload}
		}
		default: {
			return state;
		}
	}
};

export default SinglePlayerReducer;
