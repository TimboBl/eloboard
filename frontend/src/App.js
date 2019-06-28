import React, { Component } from 'react';
import './App.css';
import { ModeButton } from "./components/ModeButton";
import Footer from "./components/Footer";

const logo = require("./images/logo.jpg");

class App extends Component {


	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<div className={"App"}>
				<img src={logo} alt={"Logo"} width={"100px"}/><br/>
				Beerpong Leagues<br/>
				<ModeButton variant={"contained"} color={"primary"} margin={"10% 5px 0 0"}
							onClick={() => this.props.history.push("/singleplayer")}>Singleplayer</ModeButton>
				<ModeButton variant={"contained"} color={"primary"} margin={"10% 0 0 5px"}
							onClick={() => this.props.history.push("/multiplayer")}>Multiplayer</ModeButton>
				<Footer/>
			</div>
		);
	}
}

export default App;
