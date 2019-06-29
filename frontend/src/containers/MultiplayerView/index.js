import React, { Component } from "react";
import { getBoardByName } from "../../network/singleplayer";
import { addPlayerToBoard, createTeam, getTeams, recordMatch } from "../../network/multiplayer";
import _ from "lodash";
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
import { MULTIPLAYER_GAME, SNACKBAR_DURATION } from "../../config/config";
import Select from "react-select";
import Logo from "../../components/Logo";

const logo = require("../../images/logo.png");

class MultiplayerView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			players: [],
			player_name: "",
			adding: false,
			error: false,
			conflict: false,
			recording: false,
			creating_team: false,
			rows: [],
			selectedOpponent: "",
			options: [],
			winner: "",
			result: "",
			team_name: "",
			team_options: [],
			teams: [],
			selectedTeam: "",
		};
	}

	refresh() {
		getBoardByName(this.props.location.state.board_name).then(result => {
			this.setState({name: result.name, players: result.players}, () => {
				this.createRows();
				const ret = [];
				for (let i = 0; i < result.players.length; ++i) {
					ret.push({value: result.players[i]._id, label: result.players[i].name});
				}
				this.setState({selectedOpponent: result.players[0] ? result.players[0].name : "", options: ret});
			});
			getTeams(this.state.name).then(teams => {
				const ret = [];
				for (let i = 0; i < teams.length; ++i) {
					ret.push({value: i, label: teams[i].name});
				}
				this.setState({team_options: ret, teams});
			})
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
				<TableRow onClick={(e) => this.onTableRowClick(e)} key={i}>
					<TableCell id={i}>{this.state.players[i].name}</TableCell>
					<TableCell id={i}>{this.state.players[i].score}</TableCell>
				</TableRow>
			);
		}
		this.setState({rows: ret});
	}

	onAddPlayerClicked() {
		this.setState({adding: true});
	}

	onCreateTeamClicked() {
		this.setState({creating_team: true});
	}

	onCreateTeamClose() {
		this.setState({creating_team: false});
	}

	onDialogClose() {
		this.setState({adding: false, player_name: "", recording: false});
	}

	onSnackbarClose() {
		this.setState({error: false, conflict: false});
	}

	onPlayerNameChange(e) {
		this.setState({player_name: e.target.value});
	}

	onTeamNameChange(e) {
		this.setState({team_name: e.target.value});
	}

	onKeyPressed(e) {
		if (e.key === "Enter" && (this.state.player_name && this.state.team_name)) {
			this.onConfirmClicked();
		}
	}

	onConfirmClicked() {
		addPlayerToBoard(this.state.name, this.state.player_name, this.state.selectedTeam.label).then(() => {
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

	onTableRowClick(e) {
		console.log(e.target.id);
		this.setState({winner: this.state.players[e.target.id].name, recording: true});
	}

	onSelectChange(option) {
		this.setState({selectedOpponent: option});
	}

	onTeamChange(option) {
		this.setState({selectedTeam: option});

	}

	onWinnerChange(option) {
		this.setState({winner: option});
	}

	onResultChange(e) {
		this.setState({result: e.target.value});
	}

	recordMatch() {
		recordMatch(this.state.winner.value, this.state.selectedOpponent.value, "win", {
			winner: this.state.winner.label,
			looser: this.state.selectedOpponent.label,
			result: this.state.result
		}, MULTIPLAYER_GAME).then(() => {
			this.setState({recording: false, result: ""});
			this.refresh();
		}).catch(err => {

		})
	}

	createTeam() {
		if (this.state.team_name) {
			createTeam(this.state.team_name, this.state.name).then(() => {
				this.setState({creating_team: false, team_name: ""});
				this.refresh();
			});
		}
	}

	createMemberTable() {
		const ret = [];
		if (this.state.teams[this.state.selectedTeam.value]) {
			for (let i = 0; i < this.state.teams[this.state.selectedTeam.value].members.length; ++i) {
				ret.push(
					<TableRow key={i}>
						<TableCell>{this.state.teams[this.state.selectedTeam.value].members[i].name}</TableCell>
					</TableRow>
				);
			}
		}
		return ret;
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
						Add a new Player to a Team
					</DialogTitle>
					<DialogContent>
						<Select value={this.state.selectedTeam} onChange={(option) => this.onTeamChange(option)}
								options={this.state.team_options}/>
						<TextField value={this.state.player_name} onChange={(e) => this.onPlayerNameChange(e)}
								   label={"New Teammate"} onKeyDown={(e) => this.onKeyPressed(e)}/>
						<Paper>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
									</TableRow>
								</TableHead>
								{this.createMemberTable()}
							</Table>
						</Paper>
					</DialogContent>
					<DialogActions style={{margin: "0 auto"}}>
						<Button onClick={() => this.onDialogClose()} variant={"contained"} color={"secondary"}
								style={{width: "100px"}}>Cancel</Button>
						<Button variant={"contained"} color={"primary"} style={{width: "100px"}}
								onClick={() => this.onConfirmClicked()}
								disabled={!(this.state.player_name)}>Confirm</Button>
					</DialogActions>
				</Dialog>
				<Dialog open={this.state.recording} onClose={() => this.onDialogClose()}>
					<DialogTitle>
						Record a Match Result
					</DialogTitle>
					<DialogContent>
						Winner<br/>
						<Select value={this.state.winner} onChange={(option) => this.onWinnerChange(option)}
								options={this.state.options}/>
						Looser<br/>
						<Select value={this.state.selectedOpponent} onChange={(option) => this.onSelectChange(option)}
								options={this.state.options}/>
						<TextField value={this.state.result} onChange={(e) => this.onResultChange(e)}
								   label={"Match Result (e.g 2:3)"}/>
					</DialogContent>
					<DialogActions style={{margin: "0 auto"}}>
						<Button onClick={() => this.onDialogClose()} variant={"contained"} color={"secondary"}
								style={{width: "100px"}}>Cancel</Button>
						<Button variant={"contained"} color={"primary"} style={{width: "100px"}}
								onClick={() => this.recordMatch()}>Confirm</Button>
					</DialogActions>
				</Dialog>
				<Dialog open={this.state.creating_team} onClose={() => this.onCreateTeamClose()}>
					<DialogTitle>
						Create a new Team
					</DialogTitle>
					<DialogContent>
						<TextField value={this.state.team_name} onChange={(e) => this.onTeamNameChange(e)}
								   label={"Team Name"}/>
					</DialogContent>
					<DialogActions style={{margin: "0 auto"}}>
						<Button onClick={() => this.onCreateTeamClose()} variant={"contained"} color={"secondary"}
								style={{width: "100px"}}>Cancel</Button>
						<Button variant={"contained"} color={"primary"} style={{width: "100px"}}
								onClick={() => this.createTeam()}>Confirm</Button>
					</DialogActions>
				</Dialog>
				<Logo/><br/>
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
				<Button variant={"contained"} color={"primary"} onClick={() => this.onCreateTeamClicked()}
						style={{margin: "10px 5px 0 0", width: "150px"}}>Create
					Team</Button>
				<Button variant={"contained"} color={"primary"} onClick={() => this.onAddPlayerClicked()}
						style={{margin: "10px 0 0 5px", width: "150px"}}>Add
					Player</Button>
			</div>
		);
	}
}

export default MultiplayerView;
