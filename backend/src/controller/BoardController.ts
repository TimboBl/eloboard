import { Request, Response } from "express";
import { logger } from "../logging/logger";
import * as bluebird from "bluebird"
import { MongoServiceT } from "../types/services/mongoService";

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
		mongoService.findAllBoards().then(boards => {
			res.status(200).send({message: "Success", data: boards});
		}).catch((err: Error) => {
			logger.error("There was an error when getting all the boards!", err);
			res.status(500).send({message: "Internal Server Error"});
		});
	};

	const addPlayerToBoard = (req: Request, res: Response) => {
		if (!req.body.name || !req.body.board) {
			logger.warn("There was a request to add a player to a board without a name");
			res.status(400).send({message: "Malformed Request"});
			return;
		}

		mongoService.saveNewPlayer(req.body.name).then((player) => {
			console.log("PLAYER", player);
			return mongoService.addPlayerToBoard(req.body.board, {name: player.name, id: player._id})
		}).then(() => {
			res.status(200).send({message: "Success"});
		}).catch((err: Error) => {
			logger.error("There was an error when adding a player to a board!", err);
			res.status(500).send({message: "Internal Server Error"});
		});

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
		addPlayerToBoard,
		deleteBoard,
	};
};
