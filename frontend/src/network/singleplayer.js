import axios from "axios";
import { ADD_PLAYER, BASE_URL, BOARD_SELECT, BOARDS, SINGLE_PLAYER, SCORES } from "../config/config";
import { fetchSingleplayerBoards } from "../actions/singlePlayerActions";

export const getSinglePlayerBoards = () => {
	return (dispatch) => {
		return axios.get(BASE_URL + BOARDS, {params: {type: SINGLE_PLAYER}}).then(result => {
			dispatch(fetchSingleplayerBoards(result.data.data));
		}).catch(err => {
			console.log(err);
			throw err;
		});
	}
};

export const addBoard = (name) => {
	return axios.post(BASE_URL + BOARDS, {
		name,
		type: SINGLE_PLAYER,
	}).then(result => {

	}).catch(err => {
		console.log(err);
		throw err;
	});
};

export const getBoardByName = (name) => {
	return axios.get(BASE_URL + BOARD_SELECT, {params: {
		name,
		}}).then(result => {
			return result.data.data;
	}).catch(err => {
		console.log(err);
		throw err;
	});
};

export const addPlayerToBoard = (board, name) => {
	return axios.post(BASE_URL + ADD_PLAYER, {
		board,
		name
	}).then(result => {
		return result.data.data;
	}).catch(err => {
		console.log(err);
		throw err;
	});
};

export const recordMatch = (player, opponent, result, match/*{winner: string, looser: string, result: "1:2"}*/) => {
	return axios.put(BASE_URL + SCORES, {
		name: player,
		opponent,
		result,
		match,
	}).then().catch((err => {
		console.log(err);
		throw err;
	}));
};
