import { useState } from "react";
import supabase from "./Supabase";
import { useNavigate } from "react-router-dom";
import { TextField, Button, InputLabel, Select, MenuItem } from "@mui/material";
function Landing() {
	const [fullName, setFullName] = useState("");
	const [height, setHeight] = useState();
	const [weight, setWeight] = useState();
	const [goal, setGoal] = useState("Lose Weight");
	const [DOB, setDOB] = useState();
	const [activityLevel, setActivityLevel] = useState("Sedentary");

	const [gender, setGender] = useState("male");

	const history = useNavigate();
	supabase.auth.getSession().then(({ data: { session } }) => {
		if (!session) {
			history("/");
		}
	});
	async function insert() {
		const age = new Date().getFullYear() - new Date(DOB).getFullYear();
		const heightInM = height / 100;
		const bmi = (weight / (heightInM * heightInM)).toFixed(2);

		const idealWeight = (2.2 * bmi + 3.5 * bmi * (heightInM - 1.5)).toFixed(2);
		let bodyFat, bmr, calories;

		if (gender === "male") {
			bodyFat = (1.2 * bmi + 0.23 * age - 16.2).toFixed(2);
			bmr = (10 * weight + 6.25 * height - 5 * age + 5).toFixed(2);
		} else {
			bodyFat = (1.2 * bmi + 0.23 * age - 5.4).toFixed(2);
			bmr = (10 * weight + 6.25 * height - 5 * age - 161).toFixed(2);
		}

		if (goal === "Lose Weight") {
			if (activityLevel === "Sedentary") {
				calories = bmr * 1.2 - 500;
			} else if (activityLevel === "Lightly Active") {
				calories = bmr * 1.375 - 500;
			} else if (activityLevel === "Moderately Active") {
				calories = bmr * 1.55 - 500;
			} else if (activityLevel === "Very Active") {
				calories = bmr * 1.725 - 500;
			}
		} else if (goal === "Gain Weight") {
			if (activityLevel === "Sedentary") {
				calories = bmr * 1.2 + 500;
			} else if (activityLevel === "Lightly Active") {
				calories = bmr * 1.375 + 500;
				calories.toFixed(2);
			} else if (activityLevel === "Moderately Active") {
				calories = bmr * 1.55 + 500;
			} else if (activityLevel === "Very Active") {
				calories = bmr * 1.725 + 500;
			}
		} else {
			if (activityLevel === "Sedentary") {
				calories = bmr * 1.2;
			} else if (activityLevel === "Lightly Active") {
				calories = bmr * 1.375;
			} else if (activityLevel === "Moderately Active") {
				calories = bmr * 1.55;
			} else if (activityLevel === "Very Active") {
				calories = bmr * 1.725;
			}
		}
		calories = calories.toFixed(2);
		await supabase.auth.updateUser({
			data: { has_seen_landing: true },
		});
		const { error } = await supabase
			.from("user")
			.insert([
				{
					name: fullName,
					height: height,
					weight: weight,
					goal: goal,
					calorie_limit: calories,
					bmi: bmi,
					body_fat: bodyFat,
					ideal_weight: idealWeight,
					bmr: bmr,
					age: age,
					DOB: DOB,
					gender: gender,
				},
			])
			.select("*");

		if (error) {
			console.log(error);
		} else {
			console.log("success");

			const { error2 } = await supabase.from("user_progress").insert([
				{
					weight: weight,
					body_fat: bodyFat,
				},
			]);
			if (error2) {
				console.log(error);
			} else {
				console.log("success");
				history("/homePage");
			}
		}
	}

	const minDate = new Date();
	minDate.setFullYear(minDate.getFullYear() - 14);
	const minDateStr = minDate.toISOString().slice(0, 10);
	return (
		<>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					padding: "20px",
					boxSizing: "border-box",
				}}
			>
				<h1>Welcome to the landing Page</h1>
				<div
					style={{
						marginTop: "19px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<TextField
						type="text"
						label="Please enter your name"
						placeholder="Full Name"
						variant="outlined"
						sx={{ marginRight: "5px" }}
						onChange={(e) => setFullName(e.target.value)}
						value={fullName}
						required
						maxLength={100}
					/>
				</div>

				<div
					style={{
						marginTop: "19px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<TextField
						type="number"
						label="Fill in your height"
						placeholder="Height in cm"
						variant="outlined"
						sx={{ marginRight: "5px" }}
						onChange={(e) => setHeight(e.target.value)}
						value={height}
						required
					/>
				</div>

				<div
					style={{
						marginTop: "19px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<TextField
						type="number"
						label="Fill in your weightt"
						placeholder="Weight in kg"
						variant="outlined"
						sx={{ marginRight: "5px" }}
						onChange={(e) => setWeight(e.target.value)}
						value={weight}
						required
					/>
				</div>
				<div
					style={{
						marginTop: "19px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<InputLabel id="gender-label"></InputLabel> <br />
					<Select
						sx={{ marginRight: "5px" }}
						style={{ width: 200 }}
						labelId="gender-label"
						id="gender"
						value={gender}
						onChange={(e) => setGender(e.target.value)}
						label="Sex"
						required
					>
						<MenuItem value="male">Male</MenuItem>
						<MenuItem value="female">Female</MenuItem>
					</Select>
				</div>

				<div
					style={{
						marginTop: "19px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<TextField
						type="date"
						style={{ width: 200 }}
						placeholder="Date"
						variant="outlined"
						sx={{ marginRight: "5px" }}
						onChange={(e) => setDOB(e.target.value)}
						value={DOB}
						inputProps={{ max: minDateStr }}
						required
					/>
				</div>
				<div
					style={{
						marginTop: "19px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<InputLabel id="activity-level-label"></InputLabel>
					<Select
						labelId="activity-level-label"
						id="activityLevel"
						onChange={(e) => setActivityLevel(e.target.value)}
						value={activityLevel}
						required
						label="Activity Level"
						style={{ width: 200 }}
						sx={{ marginRight: "5px" }}
					>
						<MenuItem value="Sedentary">Sedentary</MenuItem>
						<MenuItem value="Lightly Active">Lightly Active</MenuItem>
						<MenuItem value="Moderately Active">Moderately Active</MenuItem>
						<MenuItem value="Very Active">Very Active</MenuItem>
					</Select>
				</div>
				<div
					style={{
						marginTop: "19px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<InputLabel id="goal-label"></InputLabel>
					<Select
						labelId="goal-label"
						id="goal"
						onChange={(e) => setGoal(e.target.value)}
						value={goal}
						required
						label="Goal"
						style={{ width: 200 }}
						sx={{ marginRight: "5px" }}
					>
						<MenuItem value="Lose Weight">Lose Weight</MenuItem>
						<MenuItem value="Maintain Weight">Maintain Weight</MenuItem>
						<MenuItem value="Gain Weight">Gain Weight</MenuItem>
					</Select>
				</div>
				<div
					style={{
						marginTop: "19px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Button
						variant="contained"
						color="primary"
						onClick={insert}
						style={{ width: 200 }}
						sx={{ marginRight: "5px" }}
					>
						Submit
					</Button>
				</div>
			</div>
		</>
	);
}
export default Landing;
