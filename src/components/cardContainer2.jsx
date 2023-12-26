/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
	Box,
	Button,
	Grid,
	Stack,
	Typography,
	List,
	ListItem,
} from "@mui/material";
import CircularWithValueLabel1 from "./circularProgressWidget2";
import supabase from "../Supabase";
import { useNavigate } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const shadowedBoxStyle = {
	boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)",
	padding: "20px",
};

export default function CardContainer2(props) {
	const [date, setDate] = useState(new Date());
	const [showCalendar, setShowCalendar] = useState(false);
	const [exercises, setExercises] = useState([]);

	function handleButtonClick() {
		setShowCalendar((prev) => !prev);
	}

	function handleDateChange(newDate) {
		setDate(newDate);
		setShowCalendar(false);
	}

	useEffect(() => {
		getExercises();
	}, [date]);

	function addExercise() {
		exercises.map(async (item) => {
			const { data, error } = await supabase
				.from("user-workout")
				.insert([
					{
						exercise_id: item.exercise_information.exercise_id,
						duration: item.duration,
						calories_burnt: item.calories_burnt,
						date: props.date,
					},
				])
				.select();
			if (error) {
				console.log(error);
			} else {
				console.log(data);
			}
		});
		props.fetchExercise();
	}

	async function getExercises() {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const todayStart = new Date(date);
		todayStart.setUTCHours(0, 0, 0, 0);
		const todayEnd = new Date(date);
		todayEnd.setUTCHours(23, 59, 59, 999);
		let { data: data, error } = await supabase
			.from("user-workout")
			.select("workout_id,date,calories_burnt,duration,exercise_information(*)")
			.eq("user_id", user.id)
			.gte("date", todayStart.toISOString())
			.lt("date", todayEnd.toISOString())
			.order("date", { ascending: false });

		if (error) {
			throw error;
		} else {
			setExercises(data);
			addExercise();
		}
	}

	const history = useNavigate();
	const [isButtonVisible, setIsButtonVisible] = useState({});
	const toggleButton = (index) =>
		setIsButtonVisible((prev) => ({ ...prev, [index]: !prev[index] }));

	async function handleDeleteClick(workout_id) {
		const { data, error } = await supabase
			.from("user-workout")
			.delete()
			.eq("workout_id", workout_id)
			.select();
		if (error) {
			console.log(error);
		} else {
			console.log(data);
			props.fetchExercise();
		}
	}
	const totalCalories = props.contentData.reduce(
		(sum, food) => sum + food.calories_burnt,
		0
	);
	const CalGoalPercentage = (totalCalories / props.goal) * 100;

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
						bgcolor: "background.paper",
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
								onClick={() => toggleButton(index)}
								sx={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<Typography variant="h6">
									{item.exercise_information.name}
									<Typography variant="subtitle1">
										{item.duration} min
									</Typography>
								</Typography>
								{isButtonVisible[index] && (
									<Button
										variant="outlined"
										onClick={() => handleDeleteClick(item.workout_id)}
										sx={{ color: "red", borderColor: "red" }}
									>
										Delete
									</Button>
								)}
								<Typography variant="subtitle1">
									{item.calories_burnt} Cal
								</Typography>
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
					<CircularWithValueLabel1 percentage={CalGoalPercentage} />
				</Stack>

				<Box sx={{ mt: 3, ml: 10, mb: 1 }}>
					<Button
						variant="contained"
						color="secondary"
						endIcon={<ArrowRightAltIcon />}
						onClick={() =>
							history("/exerciseSearch", {
								state: { date: new Date(props.date) },
							})
						}
					>
						Go to&nbsp;
						<span style={{ fontWeight: "bold", fontStyle: "italic" }}>
							{props.title}
						</span>
						&nbsp; Manager
					</Button>

					<br />
					<br />
					<Button
						variant="contained"
						color="primary"
						endIcon={<ArrowRightAltIcon />}
						onClick={handleButtonClick}
					>
						Same as
					</Button>
					{/* Render the calendar conditionally based on the showCalendar state */}
					{showCalendar && (
						<DatePicker
							selected={showCalendar ? date : new Date()}
							onChange={handleDateChange}
							inline
							maxDate={new Date()}
						/>
					)}
				</Box>
			</div>
		</Box>
	);
}
