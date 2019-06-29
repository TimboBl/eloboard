import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import store from "./store";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import SingleplayerView from "./containers/SingleplayerView";
import SinglePlayerBoardSelection from "./containers/SinglePlayerBoardSelection";
import MultiPlayerBoardSelection from "./containers/MultiPlayerBoardSelection";
import MultiplayerView from "./containers/MultiplayerView";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#f7b731"
		},
		secondary: {
			main: "#eb3b5a"
		},
	},
	typography: {
		fontFamily: ["Arimo", "sans-serif"].join(",")
	}
});

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<BrowserRouter>
				<Route exact={true} path={"/"} component={App}/>
				<Route exact={true} path={"/singleplayer-select"} component={SinglePlayerBoardSelection}/>
				<Route exact={true} path={"/singleplayer"} component={SingleplayerView}/>
				<Route exact={true} path={"/multiplayer-select"} component={MultiPlayerBoardSelection}/>
				<Route exact={true} path={"/multiplayer"} component={MultiplayerView}/>
			</BrowserRouter>
		</MuiThemeProvider>
	</Provider>,
	document.getElementById('root'));
registerServiceWorker();
