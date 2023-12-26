import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import supabase from "./Supabase";
import styled from "styled-components";
import HomePage from "./Homepage";

const StyledContainer = styled.div`
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const StyledAuthContainer = styled.div`
  max-width: 700px;
  width: 100%;
`;

function App() {
	const history = useNavigate();
	const location = useLocation(); // Access current location
	const [session, setSession] = useState(null);

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				if (event === "SIGNED_IN") {
					const userMetadata = session.user.user_metadata;
					if (!userMetadata || !userMetadata.has_seen_landing) {
						history("/landing");
					} else {
						history("/homePage");
					}
				}
			}
		);

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, [history]);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);

			console.log(location.pathname);
			// Check for unauthorized access on protected routes
			if (!session && location.pathname !== "/") {
				history("/");
			}
		}, []);

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, [location, history]);

	if (!session) {
		return (
			<StyledContainer>
				<StyledAuthContainer>
					<Auth
						supabaseClient={supabase}
						theme="light"
						appearance={{
							theme: ThemeSupa,
							variables: {
								default: {
									colors: {
										brand: "red",
										brandAccent: "darkred",
									},
								},
							},
						}}
						providers={["google", "github"]}
						localization={{
							variables: {
								sign_in: {
									email_label: "Email Address",
									password_label: "Password",
								},
							},
						}}
					/>
				</StyledAuthContainer>
			</StyledContainer>
		);
	}
	return <HomePage />;
}

export default App;
