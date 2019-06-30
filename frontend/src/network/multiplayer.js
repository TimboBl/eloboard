import axios from "axios";
import { ADD_PLAYER, BASE_URL, BOARD_SELECT, BOARDS, MULTIPLAYER_GAME, PLAYER, SCORES, TEAM } from "../config/config";
import { fetchMultiplayerBoards } from "../actions/multiplayerActions";

export const getMultiplayerBoards = () => {
	return (dispatch) => {
		return axios.get(BASE_URL + BOARDS, {params: {type: MULTIPLAYER_GAME}}).then(result => {
			dispatch(fetchMultiplayerBoards(result.data.data));
		}).catch(err => {
			console.log(err);
			throw err;
		});
	}
};
export const addMultiplayerBoard = (name) => {
	return axios.post(BASE_URL + BOARDS, {
		name,
		type: MULTIPLAYER_GAME,
	}).then(result => {

	}).catch(err => {
		console.log(err);
		throw err;
	});
};

export const addPlayerToBoard = (name, teamName, exists) => {
	return axios.post(BASE_URL + ADD_PLAYER, {
		name,
		team: teamName,
		type: MULTIPLAYER_GAME,
		exists,
	}).then(result => {
		return result.data.data;
	}).catch(err => {
		console.log(err);
		throw err;
	});
};

export const createTeam = (name, board) => {
	return axios.post(BASE_URL + TEAM, {name, board}).then().catch(err => {
		console.log(err);
		throw err;
	});
};

export const getTeams = (board) => {
	return axios.get(BASE_URL + TEAM, {params: {
		board
		}}).then(result => {
		return result.data.data;
	}).catch(err => {
		console.log(err);
		throw err;
	})
};

export const recordMatch = (player, opponent, result, match/*{winner: string, looser: string, result: "1:2"}*/, type) => {
	return axios.put(BASE_URL + SCORES, {
		name: player,
		opponent,
		result,
		match,
		type,
	}).then().catch((err => {
		console.log(err);
		throw err;
	}));
};

export const getAllPlayers = () => {
	return axios.get(BASE_URL + PLAYER).then(result => {
		return result.data.data;
	}).catch(err => {
		console.log(err);
		throw err;
	});
};

