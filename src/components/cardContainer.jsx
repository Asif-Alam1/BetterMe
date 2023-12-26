/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	Grid,
	Stack,
	Typography,
	List,
	ListItem,
} from "@mui/material";
import CircularWithValueLabel from "./circularProgressWidget";
import supabase from "../Supabase";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const shadowedBoxStyle = {
	boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)",
	padding: "20px",
	borderRadius: "10px", // Use camelCase for the border-radius property
};

export default function CardContainer1(props) {
	const history = useNavigate();
	const [isButtonVisible, setIsButtonVisible] = useState({});
	const toggleButton = (index) =>
		setIsButtonVisible((prev) => ({ ...prev, [index]: !prev[index] }));

	const totalCalories = props.contentData.reduce(
		(sum, food) => sum + food.calories,
		0
	);
	const CalGoalPercentage = (totalCalories / props.goal) * 100;

	async function handleDeleteClick(food_id) {
		const { data, error } = await supabase
			.from("user_meal")
			.delete()
			.eq("meal_id", food_id)
			.select();
		if (error) {
			console.log(error);
		} else {
			console.log(data);
			props.fetchFood();
		}
	}

	return (
		<Box sx={{ width: "40%", ...shadowedBoxStyle }}>
			<Box sx={{ ...shadowedBoxStyle, height: "330px", my: 2 }}>
				<Grid container alignItems="center">
					<Grid item xs>
						<Typography gutterBottom variant="h4" component="div">
							<h3>{props.title}</h3>
						</Typography>
					</Grid>
					<Grid item>
						<Typography gutterBottom variant="h6" component="div">
							<h4>{props.type}</h4>
						</Typography>
					</Grid>
				</Grid>

				<List
					sx={{
						width: "100%",
						overflowY: props.contentData.length > 1 ? "auto" : "unset",
						maxHeight: props.contentData.length > 1 ? "250px" : "unset",
					}}
					component="nav"
					aria-label="mailbox folders"
				>
					{props.contentData.map((item, index) => (
						<div
							key={index}
							style={{
								display: "flex",
								borderBottom: "1px solid black",
							}}
						>
							<ListItem
								button
								key={index}
								onClick={() => {
									toggleButton(index);
									console.log(item);
								}}
								sx={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<Typography variant="h6">
									{item.food_information.name}
									<Typography variant="subtitle2">
										Quantity:{item.quantity}g&nbsp;|&nbsp; Protein:
										{item.protein}g&nbsp;|&nbsp; Carbs:{item.carbs}
										g&nbsp;|&nbsp; Fat:{item.fat}g
									</Typography>
								</Typography>
								{isButtonVisible[index] && (
									<Button
										sx={{ color: "red", borderColor: "red" }}
										variant="outlined"
										onClick={() => handleDeleteClick(item.meal_id)}
									>
										Delete
									</Button>
								)}
								<Typography variant="subtitle1">{item.calories} Cal</Typography>
							</ListItem>
						</div>
					))}
				</List>
			</Box>

			<div style={{ ...shadowedBoxStyle }}>
				<Stack
					direction="row"
					sx={{ justifyContent: "space-around", alignItems: "center" }}
				>
					<Typography variant="h5">
						Total {props.type}: {totalCalories.toFixed(0)} / {props.goal}
					</Typography>
					<CircularWithValueLabel percentage={CalGoalPercentage} />
				</Stack>

				<Box sx={{ mt: 3, ml: 10, mb: 1 }}>
					<Button
						variant="contained"
						color="secondary"
						endIcon={<ArrowRightAltIcon />}
						sx={{ alignItems: "center" }}
						onClick={() =>
							history("/foodSearch", { state: { date: new Date(props.date) } })
						}
					>
						Go to&nbsp;
						<span style={{ fontWeight: "bold", fontStyle: "italic" }}>
							{props.title}
						</span>
						&nbsp; Manager
					</Button>
				</Box>
			</div>
		</Box>
	);
}
