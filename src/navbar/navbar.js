import React, { useEffect } from "react";
import "./styles.css";
import Deso from "deso-protocol";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function Navbar({ isHome }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const deso = new Deso();
	var publicKey = "";

	async function login(requestLevel) {
		const request = requestLevel;
		const response = await deso.identity.login(request);
	}

	async function logout(publicKey) {
		const request = publicKey;
		const response = await deso.identity.logout(request);
	}

	useEffect(() => {
		if (publicKey === "" || publicKey === null) {
			login(3);
		}
	}, []);

	const handlePageChange = () => {
		if (isHome) {
			navigate("/");
			return;
		}
		navigate("/user");
	};

	const handleLogout = () => {
		navigate("/gen");
	};
	const handleChange = () => {
		navigate("/discover");
	};
	return (
		<nav id="nav">
			<div id="nav-links">Artsy</div>

			<div>
				<Button
					variant="none"
					style={{ color: "white", fontSize: "30px" }}
					onClick={handlePageChange}>
					{isHome ? "Home" : "Profile"}
				</Button>
				<Button
					variant="none"
					style={{ color: "white", fontSize: "30px" }}
					onClick={handleLogout}>
					ArtGen
				</Button>
				<Button
					variant="none"
					style={{ color: "white", fontSize: "30px" }}
					onClick={handleChange}>
					Discover
				</Button>
			</div>
		</nav>
	);
}

export default Navbar;
