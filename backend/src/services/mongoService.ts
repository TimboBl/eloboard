import * as mongoose from "mongoose";
import { logger } from "../logging/logger";
import { Player } from "../types/Player";
import { PLAYER } from "../models/Player";
import { MONGO_CONNECTION_STRING } from "../config/config";
import { Types } from "mongoose";
import ObjectId = Types.ObjectId;
import { MATCH } from "../models/Match";
import { BOARD } from "../models/Board";
import { MULTIPLAYER_GAME } from "../config/constants";
import { TEAM } from "../models/Team";


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

	const updateTeam = (team: any, match: ObjectId, points: number) => {
		const update = {
			name: team.name,
			score: team.score,
			totalGames: team.totalGames,
			losses: team.losses,
			wins: team.wins,
		};

		return TEAM.updateOne({_id: team._id}, {"$set": update, "$addToSet": {matches: match}}).exec()
			.then(() => {
				const ret = [];
				for (let i = 0; i < team.members.length; ++i) {
					ret.push(PLAYER.findOne({_id: ObjectId(team.members[i].id)}).exec());
				}
				return Promise.all(ret);
			}).then((values) => {
				values.forEach((value: any) => {
					value.score += points;
					return PLAYER.updateOne({_id: ObjectId(value._id)}, {"$set": {score: value.score}}).exec();
				});
			});
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


	const saveNewPlayer = (name: string, board: string, type: string): Promise<Player> => {
		return PLAYER.updateOne({"name": name, board}, {
			"$set": {"name": name, "score": 1000, "totalGames": 0, "wins": 0, "losses": 0, "matches": [], board, type}
		}, {upsert: true}).exec();
	};

	const saveNewPlayerMultiplayer = (name: string, type: string): Promise<Player> => {
		return PLAYER.updateOne({"name": name}, {
			"$set": {"name": name, "score": 1000, "totalGames": 0, "wins": 0, "losses": 0, "matches": [], type}
		}, {upsert: true}).exec();
	};

	const createTeam = (name: string, board: string) => {
		return TEAM.updateOne({name}, {"$set": {name, board, score: 1000}}, {upsert: true}).exec();
	};

	const getAllTeams = (board: string) => {
		return TEAM.find({board}).exec();
	};

	const findTeamByName = (name: string) => {
		return TEAM.findOne({name}).exec();
	};

	const findTeamById = (id: string) => {
		const team = ObjectId(id);
		return TEAM.findOne({_id: team}).exec();
	};

	const addPlayerToTeam = (name: string, player: { name: string, id: ObjectId }) => {
		return TEAM.updateOne({name}, {"$addToSet": {members: player}}).exec();
	};

	const getAllMultiplayer = () => {
		return PLAYER.find({type: MULTIPLAYER_GAME}).exec();
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

	const findAllBoards = (type: string) => {
		return BOARD.find({type}).exec();
	};

	const addPlayerToBoard = (name: string, player: { name: string, id: ObjectId }) => {
		return BOARD.updateOne({name}, {"$addToSet": {"players": player}}).exec();
	};

	const deleteBoard = (name: string) => {
		return BOARD.deleteOne({name}).exec();
	};

	const mongoMethods = {
		updatePlayer,
		updateTeam,
		saveNewPlayer,
		saveNewPlayerMultiplayer,
		createTeam,
		getAllTeams,
		findTeamByName,
		findTeamById,
		addPlayerToTeam,
		getAllMultiplayer,
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
			mongoose.connect(MONGO_CONNECTION_STRING, {useNewUrlParser: true})
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
