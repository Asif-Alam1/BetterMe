import { useState, useEffect } from "react";
import supabase from "./Supabase";
import Navbar from "./components/navbar";
import "./Food.css";
import { TextField, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function ExerciseSearch() {
	const location = useLocation();
	const [reset, setReset] = useState(false);
	const date = location.state ? location.state.date : new Date();
	const [exercises, setExercises] = useState([]);
	const [search, setSearch] = useState("");
	const [recentExercises, setRecentExercises] = useState([]);
	const [time1, setTime1] = useState([]);
	const [time2, setTime2] = useState([]);
	const history = useNavigate();
	supabase.auth.getSession().then(({ data: { session } }) => {
		if (!session) {
			history("/");
		}
	});

	function handleTime1Change(e, index) {
		setTime1((prevTime) => {
			const newTime = [...prevTime];
			newTime[index] = e.target.value;
			return newTime;
		});
	}

	function handleTime2Change(e, exercise_id) {
		setTime2((prevTime) => {
			const newTime = { ...prevTime };
			newTime[exercise_id] = e.target.value;
			return newTime;
		});
	}

	async function handleRecentExercisesSubmitClick(e, index) {
		const exercise = recentExercises[index].exercise_information;
		const time = time1[index];

		const { data, error } = await supabase
			.from("user-workout")
			.insert([
				{
					exercise_id: exercise.exercise_id,
					duration: time,
					calories_burnt: exercise.calories_burnt_fact * time,
					date: date,
				},
			])
			.select();

		if (data) {
			console.log(data);
		} else if (error) {
			console.log(error);
		}
		getRecentExercises();
	}

	async function handleExerciseSubmitClick(e, exercise_id) {
		const exercise = exercises.find(
			(exercise) => exercise.exercise_id == exercise_id
		);
		const time = time2[exercise_id];

		const { data, error } = await supabase
			.from("user-workout")
			.insert([
				{
					exercise_id: exercise.exercise_id,
					duration: time,
					calories_burnt: exercise.calories_burnt_fact * time,
					date: date,
				},
			])
			.select();

		if (data) {
			console.log(data);
		} else if (error) {
			console.log(error);
		}

		getRecentExercises();
	}

	async function getRecentExercises() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		let { data: data, error } = await supabase
			.from("user-workout")
			.select("exercise_information(*)")
			.eq("user_id", user.id)
			.order("date", { ascending: false })
			.limit(15);

		for (let i = 0; i < data.length; i++) {
			time1[i] = 15;
		}
		if (error) {
			console.log(error);
		} else {
			const exerciseIds = new Set();
			const uniqueExercises = data.filter((exercise) => {
				const exerciseId = exercise.exercise_information.exercise_id;

				if (exerciseIds.has(exerciseId)) {
					return false;
				} else {
					exerciseIds.add(exerciseId);
					return true;
				}
			});
			// Update the state variable with the filtered array of foods
			setRecentExercises(uniqueExercises);
		}
	}

	async function getExercises() {
		let { data: exercise_information, error } = await supabase
			.from("exercise_information")
			.select("*")
			.order("exercise_id", { ascending: true });
		if (error) {
			console.log(error);
		} else {
			setExercises(exercise_information);
		}

		for (let i = 0; i < exercise_information.length; i++) {
			time2[exercise_information[i].exercise_id] = 15;
		}
	}

	useEffect(() => {
		getExercises();
		getRecentExercises();
		console.log("hi");
	}, []);

	return (
		<>
			<Navbar />
			<br />
			<br />
			<br />
			<br />
			<br />
			<h1>Exercise Search</h1>
			<div className="centered-container1">
				<input
					type="search"
					name="ExerciseSearch"
					placeholder="Search for Exercise"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className="card-container">
				{!search && recentExercises.length > 0 && <h2>Recent Exercise</h2>}
				{search && <h2>Search Results</h2>}

				{!search &&
					!reset &&
					recentExercises.length > 0 &&
					recentExercises.slice(0, 15).map((exercise, index) => {
						const test = exercise.exercise_information;
						return (
							<div key={test.food_id}>
								<h2>{test.name}</h2>
								<p>
									calories Burnt:
									{(test.calories_burnt_fact * time1[index]).toFixed(2)} Muscle
									Targeted:
									{test.muscle_targeted}
								</p>
								<div
									style={{
										marginTop: "19px",
										display: "flex",
										justifyContent: "center",
									}}
								>
									<TextField
										type="number"
										label="Select reps"
										placeholder="default 15"
										variant="outlined"
										sx={{ marginRight: "5px" }}
										value={time1[index] || ""}
										onChange={(e) => handleTime1Change(e, index)}
									/>
									<Button
										sx={{
											backgroundColor: "white",
											color: "black",
											"&:hover": {
												color: "white",
											},
										}}
										type="submit"
										size="small"
										variant="contained"
										color="secondary"
										onClick={(e) => handleRecentExercisesSubmitClick(e, index)}
									>
										Add
									</Button>
								</div>
							</div>
						);
					})}

				{(search || recentExercises.length < 1 || reset) &&
					exercises
						.filter((exercise) => {
							if (exercise.name.toLowerCase().includes(search.toLowerCase())) {
								return exercise;
							}
						})
						.slice(0, 15)
						.map((exercise) => {
							return (
								<div key={exercise.exercise_id}>
									<h2>{exercise.name}</h2>
									<p>
										calories Burnt:
										{(
											exercise.calories_burnt_fact * time2[exercise.exercise_id]
										).toFixed(2)}{" "}
										Muscle Targeted:
										{exercise.muscle_targeted}
									</p>
									<input
										type="number"
										name="quantity"
										value={time2[exercise.exercise_id] || ""}
										onChange={(e) => handleTime2Change(e, exercise.exercise_id)}
									/>
									<input
										type="submit"
										value="Add"
										onClick={(e) =>
											handleExerciseSubmitClick(e, exercise.exercise_id)
										}
									/>
								</div>
							);
						})}
				{!reset && (
					<Button
						sx={{
							backgroundColor: "white",
							color: "black",
							"&:hover": {
								color: "white",
							},
						}}
						size="small"
						variant="contained"
						onClick={() => setReset(!reset)}
					>
						Reset
					</Button>
				)}
				{reset && (
					<Button
						sx={{
							backgroundColor: "white",
							color: "black",
							"&:hover": {
								color: "white",
							},
						}}
						size="small"
						variant="contained"
						onClick={() => setReset(!reset)}
					>
						Undo
					</Button>
				)}
			</div>
		</>
	);
}
