import React, { Component } from 'react';
import './App.css';
import { ModeButton } from "./components/ModeButton";
import Footer from "./components/Footer";
import Logo from "./components/Logo";


class App extends Component {


	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<div className={"App"}>
				<Logo/>
				<ModeButton variant={"contained"} color={"primary"} margin={"15% 5px 0 0"}
							onClick={() => this.props.history.push("/singleplayer-select")}>Singleplayer</ModeButton>
				<ModeButton variant={"contained"} color={"primary"} margin={"15% 0 0 5px"}
							onClick={() => this.props.history.push("/multiplayer-select")}>Multiplayer</ModeButton>
			</div>
		);
	}
}

export default App;
