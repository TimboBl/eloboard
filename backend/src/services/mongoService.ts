import * as mongoose from "mongoose";
import {logger} from "../logging/logger";
import {Player} from "Player";
import {PLAYER} from "../models/Player";
import {QueryCursor} from "mongoose";

export const mongoService = (() => {

    const updatePlayer = (player: Player, result: string): Promise<Player> => {
                const update = result === "win" ?
                    {"name": player.name, "score": player.score, "totalGames": player.totalGames, "wins": player.wins + 1} :
                    {"name": player.name, "score": player.score, "totalGames": player.totalGames, "losses": player.losses + 1};
                return PLAYER.update({"name": name}, {
                    "$set": update
                }, {upsert: true}).exec();
        };

    const findPlayer = (playerName: string) => {
        return PLAYER.find({name: playerName}).exec().then((result) => {
            if (result[0]) {
                return result[0];
            } else {
                return undefined;
            }
        });
    };

    const saveNewPlayer = (name: string):Promise<Player> => {
        return PLAYER.update({"name": name}, {
            "$set": {"name": name, "score": 1000, "totalGames": 0, "wins": 0, "losses": 0}
        }).exec();
    };

    const getScores = () => {
        return PLAYER.find({}, {name: 1, score: 1, _id: 0}).sort({score: -1}).cursor();
    };

    const mongoMethods = {
        updatePlayer,
        saveNewPlayer,
        findPlayer,
        getScores
    };
    const init = () => {
        return new Promise((resolve: Function, reject: Function) => {
            mongoose.connect(process.env.MONGO || "mongodb://localhost:27017/uptain-board")
                .then(() => {
                    resolve(mongoMethods);
                }).catch((err: Error) => {
                logger.error("Could not establish a connection to MongoDB", err);
                reject();
            });
        });
    };

    return {init};
})();