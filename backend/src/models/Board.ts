import { model, Schema } from "mongoose";

const boardSchema = new Schema({
	name: {type: String, unique: true},
	players: {type: Array},
	type: {type: String},
});

boardSchema.index({name: 1});

export const BOARD = model("Board", boardSchema);
