import React from "react";

const logo = require("../../images/logo.png");

const Logo = () => (
	<div style={{marginTop: "-17%"}}>
		<img src={logo} alt={"Logo"} width={"150px"}/><br/>
		<span style={{fontSize: "30px", fontWeight: "900"}}>Beerpong Leagues</span>
		<br/>
	</div>
);

export default Logo;
