import { FETCH_PLAYERS } from "../config/action-types";

export const fetchPlayers = players => ({type: FETCH_PLAYERS, payload: players});
