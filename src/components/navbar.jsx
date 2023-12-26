import { useState } from "react";
import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	Typography,
	Menu,
	Avatar,
	Tooltip,
	MenuItem,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import supabase from "../Supabase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const history = useNavigate();

	async function Logout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			window.alert(error.message);
		} else {
			history("/");
		}
	}

	const settings = ["Profile", "Logout"];
	const [anchorElUser, setAnchorElUser] = useState(null);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<Box>
			<AppBar position="fixed">
				<Toolbar
					sx={{
						justifyContent: "space-between",
						flexDirection: { xs: "column", sm: "row" },
					}}
				>
					<div style={{ display: "flex", alignItems: "center" }}>
						<FitnessCenterIcon
							onClick={() => {
								history("/homePage");
							}}
							fontSize="large"
							sx={{ display: "flex", pr: 1, cursor: "pointer" }}
						/>
						<Typography
							onClick={() => {
								history("/homePage");
							}}
							variant="h3"
							sx={{
								mr: 2,
								display: "flex",
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".2rem",
								color: "inherit",
								flexGrow: 1,
								cursor: "pointer",
								textAlign: { xs: "center", sm: "left" },
							}}
						>
							BetterMe
						</Typography>
					</div>

					<div style={{ display: "flex" }}>
						<Box>
							<Tooltip title="Open settings">
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar alt="" src="/static/images/avatar/2.jpg" />
								</IconButton>
							</Tooltip>
							<Menu
								sx={{
									mt: { xs: "10px", sm: "45px" },
								}}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								{settings.map((setting, i) => (
									<MenuItem
										key={setting}
										onClick={() => {
											i === 0 ? history("/profile") : Logout();
										}}
									>
										<Typography textAlign="center">{setting}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
					</div>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
