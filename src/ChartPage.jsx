import { useEffect, useState } from "react";
import supabase from "./Supabase";
import "./Chart.css";
import { Switch, Box, Typography } from "@mui/material";
import {
	Chart as ChartJS,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
	Legend,
	Tooltip,
	Title,
	ArcElement,
	RadialLinearScale,
	Filler,
} from "chart.js";
import { Line, Pie, Radar } from "react-chartjs-2";

ChartJS.register(
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
	Legend,
	Tooltip,
	Title,
	ArcElement,
	RadialLinearScale,
	Filler
);

export default function ChartPage() {
	const [viewPie, setViewPie] = useState(false);
	const [progressData, setProgressData] = useState([]);
	const [monthNumbers, setMonthNumbers] = useState([]);
	const [bodyFat, setBodyFat] = useState([]);
	useEffect(() => {
		const fetchProgressData = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				const userId = user.id;
				console.log(userId);

				const { data, error } = await supabase
					.from("user_progress")
					.select("weight, month, body_fat")
					.eq("user_id", userId)
					.order("month", { ascending: true });

				if (error) {
					throw error;
				}

				const bf = data.map((entry) => entry.body_fat);
				const weights = data.map((entry) => entry.weight);
				const months = data.map((entry) => {
					const fullMonth = entry.month;

					const monthNumber = new Date(fullMonth).getMonth() + 1;
					return monthNumber.toString().padStart(2, "0");
				});
				setBodyFat(bf);
				setProgressData(weights);
				setMonthNumbers(months);
			} catch (error) {
				console.error("Error fetching progress data:", error.message);
			}
		};

		fetchProgressData();
	}, []);

	const [nutritionSums, setNutritionSums] = useState([]);

	useEffect(() => {
		const fetchFoodData = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				const userId = user.id;
				console.log(userId);

				const { data, error } = await supabase
					.from("user_meal")
					.select("fat, protein, carbs")
					.eq("user_id", userId);

				if (error) {
					throw error;
				}

				if (data) {
					const sumData = data.reduce(
						(acc, entry) => {
							acc.fat += entry.fat || 0;
							acc.protein += entry.protein || 0;
							acc.carbs += entry.carbs || 0;
							return acc;
						},
						{ fat: 0, protein: 0, carbs: 0 }
					);

					const nutritionSumsArray = [
						sumData.protein,
						sumData.fat,
						sumData.carbs,
					];
					setNutritionSums(nutritionSumsArray);
				}
			} catch (error) {
				console.error("Error fetching progress data:", error.message);
			}
		};

		fetchFoodData();
	}, []);

	const data = {
		labels: monthNumbers,
		datasets: [
			{
				label: "weight",
				data: progressData,
				backgroundColor: "rgba(0, 123, 255, 0.2)",
				borderColor: "rgba(0, 123, 255, 1)",
				pointBackgroundColor: "rgba(0, 123, 255, 1)",
				tension: 0.4,
				yAxisID: "y",
				spanGaps: true,
			},
			{
				label: "BodyFat",
				data: bodyFat,
				backgroundColor: "rgba(255, 0, 0, 0.2)",
				borderColor: "rgba(255, 0, 0, 1)",
				pointBackgroundColor: "rgba(255, 0, 0, 1)",
				tension: 0.4,
				yAxisID: "y1",
				spanGaps: true,
			},
		],
	};
	const lowestValue = Math.min(
		...data.datasets.flatMap((dataset) => dataset.data)
	);
	const suggestedMin = Math.max(0, lowestValue - 10);

	const options = {
		title: {
			display: true,
			text: "Weight Progression Chart",
		},
		animation: {
			duration: 300,
		},
		interaction: {
			mode: "index",
		},
		plugins: {
			legend: true,
		},
		scales: {
			y: {
				beginAtZero: true,
				position: "left",
				suggestedMin: suggestedMin,
				title: {
					display: true,
					text: "Weight KG",
				},
			},
			y1: {
				position: "right",
				suggestedMin: suggestedMin,
				grid: {
					drawOnChartArea: false,
				},
				title: {
					display: true,
					text: "Bodyfat %",
				},
			},
			x: {
				title: {
					display: true,
					text: "Month",
				},
			},
		},
	};

	const data2 = {
		labels: ["protein", "fats", "carbs"],
		datasets: [
			{
				label: "grams",
				data: nutritionSums,
				backgroundColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
				],
				borderWidth: 1,
			},
		],
	};
	const data3 = {
		labels: ["Protein", "Fats", "Carbs"],
		datasets: [
			{
				label: "grams",
				data: nutritionSums,
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className="chart">
			<Box display="inline-block" border="4px outset  yellow" padding="9px">
				<Typography variant="h4" component="h1">
					Track your progress
				</Typography>
			</Box>
			<br />
			<br />
			<div className="container">
				<div className="item1">
					<h2>Weight And Bodyfat Progression</h2>
					<div className="centered-container">
						<Line data={data} options={options}></Line>
					</div>
				</div>
				<div className="item2">
					<h2>Food Detail Summary</h2>
					<div>
						<span>Simple view</span>
						<Switch
							defaultChecked
							onClick={() => {
								setViewPie(!viewPie);
							}}
						/>
						<span>Advanced View</span>
						<br />

						{viewPie && (
							<div className="centered-container">
								<Pie data={data2} />
							</div>
						)}
						{!viewPie && (
							<div className="centered-container">
								<Radar data={data3} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
