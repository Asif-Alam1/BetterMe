/* eslint-disable no-mixed-spaces-and-tabs */
import supabase from "./Supabase";
import { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import "./Food.css";
import { TextField, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function FoodSearch() {
	const location = useLocation();
	const date = location.state ? location.state.date : new Date();
	const [food, setFood] = useState([]);
	const [search, setSearch] = useState("");
	const [recentFood, setRecentFood] = useState([]);
	const [quantity, setQuantity] = useState([]);
	const [quantity2, setQuantity2] = useState([]);
	const history = useNavigate();
	supabase.auth.getSession().then(({ data: { session } }) => {
		if (!session) {
			history("/");
		}
	});

	function handleQuantityChange(e, index) {
		setQuantity((prevQuantity) => {
			const newQuantity = [...prevQuantity];

			newQuantity[index] = e.target.value;
			return newQuantity;
		});
	}

	function handleQuantity2Change(e, food_id) {
		setQuantity2((prevQuantity) => {
			const newQuantity = { ...prevQuantity };
			newQuantity[food_id] = e.target.value;
			return newQuantity;
		});
	}

	async function handleRecentFoodSubmitClick(e, index) {
		const food = recentFood[index].food_information;
		const quantities = quantity[index];

		const { data, error } = await supabase
			.from("user_meal")
			.insert([
				{
					food_id: food.food_id,
					quantity: quantities,
					calories: ((food.caloriesper100g / 100) * quantities).toFixed(2),
					protein: ((food.protein / 100) * quantities).toFixed(2),
					carbs: ((food.carbs / 100) * quantities).toFixed(2),
					fat: ((food.fat / 100) * quantities).toFixed(2),
					date: date,
				},
			])
			.select();
		if (data) {
			console.log(data);
		} else if (error) {
			console.log(error);
		}
		getRecentFood();
	}

	async function handleFoodSubmitClick(e, food_id) {
		const fooddie = food.find((food) => food.food_id === food_id);
		console.log(fooddie);
		const quantities = quantity2[food_id];

		const { data, error } = await supabase
			.from("user_meal")
			.insert([
				{
					food_id: fooddie.food_id,
					quantity: quantities,
					calories: ((fooddie.caloriesper100g / 100) * quantities).toFixed(2),
					protein: ((fooddie.protein / 100) * quantities).toFixed(2),
					carbs: ((fooddie.carbs / 100) * quantities).toFixed(2),
					fat: ((fooddie.fat / 100) * quantities).toFixed(2),
					date: date,
				},
			])
			.select();
		if (data) {
			console.log(data);
		} else if (error) {
			console.log(error);
		}
		getRecentFood();
	}

	async function getRecentFood() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		let { data: data, error } = await supabase
			.from("user_meal")
			.select("food_information(*)")
			.eq("user_id", user.id)
			.order("date", { ascending: false })
			.limit(15);

		for (let i = 0; i < data.length; i++) {
			quantity[i] = 100;
		}

		if (error) {
			console.log(error);
		} else {
			const foodIds = new Set();
			const uniqueFoods = data.filter((food) => {
				const foodId = food.food_information.food_id;

				if (foodIds.has(foodId)) {
					return false;
				} else {
					foodIds.add(foodId);
					return true;
				}
			});
			// Update the state variable with the filtered array of foods
			setRecentFood(uniqueFoods);
		}
	}

	useEffect(() => {
		getFood();
		getRecentFood();
		console.log("hi");
	}, []);

	async function getFood() {
		let { data: food_information, error } = await supabase
			.from("food_information")
			.select("*")
			.order("food_id", { ascending: true });
		if (error) {
			console.log(error);
		} else {
			setFood(food_information);
		}

		for (let i = 0; i < food_information.length; i++) {
			quantity2[food_information[i].food_id] = 100;
		}
	}

	return (
		<>
			<Navbar />
			<br />
			<br />
			<br />
			<br />
			<br />
			<div>
				<br />
				<br />
				<h1>Food Search</h1>
				<div className="centered-container1">
					<input
						type="search"
						name="foodSearch"
						placeholder="Search for food"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className="card-container">
					{!search && recentFood.length > 0 && <h2>Recent Food</h2>}

					{search && <h2>Search Results</h2>}
					<br />
					<br />
					{!search &&
						recentFood.length > 0 &&
						recentFood.slice(0, 15).map((food, index) => {
							const test = food.food_information;
							return (
								<div key={test.food_id}>
									<h2>{test.name}</h2>
									<p>
										calories:
										{quantity[index]
											? (
													(test.caloriesper100g / 100) *
													quantity[index]
											  ).toFixed(2)
											: test.caloriesper100g}{" "}
										protein:
										{quantity[index]
											? ((test.protein / 100) * quantity[index]).toFixed(2)
											: test.protein}{" "}
										carbs:
										{quantity[index]
											? ((test.carbs / 100) * quantity[index]).toFixed(2)
											: test.carbs}{" "}
										fat:
										{quantity[index]
											? ((test.fat / 100) * quantity[index]).toFixed(2)
											: test.fat}
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
											label="Select quantity (in grams)"
											placeholder="default 100g"
											variant="outlined"
											sx={{ marginRight: "5px" }}
											onChange={(e) => handleQuantityChange(e, index)}
											value={quantity[index] || ""}
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
											onClick={(e) => handleRecentFoodSubmitClick(e, index)}
										>
											Add
										</Button>
									</div>
								</div>
							);
						})}

					{(search || recentFood.length < 1) &&
						food
							.filter((food) => {
								if (food.name.toLowerCase().includes(search.toLowerCase())) {
									return food;
								}
							})
							.slice(0, 15)
							.map((food) => {
								return (
									<div key={food.food_id}>
										<h2>{food.name}</h2>
										<p>
											calories:
											{quantity2[food.food_id]
												? (
														(food.caloriesper100g / 100) *
														quantity2[food.food_id]
												  ).toFixed(2)
												: food.caloriesper100g}{" "}
											protein:
											{quantity2[food.food_id]
												? (
														(food.protein / 100) *
														quantity2[food.food_id]
												  ).toFixed(2)
												: food.protein}{" "}
											carbs:
											{quantity2[food.food_id]
												? (
														(food.carbs / 100) *
														quantity2[food.food_id]
												  ).toFixed(2)
												: food.carbs}{" "}
											fat:
											{quantity2[food.food_id]
												? ((food.fat / 100) * quantity2[food.food_id]).toFixed(
														2
												  )
												: food.fat}
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
												label="Select quantity (in grams)"
												placeholder="default 100g"
												variant="outlined"
												sx={{ marginRight: "5px" }}
												value={quantity2[food.food_id] || ""}
												onChange={(e) => handleQuantity2Change(e, food.food_id)}
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
												onClick={(e) => handleFoodSubmitClick(e, food.food_id)}
											>
												Add
											</Button>
										</div>
									</div>
								);
							})}
				</div>
			</div>
		</>
	);
}
