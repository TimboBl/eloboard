import {Schema, model} from "mongoose";
import { Types } from "mongoose";
import ObjectId = Types.ObjectId;

const matchSchema = new Schema({
	winner: {type: ObjectId},
	looser: {type: ObjectId},
	result: {type: String},
	date: {type: String},
	board: {type: String},
});

export const MATCH = model("Match", matchSchema);
