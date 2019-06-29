import { FETCH_MULTIPLAYER_BOARDS, FETCH_TEAMS } from "../config/action-types";

export const fetchTeams = teams =>  ({type: FETCH_TEAMS, payload: teams});

export const fetchMultiplayerBoards = boards => ({type: FETCH_MULTIPLAYER_BOARDS, payload: boards});
