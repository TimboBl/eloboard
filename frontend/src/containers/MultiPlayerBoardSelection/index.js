import React, { Component } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle, Paper,
	Snackbar, Table, TableBody,
	TableCell, TableHead,
	TableRow,
	TextField
} from "@material-ui/core";
import { addMultiplayerBoard, getMultiplayerBoards } from "../../network/multiplayer";
import { SNACKBAR_DURATION } from "../../config/config";
import Footer from "../../components/Footer";
import { connect } from "react-redux";
import Logo from "../../components/Logo";

const mapStateToProps = state => {
	return {
		boards: state.multiplayer.boards,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		loadBoards: () => dispatch(getMultiplayerBoards()),
	};
};

class ConnectedMultiPlayerBoardSelection extends Component {
	constructor() {
		super();
		this.state = {
			adding: false,
			conflict: false,
			board_name: "",
			rows: [],
		};
	}

	componentDidMount() {
		this.props.loadBoards();
		this.createTableRows();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.boards !== this.props.boards) {
			this.createTableRows();
		}
	}

	createTableRows() {
		const ret = [];
		for (let i = 0; i < this.props.boards.length; ++i) {
			ret.push(
				<TableRow onClick={(e) => this.onTableRowClicked(e)} key={i}>
					<TableCell id={i}>{this.props.boards[i].name}</TableCell>
					<TableCell id={i}>{this.props.boards[i].players.length}</TableCell>
				</TableRow>
			);
		}
		this.setState({rows: ret});
	}

	onButtonClick() {
		this.setState({adding: true});
	}

	onDialogClose() {
		this.setState({adding: false, board_name: ""});
	}

	onSnackbarClose() {
		this.setState({conflict: false});
	}

	onBoardNameChange(e) {
		this.setState({board_name: e.target.value});
	}

	onConfirmClicked() {
		if (this.state.board_name) {
			addMultiplayerBoard(this.state.board_name).then(() => {
				this.setState({adding: false});
				this.props.loadBoards();
			}).catch(err => {
				if (err.response) {
					if (err.response.status === 409) {
						this.setState({conflict: true});
					}
				}
			});
		}
	}

	onKeyPressed(e) {
		if (e.key === "Enter") {
			this.onConfirmClicked();
		}
	}

	onTableRowClicked(e) {
		this.props.history.push({pathname: "/multiplayer", state: {board_name: this.state.rows[e.target.id].props.children[0].props.children}})
	}

	render() {
		return (
			<div className={"App"}>
				<Snackbar open={this.state.conflict}
						  message={"This name has already been chosen. Please choose another one"}
						  autoHideDuration={SNACKBAR_DURATION}
						  onClose={() => this.onSnackbarClose()} anchorOrigin={{horizontal: "center", vertical: "top"}}/>
				<Dialog open={this.state.adding} onClose={() => this.onDialogClose()}>
					<DialogTitle>Add a new Board</DialogTitle>
					<DialogContent>
						<TextField label={"Board Name"} onChange={(e) => this.onBoardNameChange(e)}
								   value={this.state.board_name} onKeyDown={(e) => this.onKeyPressed(e)}/>
					</DialogContent>
					<DialogActions style={{margin: "0 auto"}}>
						<Button onClick={() => this.onDialogClose()} variant={"contained"} color={"secondary"}
								style={{width: "100px"}}>Cancel</Button>
						<Button variant={"contained"} color={"primary"} style={{width: "100px"}}
								onClick={() => this.onConfirmClicked()} disabled={!this.state.board_name}>Confirm</Button>
					</DialogActions>
				</Dialog>
				<Logo/>
				<Paper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Players</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.rows}
						</TableBody>
					</Table>
				</Paper>
				<Button variant={"contained"} color={"primary"} onClick={() => this.onButtonClick()} style={{margin: "10px 0 0 0"}}>Add new
					Board</Button>
			</div>
		);
	}
}

const MultiPlayerBoardSelection = connect(mapStateToProps, mapDispatchToProps)(ConnectedMultiPlayerBoardSelection);

export default MultiPlayerBoardSelection;

