import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import CardContainer1 from "./components/cardContainer";
import CardContainer2 from "./components/cardContainer2";
import supabase from "./Supabase";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
	const history = useNavigate();
	supabase.auth.getSession().then(({ data: { session } }) => {
		if (!session) {
			history("/");
		}
	});
	const [foods, setFoods] = useState([]);
	const [exercises, setExercises] = useState([]);
	const [userCalGoal, setUserCalGoal] = useState(1500);
	const [userCalLossGoal, setUserCalLossGoal] = useState(1000);
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
	const [displayDate, setDisplayDate] = useState();

	async function getUser() {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const userId = user.id;
		const { data: data, error } = await supabase
			.from("user")
			.select("*")
			.eq("id", userId);
		if (error) {
			throw error;
		} else {
			setUserCalGoal(data[0].calorie_limit.toFixed(0));
			setUserCalLossGoal((data[0].calorie_limit / 8).toFixed(0));
		}
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
			console.log(data);
			setExercises(data);
		}
	}

	async function fetchFoods() {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const todayStart = new Date(date);
		todayStart.setUTCHours(0, 0, 0, 0);
		const todayEnd = new Date(date);
		todayEnd.setUTCHours(23, 59, 59, 999);
		let { data: data, error } = await supabase
			.from("user_meal")
			.select(
				"meal_id,date,quantity,calories,protein,carbs,fat,food_information(*)"
			)
			.eq("user_id", user.id)
			.gte("date", todayStart.toISOString())
			.lt("date", todayEnd.toISOString())
			.order("date", { ascending: false });

		if (error) {
			throw error;
		} else {
			console.log(data, date, todayStart, todayEnd);

			setFoods(data);
		}
	}

	function changeDate() {
		const today = new Date(date);
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const formattedDate = today.toLocaleDateString("en-US", options);

		setDisplayDate(formattedDate);
	}

	useEffect(() => {
		getUser();
	}, []);

	useEffect(() => {
		changeDate();
		fetchFoods();
		getExercises();
	}, [date]);

	return (
		<div>
			<Navbar />
			<br />
			<br />
			<br />
			<br />

			<div style={{ justifyContent: "center", display: "flex" }}>
				<input
					style={{
						color: "blue",
						fontSize: "xxx-large",
						fontFamily: "fantasy",
						textAlign: "center",
						border: "none",
					}}
					type="date"
					value={date}
					max={new Date().toISOString().slice(0, 10)}
					onChange={(e) => setDate(e.target.value)}
				/>
			</div>

			<div
				className="Date"
				style={{
					textAlign: "center",
				}}
				onClick={() => console.log("hi")}
			>
				<p
					style={{
						fontSize: "xxx-large",
						fontFamily: "fantasy",
					}}
				>
					{displayDate}
				</p>
			</div>

			<div
				className="mainWidgets"
				style={{ display: "flex", justifyContent: "space-around" }}
			>
				<CardContainer1
					title="Food"
					type="Caloric Intake"
					contentData={foods}
					goal={userCalGoal}
					fetchFood={fetchFoods}
					date={date}
				/>

				<CardContainer2
					title="Exercises"
					type="Calories Burnt"
					contentData={exercises}
					goal={userCalLossGoal}
					fetchExercise={getExercises}
					date={date}
				/>
			</div>
		</div>
	);
}
