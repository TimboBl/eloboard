import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	TablePagination,
	TableHead,
	TableFooter,
	Paper,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Snackbar
} from "@material-ui/core";
import _ from "lodash";
import { addPlayerToBoard, getBoardByName } from "../../network/singleplayer";
import { SNACKBAR_DURATION } from "../../config/config";

const logo = require("../../images/logo.jpg");

class SingleplayerView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			players: [],
			player_name: "",
			adding: false,
			error: false,
			conflict: false,
			rows: [],
		};
	}

	refresh() {
		getBoardByName(this.props.location.state.board_name).then(result => {
			this.setState({name: result.name, players: result.players}, () => {
				this.createRows();
			});
		}).catch(err => {

		});
	}

	componentDidMount() {
		this.refresh();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!_.isEqual(prevState.players, this.state.players)) {
			this.refresh();
		}
	}

	createRows() {
		const ret = [];
		for (let i = 0; i < this.state.players.length; ++i) {
			ret.push(
				<TableRow>
					<TableCell>{this.state.players[i].name}</TableCell>
					<TableCell>{this.state.players[i].score}</TableCell>
				</TableRow>
			);
		}
		this.setState({rows: ret});
	}

	onAddPlayerClicked() {
		this.setState({adding: true});
	}

	onDialogClose() {
		this.setState({adding: false, player_name: ""});
	}

	onSnackbarClose() {
		this.setState({error: false, conflict: false});
	}

	onPlayerNameChange(e) {
		this.setState({player_name: e.target.value});
	}

	onKeyPressed(e) {
		if (e.key === "Enter") {
			this.onConfirmClicked();
		}
	}

	onConfirmClicked() {
		addPlayerToBoard(this.state.name, this.state.player_name).then(() => {
			this.setState({adding: false, player_name: ""});
			this.refresh();
		}).catch(err => {
			if (err.response) {
				if (err.response.status === 500) {
					this.setState({error: true});
				} else if (err.response.status === 409) {
					this.setState({conflict: true});
				}
			}
		})
	}

	render() {
		return (
			<div className={"App"}>
				<Snackbar open={this.state.error} onClose={() => this.onSnackbarClose()}
						  autoHideDuration={SNACKBAR_DURATION}
						  message={"There was an Internal Server Error. Please try again later."}/>
				<Snackbar open={this.state.conflict} onClose={() => this.onSnackbarClose()}
						  autoHideDuration={SNACKBAR_DURATION}
						  message={"The name you entered already exists on this board. Please choose a different one."}/>
				<Dialog open={this.state.adding} onClose={() => this.onDialogClose()}>
					<DialogTitle>
						Add a new Player to {this.state.name}
					</DialogTitle>
					<DialogContent>
						<TextField value={this.state.player_name} onChange={(e) => this.onPlayerNameChange(e)}
								   label={"Name"} onKeyDown={(e) => this.onKeyPressed(e)}/>
					</DialogContent>
					<DialogActions style={{margin: "0 auto"}}>
						<Button onClick={() => this.onDialogClose()} variant={"contained"} color={"secondary"}
								style={{width: "100px"}}>Cancel</Button>
						<Button variant={"contained"} color={"primary"} style={{width: "100px"}}
								onClick={() => this.onConfirmClicked()}
								disabled={!this.state.player_name}>Confirm</Button>
					</DialogActions>
				</Dialog>
				<img src={logo} alt={"Logo"} width={"100px"}/><br/>
				Beerpong Leagues<br/><br/>
				{this.state.name}
				<Paper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Score</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.rows}
						</TableBody>
					</Table>
				</Paper>
				<Button variant={"contained"} color={"primary"} onClick={() => this.onAddPlayerClicked()}>Add
					Player</Button>
			</div>
		);
	}
}

export default SingleplayerView;

SingleplayerView.propTypes = {
	board_name: PropTypes.string.isRequired,
};
