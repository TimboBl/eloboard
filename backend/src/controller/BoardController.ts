import { Request, Response } from "express";
import { logger } from "../logging/logger";
import * as bluebird from "bluebird"
import { MongoServiceT } from "../types/services/mongoService";
import { MULTIPLAYER_GAME, SINGLE_PLAYER } from "../config/constants";

export const BoardController = (mongoService: MongoServiceT) => {
	const createBoard = (req: Request, res: Response) => {
		if (!req.body.name || !req.body.type) {
			logger.warn("There was a request to create a match without a name!");
			res.status(400).send({message: "Malformed Request"});
			return;
		}

		mongoService.findBoardByName(req.body.name).then(board => {
			if (board) {
				return bluebird.resolve("");
			} else {
				return mongoService.createBoard(req.body.name, req.body.type);
			}
		}).then(result => {
			if (typeof result === "string") {
				res.status(409).send({message: "Conflict"});
			} else {
				res.status(200).send({message: "Success"});
			}
		}).catch((err: Error) => {
			logger.error("There was an error when creating a board!", err);
			res.status(500).send({message: "Internal Server Error"});
		});
	};

	const getAllBoards = (req: Request, res: Response) => {
		mongoService.findAllBoards(req.query.type).then(boards => {
			res.status(200).send({message: "Success", data: boards});
		}).catch((err: Error) => {
			logger.error("There was an error when getting all the boards!", err);
			res.status(500).send({message: "Internal Server Error"});
		});
	};

	const getBoardByName = (req: Request, res: Response) => {
		if (!req.query.name) {
			logger.warn("There was a request for a board without the name parameter");
			res.status(400).send({message: "Malformed Request"});
			return;
		}
		let brd: any;
		mongoService.findBoardByName(req.query.name).then(board => {
			brd = board;
			const promises = [];
			if (board.type === MULTIPLAYER_GAME) {
				for (let i = 0; i < board.players.length; ++i) {
					promises.push(mongoService.findTeamByName(board.players[i].name));
				}
			} else {
				for (let i = 0; i < board.players.length; ++i) {
					promises.push(mongoService.findPlayer(board.players[i].id));
				}
			}
			return Promise.all(promises);
		}).then((values) => {
			brd.players = values;
			res.status(200).send({message: "Success", data: brd});
		}).catch((err: Error) => {
			logger.error("There was an error getting a board by name!", err);
			res.status(500).send({message: "Internal Server Error"});
		});
	};

	const addPlayerToBoard = (req: Request, res: Response) => {
		if (!req.body.name || !req.body.board) {
			logger.warn("There was a request to add a player to a board without a name");
			res.status(400).send({message: "Malformed Request"});
			return;
		}

		if (req.body.type === MULTIPLAYER_GAME) {
			let id: any;
			let ret: string;
			mongoService.saveNewPlayer(req.body.name, req.body.board, MULTIPLAYER_GAME).then((player: any) => {
				if (!player.upserted) {
					ret = "";
					return Promise.resolve("");
				} else {
					id = player.upserted[0]._id;
					return mongoService.findTeamByName(req.body.team);
				}
			}).then((team) => {
				return mongoService.addPlayerToBoard(req.body.board, {
					name: team.name,
					id: team._id,
				});
			}).then(() => {
				if (typeof ret === "string" && ret === "") {
					res.status(409).send({message: "Conflict"});
				} else {
					return mongoService.addPlayerToTeam(req.body.team, {name: req.body.name, id});
				}
			}).then(() => {
				res.status(200).send({message: "Success"});
			}).catch((err: Error) => {
				logger.error("There was an error when adding a player to a multiplayer board!", err);
				res.status(500).send({message: "Internal Server Error"});
			});
		} else {
			mongoService.saveNewPlayer(req.body.name, req.body.board, SINGLE_PLAYER).then((player: any) => {
				if (!player.upserted) {
					return Promise.resolve("");
				} else {
					return mongoService.addPlayerToBoard(req.body.board, {
						name: req.body.name,
						id: player.upserted[0]._id
					});
				}
			}).then((ret) => {
				if (typeof ret === "string") {
					res.status(409).send({message: "Conflict"});
				} else {
					res.status(200).send({message: "Success"});
				}
			}).catch((err: Error) => {
				logger.error("There was an error when adding a player to a board!", err);
				res.status(500).send({message: "Internal Server Error"});
			});
		}
	};

	const deleteBoard = (req: Request, res: Response) => {
		if (!req.body.name) {
			logger.warn("There was a request to delete a board without a name!");
			res.status(400).send({message: "Malformed Request"});
			return;
		}

		mongoService.deleteBoard(req.body.name).then(() => {
			res.status(200).send({message: "Success"});
		}).catch((err: Error) => {
			logger.error("There was an error when deleting a Board!", err);
			res.status(500).send({message: "Internal Server Error"});
		});
	};

	return {
		createBoard,
		getAllBoards,
		getBoardByName,
		addPlayerToBoard,
		deleteBoard,
	};
};
