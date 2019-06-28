import { FETCH_PLAYERS, FETCH_SINGLEPLAYER_BOARDS } from "../config/action-types";

export const fetchPlayers = players => ({type: FETCH_PLAYERS, payload: players});

export const fetchSingleplayerBoards = boards => ({type: FETCH_SINGLEPLAYER_BOARDS, payload: boards});
