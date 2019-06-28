import React, { Component } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	TablePagination,
	TableHead,
	TableFooter,
	Paper
} from "@material-ui/core";

const logo = require("../../images/logo.jpg");

class SingleplayerView extends Component {
	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<div className={"App"}>
				<img src={logo} alt={"Logo"} width={"100px"}/><br/>
				Beerpong Leagues<br/>
				<Paper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Score</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>Timbo</TableCell>
								<TableCell>1000</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Julian</TableCell>
								<TableCell>1000</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Paper>
			</div>
		);
	}
}

export default SingleplayerView;
