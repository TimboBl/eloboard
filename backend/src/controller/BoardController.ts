import { Request, Response } from "express";
import { logger } from "../logging/logger";

export const MatchController = (mongoService) => {
	const createMatch = (req: Request, res: Response) => {
		if (!req.body.name) {
			logger.warn("There was a request to create a match without a name!");
			res.status(400).send({message: "Malformed Request"});
			return;
		}


	};

	return {
		createMatch,
	};
};
