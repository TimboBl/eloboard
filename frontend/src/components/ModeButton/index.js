import styled from "styled-components";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

export const ModeButton = styled(Button)`
	width: 170px;
	height: 170px;
	border: none;
	outline: none;
	margin: ${props => props.margin} !important;
	padding: ${props => props.padding} !important;
`;

ModeButton.propTypes = {
	margin: PropTypes.string,
	padding: PropTypes.string,
};
