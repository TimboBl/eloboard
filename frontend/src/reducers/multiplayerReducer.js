import { FETCH_TEAMS } from "../config/action-types";

const initialState = {
	teams: [],
};

const MultiplayerReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TEAMS: {
			return {...state, teams: action.payload};
		}
		default: {
			return state;
		}
	}
};

export default MultiplayerReducer;
