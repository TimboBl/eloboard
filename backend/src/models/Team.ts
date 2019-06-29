import { model, Schema } from "mongoose";

const teamSchema = new Schema({
	name: {type: String},
	members: {type: Array},
	score: {type: Number},
	board: {type: String},
	matches: {type: Array},
	wins: {type: Number},
	losses: {type: Number},
	totalGames: {type: Number},
});

export const TEAM = model("Team", teamSchema);
