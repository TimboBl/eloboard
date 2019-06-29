import { Player } from "../Player";
import { Types} from "mongoose";
import ObjectId = Types.ObjectId;

export interface MongoServiceT {
	updatePlayer(player: Player, match: ObjectId): Promise<Player>;

	updateTeam(team: any, match: ObjectId, points: number): Promise<any>;

	findPlayer(playerId: string): Promise<any>;

	saveMatch(match: any): Promise<any>;

	saveNewPlayer(name: string, board: string, type: string): Promise<Player>;

	createTeam(name: string, board: string): Promise<any>;

	getAllTeams(board: string): Promise<any>;

	findTeamByName(name: string): Promise<any>;

	findTeamById(id: string): Promise<any>;

	addPlayerToTeam(name: string, player: {name: string, id: ObjectId}): Promise<any>;

	getAllMultiplayer(): Promise<any>;

	getScores(): Promise<any>;

	createBoard(name: string, type: string): Promise<any>;

	findBoardByName(name: string): Promise<any>;

	findAllBoards(type: string): Promise<any>;

	addPlayerToBoard(name: string, player: {name: string, id: ObjectId}): Promise<any>;

	deleteBoard(name: string): Promise<any>;
}
