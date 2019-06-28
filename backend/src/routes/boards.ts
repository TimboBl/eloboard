import { Router } from "express";

export const BoardRouter = (() => {
	const getRouter = (boardController: any) => {
		const router = Router();

		router.post("/board", boardController.createBoard);
		router.get("/board", boardController.getAllBoards);
		router.post("/board/player", boardController.addPlayerToBoard);
		router.delete("/board", boardController.deleteBoard);

		return router;
	};

	return {
		getRouter,
	}
})();
