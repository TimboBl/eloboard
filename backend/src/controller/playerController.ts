import { Request, Response } from "express";
import { logger } from "../logging/logger";
import { Player } from "../types/Player";
import { MongoServiceT } from "../types/services/mongoService";
import { MULTIPLAYER_GAME } from "../config/constants";

export const playerController = (mongoDB: MongoServiceT) => {
	const K = 32;

	const updateScore = (req: Request, res: Response) => {
		let oldPlayer: Player;
		let opponentPlayer: Player;
		let newPlayers: { player: Player, opponent: Player, scoreChangePlayer: number, scoreChangeOpponent: number };

		const match = req.body.match;
		match.time = new Date();

		if (req.body.type === MULTIPLAYER_GAME) {
			mongoDB.findTeamById(req.body.name).then((team) => {
				oldPlayer = team;
				match.board = team.board;
				return mongoDB.findTeamById(req.body.opponent);
			}).then((opponent: Player) => {
				opponentPlayer = opponent;
				newPlayers = updatePlayerScore(oldPlayer, opponent, req.body.result);
				console.log(newPlayers);
				return mongoDB.updateTeam(newPlayers.player, match, newPlayers.scoreChangePlayer);
			}).then(() => {
				return mongoDB.updateTeam(newPlayers.opponent, match, newPlayers.scoreChangeOpponent);
			}).then(() => {
				return mongoDB.saveMatch(match);
			}).then(() => {
				logger.debug("Player score was successfully updated", req.body.name);
				return res.status(200).send({message: "Success"});
			}).catch((err: Error) => {
				logger.error("Saving the players score failed!", err);
				res.status(500).send({message: "There was an internal server error"});
			});
		} else {
			mongoDB.findPlayer(req.body.name).then((player: Player) => {
				oldPlayer = player;
				match.board = player.board;
				return mongoDB.findPlayer(req.body.opponent);
			}).then((opponent: Player) => {
				opponentPlayer = opponent;
				newPlayers = updatePlayerScore(oldPlayer, opponent, req.body.result);
				return mongoDB.updatePlayer(newPlayers.player, match);
			}).then(() => {
				return mongoDB.updatePlayer(newPlayers.opponent, match);
			}).then(() => {
				return mongoDB.saveMatch(match);
			}).then(() => {
				logger.debug("Player score was successfully updated", req.body.name);
				return res.status(200).send({message: "Success"});
			}).catch((err: Error) => {
				logger.error("Saving the players score failed!", err);
				res.status(500).send({message: "There was an internal server error"});
			});
		}
	};

	const getScores = (req: Request, res: Response) => {
		logger.debug("Getting scores");
		const cursor: any = mongoDB.getScores();
		const player: Player[] = [];
		cursor.on("data", (doc: Player) => {
			player.push(doc);
		});
		cursor.on("error", (err: Error) => {
			logger.error("Cursor for getting Scores ran into an error", {error: err});
			res.status(500).send({message: "There was an internal server error"});
			return;
		});
		cursor.on("end", () => {
			logger.debug("Getting the scores was successful");
			res.status(200).send({message: "Success", data: player});
		});
	};

	const createTeam = (req: Request, res: Response) => {
		if (!(req.body.name && req.body.board)) {
			logger.warn("There was a request to create a Team without a name!");
			res.status(400).send({message: "Malformed Request"});
			return;
		}

		mongoDB.createTeam(req.body.name, req.body.board).then(() => {
			return mongoDB.findTeamByName(req.body.name);
		}).then((team) => {
			return mongoDB.addPlayerToBoard(req.body.board, {name: team.name, id: team._id});
		}).then(() => {
			res.status(200).send({message: "Success"});
		}).catch((err: Error) => {
			logger.error("There was an error when creating a team!", err);
			res.status(500).send({message: "Internal Server Error"});
		});
	};

	const getTeams = (req: Request, res: Response) => {
		if (!req.query.board) {
			logger.warn("There was a request for teams without the name of a board");
			res.status(400).send({message: "Malformed Request"});
			return;
		}

		mongoDB.getAllTeams(req.query.board).then(teams => {
			res.status(200).send({message: "Success", data: teams});
		}).catch((err: Error) => {
			logger.error("There was an error when getting all the teams", err)
		})
	};

	const getPlayers = (req: Request, res: Response) => {
		mongoDB.getAllMultiplayer().then(players => {
			res.status(200).send({message: "Success", data: players});
		}).catch((err: Error) => {
			logger.error("There was an error when getting all multiplayers!", err);
			res.status(500).send({message: "Internal Server Error"});
		});
	};

	const updatePlayerScore = (pl: Player, opp: Player, result: number):
		{ player: Player, opponent: Player, scoreChangePlayer: number, scoreChangeOpponent: number } => {
		const returnValue = {
			player: pl,
			opponent: opp,
			scoreChangePlayer: 0,
			scoreChangeOpponent: 0,
		};

		const playerScore = pl.score;
		const opponentScore = opp.score;

		const r1 = Math.pow(10, (pl.score / 400));
		const r2 = Math.pow(10, (opp.score / 400));
		const e1 = r1 / (r1 + r2);
		const e2 = r2 / (r1 + r2);
		const s1 = result === 0 ? 0 : 1;
		const s2 = result === 1 ? 1 : 0;
		pl.score = Math.round(pl.score + K * (s1 - e1));
		opp.score = Math.round(opp.score + K * (s2 - e2));

		if (result === 0/*The player has lost to its opponent*/) {
			pl.losses += 1;
			opp.wins += 1;
		} else {
			pl.wins += 1;
			opp.losses += 1;
		}
		pl.totalGames += 1;
		opp.totalGames += 1;

		returnValue.scoreChangePlayer = Math.abs(playerScore - returnValue.player.score);
		returnValue.scoreChangeOpponent = Math.abs(opponentScore - returnValue.opponent.score) * -1;

		return returnValue;
	};

	return {
		updateScore,
		getScores,
		createTeam,
		getTeams,
		getPlayers,
	};
};
