import React from "react";

const logo = require("../../images/logo.png");

const Logo = () => (
	<a href={"https://timbo.link"} style={{textDecoration: "none", color: "black"}}>
		<div style={{marginTop: "-17%"}}>
			<img src={logo} alt={"Logo"} width={"150px"} style={{marginLeft: "7%"}}/><br/>
			<span style={{fontSize: "30px", fontWeight: "900"}}>Beerpong Leagues</span>
			<br/>
		</div>
	</a>
);

export default Logo;
