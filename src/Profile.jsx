import { useState, useEffect } from "react";
import supabase from "./Supabase";
import Navbar from "./components/navbar";
import ChartPage from "./ChartPage";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import {
	Typography,
	Button,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Box,
} from "@mui/material";

export default function Profile() {
	const [profile, setProfile] = useState("");
	const [isEditingName, setIsEditingName] = useState(false);
	const [isEditingAge, setIsEditingAge] = useState(false);
	const [isEditingGender, setIsEditingGender] = useState(false);
	const [isEditingHeight, setIsEditingHeight] = useState(false);
	const [isEditingWeight, setIsEditingWeight] = useState(false);
	const [isEditingGoal, setIsEditingGoal] = useState(false);
	const [isEditingActivityLevel, setIsEditingActivityLevel] = useState(false);
	const [fullName, setFullName] = useState(profile.name);
	const [gender, setGender] = useState(profile.gender);
	const [height, setHeight] = useState(profile.height);
	const [weight, setWeight] = useState(profile.weight);
	const [goal, setGoal] = useState(profile.goal);
	const [DOB, setDOB] = useState(profile.dob);
	const [activityLevel, setActivityLevel] = useState(profile.activity_level);

	const history = useNavigate();
	supabase.auth.getSession().then(({ data: { session } }) => {
		if (!session) {
			history("/");
		}
	});
	async function getUser() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { data: data, error } = await supabase
			.from("user")
			.select("*")
			.eq("id", user.id);
		if (error) {
			console.log(error);
		} else {
			setProfile(data[0]);
		}
	}
	useEffect(() => {
		getUser();
	}, []);

	async function updateProfile(label, value) {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		let age, heightInM, bmi, idealWeight, bodyFat, bmr, calories, gender;
		age = profile.age;

		heightInM = profile.height / 100;
		gender = profile.gender;
		bmi = profile.bmi;
		idealWeight = profile.ideal_weight;
		bodyFat = profile.body_fat;
		bmr = profile.bmr;
		calories = profile.calorie_limit;
		let weight = profile.weight;
		let height = profile.height;
		let goal = profile.goal;
		let activityLevel = profile.activity_level;
		if (label === "DOB" || label == "gender") {
			if (label === "DOB") {
				age = calculateAge(value);
			} else {
				gender = value;
			}

			if (gender === "male") {
				bodyFat = (1.2 * bmi + 0.23 * age - 16.2).toFixed(2);
				bmr = 10 * weight + 6.25 * height - 5 * age + 5;
			} else {
				bodyFat = (1.2 * bmi + 0.23 * age - 5.4).toFixed(2);
				bmr = 10 * weight + 6.25 * height - 5 * age - 161;
			}

			console.log("bodyFat" + bodyFat);
			console.log("bmr" + bmr);

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
			console.log("calories" + calories);

			const { data, error } = await supabase
				.from("user")
				.update({
					[label]: value,
					age: age,
					body_fat: bodyFat,
					bmr: bmr,
					calorie_limit: calories,
				})
				.eq("id", user.id)
				.select();
			if (error) {
				console.log(error);
			} else {
				console.log(data);
				getUser();
			}
		} else if (label === "goal" || label === "activity_level") {
			if (label === "goal") {
				goal = value;
				console.log(value);
			} else {
				activityLevel = value;
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
			console.log("calories" + calories);
			const { data, error } = await supabase
				.from("user")
				.update({
					[label]: value,
					calorie_limit: calories,
				})
				.eq("id", user.id)
				.select();
			if (error) {
				console.log(error);
			} else {
				console.log(data);
				getUser();
			}
		} else if (label === "height" || label === "weight") {
			if (label === "height") height = value;
			else weight = value;

			heightInM = height / 100;
			bmi = (weight / (heightInM * heightInM)).toFixed(2);
			idealWeight = (2.2 * bmi + 3.5 * bmi * (heightInM - 1.5)).toFixed(2);

			if (gender == "male") {
				bodyFat = (1.2 * bmi + 0.23 * age - 16.2).toFixed(2);
				bmr = 10 * weight + 6.25 * height - 5 * age + 5;
			} else {
				bodyFat = (1.2 * bmi + 0.23 * age - 5.4).toFixed(2);
				bmr = 10 * weight + 6.25 * height - 5 * age - 161;
			}

			console.log("bodyFat" + bodyFat);
			console.log("bmr" + bmr);

			if (goal == "Lose Weight") {
				if (activityLevel == "Sedentary") {
					calories = bmr * 1.2 - 500;
				} else if (activityLevel == "Lightly Active") {
					calories = bmr * 1.375 - 500;
				} else if (activityLevel == "Moderately Active") {
					calories = bmr * 1.55 - 500;
				} else if (activityLevel == "Very Active") {
					calories = bmr * 1.725 - 500;
				}
			} else if (goal == "Gain Weight") {
				if (activityLevel == "Sedentary") {
					calories = bmr * 1.2 + 500;
				} else if (activityLevel == "Lightly Active") {
					calories = bmr * 1.375 + 500;
					calories.toFixed(2);
				} else if (activityLevel == "Moderately Active") {
					calories = bmr * 1.55 + 500;
				} else if (activityLevel == "Very Active") {
					calories = bmr * 1.725 + 500;
				}
			} else {
				if (activityLevel == "Sedentary") {
					calories = bmr * 1.2;
				} else if (activityLevel == "Lightly Active") {
					calories = bmr * 1.375;
				} else if (activityLevel == "Moderately Active") {
					calories = bmr * 1.55;
				} else if (activityLevel == "Very Active") {
					calories = bmr * 1.725;
				}
			}
			calories = calories.toFixed(2);
			console.log("calories" + calories);

			const { data, error } = await supabase
				.from("user")
				.update({
					[label]: value,
					bmi: bmi,
					ideal_weight: idealWeight,

					body_fat: bodyFat,
					bmr: bmr,
					calorie_limit: calories,
				})
				.eq("id", user.id)
				.select();
			if (error) {
				console.log(error);
			} else {
				console.log(data);
				getUser();
			}
		} else if (label === "name") {
			const { data, error } = await supabase
				.from("user")
				.update({
					[label]: value,
				})
				.eq("id", user.id)
				.select();
			if (error) {
				console.log(error);
			} else {
				console.log(data);
				getUser();
			}
		}
	}
	const minDate = new Date();
	minDate.setFullYear(minDate.getFullYear() - 14);
	const minDateStr = minDate.toISOString().slice(0, 10);

	function calculateAge(dob) {
		return new Date().getFullYear() - new Date(dob).getFullYear();
	}
	return (
		<div>
			<Navbar />
			<Typography
				sx={{
					marginTop: "90px",
				}}
				variant="h1"
				component="h1"
				gutterBottom
			>
				Profile
			</Typography>
			<br />
			<div
				style={{
					marginLeft: "40px",
					marginRight: "40px",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<div id="input-fields">
					<Box display="inline-block" border="4px outset yellow" padding="9px">
						<Typography variant="h4" component="h1">
							Manage your information
						</Typography>
					</Box>
					<br />
					<br />
					<h2>Name: {profile.name}</h2>
					{!isEditingName && (
						<div>
							<Button
								variant="outlined"
								onClick={() => setIsEditingName(!isEditingName)}
							>
								edit
							</Button>
						</div>
					)}

					{isEditingName && (
						<div>
							<TextField
								type="text"
								sx={{ marginRight: "5px" }}
								label="Full Name"
								placeholder="Enter your full name"
								variant="outlined"
								onChange={(e) => setFullName(e.target.value)}
								value={fullName}
								required
								inputProps={{ maxLength: 100 }}
								style={{
									width: "150px",
									marginBottom: "16px",
								}}
							/>
							<Button
								variant="contained"
								color="success"
								onClick={() => {
									updateProfile("name", fullName);
									setIsEditingName(!isEditingName);
								}}
							>
								Submit
							</Button>

							<Button
								size="small"
								sx={{ ml: 1 }}
								color="error"
								variant="outlined"
								onClick={() => {
									setIsEditingName(!isEditingName);
								}}
							>
								Cancel
							</Button>
						</div>
					)}

					<h2>Age: {profile.age} years</h2>
					{!isEditingAge && (
						<div>
							<Button
								variant="outlined"
								onClick={() => setIsEditingAge(!isEditingAge)}
							>
								edit
							</Button>
						</div>
					)}
					{isEditingAge && (
						<div>
							<TextField
								type="date"
								label="Date of Birth"
								variant="outlined"
								sx={{ marginRight: "5px" }}
								//   fullWidth
								onChange={(e) => setDOB(e.target.value)}
								value={DOB}
								required
								max={minDateStr}
								inputProps={{ max: minDateStr }}
								InputLabelProps={{ shrink: true }}
								style={{ marginBottom: "16px", width: "150px" }}
							/>
							<Button
								variant="outlined"
								color="success"
								onClick={() => {
									updateProfile("DOB", DOB);
									setIsEditingAge(!isEditingAge);
								}}
							>
								Submit
							</Button>

							<Button
								size="small"
								sx={{ ml: 1 }}
								color="error"
								variant="outlined"
								onClick={() => {
									setIsEditingAge(!isEditingAge);
								}}
							>
								Cancel
							</Button>
						</div>
					)}

					<h2>Gender: {profile.gender}</h2>
					{!isEditingGender && (
						<div>
							<Button
								variant="outlined"
								onClick={() => setIsEditingGender(!isEditingGender)}
							>
								edit
							</Button>
						</div>
					)}

					{isEditingGender && (
						<div>
							<FormControl
								variant="outlined"
								style={{
									width: "150px",
									marginBottom: "16px",
									marginRight: "5px",
								}}
							>
								<InputLabel htmlFor="gender">Gender</InputLabel>
								<Select
									label="Gender"
									name="gender"
									id="gender"
									onChange={(e) => setGender(e.target.value)}
									value={gender}
									required
								>
									<MenuItem value="male">Male</MenuItem>
									<MenuItem value="female">Female</MenuItem>
								</Select>
							</FormControl>
							<Button
								variant="contained"
								color="success"
								onClick={() => {
									updateProfile("gender", gender);
									setIsEditingGender(!isEditingGender);
								}}
							>
								Submit
							</Button>

							<Button
								size="small"
								sx={{ ml: 1 }}
								color="error"
								variant="outlined"
								onClick={() => {
									setIsEditingGender(!isEditingGender);
								}}
							>
								Cancel
							</Button>
						</div>
					)}

					<h2>Height: {profile.height}cm</h2>
					{!isEditingHeight && (
						<div>
							<Button
								variant="outlined"
								onClick={() => setIsEditingHeight(!isEditingHeight)}
							>
								edit
							</Button>
						</div>
					)}

					{isEditingHeight && (
						<div>
							<TextField
								type="number"
								label="Height in Cm"
								placeholder="Enter your height in centimeters"
								variant="outlined"
								sx={{ marginRight: "5px" }}
								onChange={(e) => setHeight(e.target.value)}
								value={height}
								required
								style={{
									width: "150px",
									marginBottom: "16px",
								}}
							/>
							<Button
								variant="contained"
								color="success"
								onClick={() => {
									updateProfile("height", height);
									setIsEditingHeight(!isEditingHeight);
								}}
							>
								Submit
							</Button>

							<Button
								size="small"
								sx={{ ml: 1 }}
								color="error"
								variant="outlined"
								onClick={() => {
									setIsEditingHeight(!isEditingHeight);
								}}
							>
								Cancel
							</Button>
						</div>
					)}

					<h2>Weight: {profile.weight}Kg</h2>
					{!isEditingWeight && (
						<div>
							<Button
								variant="outlined"
								onClick={() => setIsEditingWeight(!isEditingWeight)}
							>
								edit
							</Button>
						</div>
					)}

					{isEditingWeight && (
						<div>
							<TextField
								type="number"
								label="Weight in Kg"
								placeholder="Enter your weight in kilograms"
								variant="outlined"
								onChange={(e) => setWeight(e.target.value)}
								value={weight}
								required
								style={{
									width: "150px",
									marginBottom: "16px",
									marginRight: "5px",
								}}
							/>
							<Button
								variant="contained"
								color="success"
								onClick={() => {
									updateProfile("weight", weight);
									setIsEditingWeight(!isEditingWeight);
								}}
							>
								Submit
							</Button>

							<Button
								size="small"
								sx={{ ml: 1 }}
								color="error"
								variant="outlined"
								onClick={() => {
									setIsEditingWeight(!isEditingWeight);
								}}
							>
								Cancel
							</Button>
						</div>
					)}

					<h2>Fitness Goal: {profile.goal}</h2>
					{!isEditingGoal && (
						<div>
							<Button
								variant="outlined"
								onClick={() => setIsEditingGoal(!isEditingGoal)}
							>
								edit
							</Button>
						</div>
					)}

					{isEditingGoal && (
						<div>
							<FormControl
								variant="outlined"
								// fullWidth
								style={{
									marginBottom: "16px",
									marginRight: "5px",
									width: "150px",
								}}
							>
								<InputLabel htmlFor="goal">Goal</InputLabel>
								<Select
									label="goal"
									name="goal"
									id="goal"
									onChange={(e) => setGoal(e.target.value)}
									value={goal}
									required
								>
									<MenuItem value="Lose Weight">Lose Weight</MenuItem>
									<MenuItem value="Maintain Weight">Maintain Weight</MenuItem>
									<MenuItem value="Gain Weight">Gain Weight</MenuItem>
								</Select>
							</FormControl>
							<Button
								variant="contained"
								color="success"
								onClick={() => {
									updateProfile("goal", goal);
									setIsEditingGoal(!isEditingGoal);
								}}
							>
								Submit
							</Button>

							<Button
								size="small"
								sx={{ ml: 1 }}
								color="error"
								variant="outlined"
								onClick={() => {
									setIsEditingGoal(!isEditingGoal);
								}}
							>
								Cancel
							</Button>
						</div>
					)}

					<h2>Activity Level: {profile.activity_level}</h2>
					{!isEditingActivityLevel && (
						<div>
							<Button
								variant="outlined"
								onClick={() =>
									setIsEditingActivityLevel(!isEditingActivityLevel)
								}
							>
								edit
							</Button>
						</div>
					)}

					{isEditingActivityLevel && (
						<div>
							<FormControl
								variant="outlined"
								style={{
									width: "150px",
									marginBottom: "16px",
									marginRight: "5px",
								}}
							>
								<InputLabel htmlFor="activityLevel">Activity Level</InputLabel>
								<Select
									label="Activity Level"
									name="activityLevel"
									id="activityLevel"
									onChange={(e) => setActivityLevel(e.target.value)}
									value={activityLevel}
									required
								>
									<MenuItem value="Sedentary">Sedentary</MenuItem>
									<MenuItem value="Lightly Active">Lightly Active</MenuItem>
									<MenuItem value="Moderately Active">
										Moderately Active
									</MenuItem>
									<MenuItem value="Very Active">Very Active</MenuItem>
								</Select>
							</FormControl>
							<Button
								variant="contained"
								color="success"
								onClick={() => {
									updateProfile("activity_level", activityLevel);
									setIsEditingActivityLevel(!isEditingActivityLevel);
								}}
							>
								Submit
							</Button>

							<Button
								size="small"
								sx={{ ml: 1 }}
								color="error"
								variant="outlined"
								onClick={() => {
									setIsEditingActivityLevel(!isEditingActivityLevel);
								}}
							>
								Cancel
							</Button>
						</div>
					)}
					<div>
						<h2>Daily Calorie Limit:{profile.calorie_limit}</h2>
					</div>
					<br />
					<div>
						<h2>BMI:{profile.bmi}</h2>
					</div>
					<div>
						<ChartPage />
					</div>
				</div>
			</div>
		</div>
	);
}
