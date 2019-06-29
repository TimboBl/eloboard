import * as express from "express";
import * as PlayerController from "../controller/playerController";

export const getRouter = (mongoDB: any) => {
    const router = express.Router();
    const playerController = PlayerController.playerController(mongoDB);

    router.get("/scores", playerController.getScores);
    router.put("/scores", playerController.updateScore);
    router.post("/team", playerController.createTeam);
    router.get("/team", playerController.getTeams);

    return router;
};
