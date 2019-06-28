import { Player } from "../Player";
import { Types} from "mongoose";
import ObjectId = Types.ObjectId;

export interface MongoServiceT {
	updatePlayer(player: Player, match: ObjectId): Promise<Player>;

	findPlayer(playerId: string): Promise<any>;

	saveMatch(match: any): Promise<any>;

	saveNewPlayer(name: string, board: string): Promise<Player>;

	getScores(): Promise<any>;

	createBoard(name: string, type: string): Promise<any>;

	findBoardByName(name: string): Promise<any>;

	findAllBoards(): Promise<any>;

	addPlayerToBoard(name: string, player: {name: string, id: ObjectId}): Promise<any>;

	deleteBoard(name: string): Promise<any>;
}
