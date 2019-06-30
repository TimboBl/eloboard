import { Types } from "mongoose";

interface Player {
	_id: Types.ObjectId;
	name: string;
	score: number;
	wins: number;
	losses: number;
	totalGames: number;
	board: string;
	type: string,
	matches: [
		{
			winner: string,
			looser: string,
			result: string,
		}
		];
}
