import { FETCH_MULTIPLAYER_BOARDS, FETCH_TEAMS } from "../config/action-types";

const initialState = {
	teams: [],
	boards: [],
};

const MultiplayerReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TEAMS: {
			return {...state, teams: action.payload};
		}
		case FETCH_MULTIPLAYER_BOARDS: {
			return {...state, boards: action.payload};
		}
		default: {
			return state;
		}
	}
};

export default MultiplayerReducer;
