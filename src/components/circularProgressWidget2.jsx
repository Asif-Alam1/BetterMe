/* eslint-disable react/prop-types */
import * as React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CircularProgressWithLabel1(props) {
	const getColor = (value) => {
		if (value >= 75) {
			return "primary";
		} else {
			return "warning";
		}
	};

	return (
		<Box sx={{ position: "relative", display: "inline-flex" }}>
			<CircularProgress
				size={70}
				thickness={3}
				color={getColor(props.value)}
				variant="determinate"
				value={props.value >= 100 ? 100 : props.value}
			/>
			<Box
				sx={{
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					position: "absolute",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Typography variant="body1" component="div" color="text.secondary">
					{`${Math.round(props.value)}%`}
				</Typography>
			</Box>
		</Box>
	);
}

CircularProgressWithLabel1.propTypes = {
	value: PropTypes.number.isRequired,
};

export default function CircularWithValueLabel1(props) {
	const [progress, setProgress] = React.useState(props.percentage);

	React.useEffect(() => {
		setProgress(props.percentage);
	}, [props.percentage]);

	return <CircularProgressWithLabel1 value={progress} />;
}
