import React, { useEffect, useState } from "react";
import "./styles.css";
import Deso from "deso-protocol";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toastySuccess } from "../consts/toasts";
import { ToastContainer } from "react-toastify";

function Navbar({ isHome }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const deso = new Deso();
	const [publicKey, setPublicKey] = useState("");

	async function login(requestLevel) {
		const request = requestLevel;
		const response = await deso.identity.login(request);
		setPublicKey(response.key);
	}

	async function logout(publicKey) {
		const request = publicKey;
		const response = await deso.identity.logout(request);
	}

	useEffect(() => {
		if (publicKey === "" || publicKey === null) {
			if (deso.identity.getUserKey() === null) {
				toastySuccess("You are not connected to DeSo go and log in ");
			} else {
				const key = deso.identity.getUserKey();
				setPublicKey(key);
			}
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
	const handleEns = () => {
		navigate("/ens");
	};
	return (
		<nav id="nav">
			<div id="nav-links">Artsy</div>

			<div>
				<button
					className="cta-button mint-button"
					variant="none"
					style={{ color: "white", fontSize: "30px" }}
					onClick={handlePageChange}>
					{isHome ? "Home" : "Profile"}
				</button>
				<button
					className="cta-button mint-button"
					variant="none"
					style={{ color: "white", fontSize: "30px" }}
					onClick={handleLogout}>
					ArtGen
				</button>
				<button
					className="cta-button mint-button"
					variant="none"
					style={{ color: "white", fontSize: "30px" }}
					onClick={handleChange}>
					Discover
				</button>
				<button
					className="cta-button mint-button"
					variant="none"
					style={{ color: "white", fontSize: "30px" }}
					onClick={handleEns}>
					ENS
				</button>
			</div>

			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</nav>
	);
}

export default Navbar;
