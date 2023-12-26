import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./Landing.jsx";
import FoodSearch from "./FoodSearch.jsx";
import ExerciseSearch from "./ExerciseSearch.jsx";
import HomePage from "./HomePage.jsx";
import Profile from "./Profile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/landing" element={<Landing />} />
				<Route path="/foodSearch" element={<FoodSearch />} />
				<Route path="/exerciseSearch" element={<ExerciseSearch />} />
				<Route path="/homePage" element={<HomePage />} />
				<Route path="/profile" element={<Profile />} />
				<Route
					path="*"
					element={<h1>Error 404 the page you requested is not Found</h1>}
				/>
			</Routes>
		</Router>
	</React.StrictMode>
);
