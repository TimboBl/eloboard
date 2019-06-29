import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { logger } from "./logging/logger";
import * as scoreKeeping from "./routes/scoreKeeping";
import * as access from "./routes/access";
import { BoardRouter } from "./routes/boards";
import { BoardController } from "./controller/BoardController";
import { MongoServiceT } from "./types/services/mongoService";

export const startApp = (mongoDB: MongoServiceT) => {
	return new Promise((resolve: Function) => {
		logger.debug("Starting app");
		const app = express();
		const boardController = BoardController(mongoDB);

		app.use((req, res, next) => {
			logger.info("New Request", {url: req.url});
			next();
		});

		logger.debug("Instantiating middlewares");
		app.use(bodyParser.json());
		app.use(cors());

		logger.debug("Registering routes");

		app.use(access.getRouter());
		app.use(scoreKeeping.getRouter(mongoDB));
		app.use(BoardRouter.getRouter(boardController));

		app.listen(process.env.PORT || 3001);
		resolve();
	});
};
