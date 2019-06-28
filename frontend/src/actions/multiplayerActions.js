import { FETCH_TEAMS } from "../config/action-types";

export const fetchTeams = teams =>  ({type: FETCH_TEAMS, payload: teams});
