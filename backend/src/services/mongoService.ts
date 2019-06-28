import * as mongoose from "mongoose";
import { logger } from "../logging/logger";
import { Player } from "../types/Player";
import { PLAYER } from "../models/Player";
import { MONGO_CONNECTION_STRING } from "../config/config";
import { Types} from "mongoose";
import ObjectId = Types.ObjectId;
import { MATCH } from "../models/Match";
import { BOARD } from "../models/Board";


export const mongoService = (() => {

	const updatePlayer = (player: Player, match: ObjectId): Promise<Player> => {

		const update = {
			"name": player.name,
			"score": player.score,
			"totalGames": player.totalGames,
			"losses": player.losses,
			"wins": player.wins
		};
		return PLAYER.update({"_id": player._id}, {
			"$set": update,
			"$addToSet": {"matches": match}
		}, {upsert: true}).exec();
	};

	const findPlayer = (playerId: string) => {
		const id = ObjectId(playerId);
		return PLAYER.findOne({_id: id}).exec().then((result) => {
			return result;
		});
	};

	const saveMatch = (match: any) => {
			return MATCH.update({}, {$set: match}, {upsert: true});
		};


	const saveNewPlayer = (name: string, board: string): Promise<Player> => {
		return PLAYER.updateOne({"name": name, board}, {
			"$set": {"name": name, "score": 1000, "totalGames": 0, "wins": 0, "losses": 0, "matches": [], board}
		}, {upsert: true}).exec();
	};

	const getScores = () => {
		return PLAYER.find({}, {name: 1, score: 1, _id: 1, matches: 1}).sort({score: -1}).cursor();
	};

	const createBoard = (name: string, type: string) => {
		return BOARD.updateOne({name}, {"$set": {name, type}}, {upsert: true}).exec();
	};

	const findBoardByName = (name: string) => {
		return BOARD.findOne({name}).exec();
	};

	const findAllBoards = () => {
		return BOARD.find({}).exec();
	};

	const addPlayerToBoard = (name: string, player: {name: string, id: ObjectId}) => {
		return BOARD.updateOne({name}, {"$addToSet": {"players": player}}).exec();
	};

	const deleteBoard = (name: string) => {
		return BOARD.deleteOne({name}).exec();
	};

	const mongoMethods = {
		updatePlayer,
		saveNewPlayer,
		findPlayer,
		getScores,
		saveMatch,
		createBoard,
		findBoardByName,
		findAllBoards,
		addPlayerToBoard,
		deleteBoard,
	};
	const init = () => {
		return new Promise((resolve: Function, reject: Function) => {
			mongoose.connect(MONGO_CONNECTION_STRING)
				.then(() => {
					logger.info("Connected to mongoDB");
					resolve(mongoMethods);
				}).catch((err: Error) => {
				logger.error("Could not establish a connection to MongoDB", err);
				reject();
			});
		});
	};

	return {init};
})();
