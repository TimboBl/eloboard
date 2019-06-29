import {Schema, model} from "mongoose";
import { Types } from "mongoose";
import ObjectId = Types.ObjectId;

const matchSchema = new Schema({
	winner: {type: String},
	looser: {type: String},
	result: {type: String},
	date: {type: String},
	board: {type: String},
});

export const MATCH = model("Match", matchSchema);
