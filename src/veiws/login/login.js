import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { toastySuccess } from "../../consts/toasts";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { connectToSolana } from "../../redux/Solana/actions";
import Deso from "deso-protocol";

function Login(props) {
	const dispatch = useDispatch();
	const deso = new Deso();

	const solana = useSelector((state) => state.solana);
	const solanaKey = useSelector((state) => state.solana.key);
	const [publicKey, setPublic] = useState("");
	const navigate = useNavigate();

	async function login(requestLevel) {
		const request = requestLevel;
		const response = await deso.identity.login(request);
		setPublic(response.key);
	}

	async function logout(publicKey) {
		const request = publicKey;
		const response = await deso.identity.logout(request);
	}

	useEffect(() => {
		if (!solanaKey) {
			toastySuccess(
				"You are not connected to Solana click connect to proceed ",
			);
		} else {
			toastySuccess(`You are connected to Solana ${solanaKey}`);
		}
	}, [solanaKey]);

	useEffect(() => {
		if (publicKey) {
			setPublic(publicKey);
		} else if (deso.identity.getUserKey()) {
			setPublic(deso.identity.getUserKey());
			toastySuccess(
				"You already have an DeSo account " +
					"look at the footer for more details ",
			);
		} else {
			toastySuccess("You are not connected to DeSo click connect to proceed ");
		}
	}, [publicKey]);

	const handlePageChange = () => {
		navigate("/discover");
	};

	return (
		<div>
			<div id="heading-container">
				<p id="heading">
					Welcome to the <span id="text">Artsy</span>
				</p>

				<div id="button-container">
					<button
						onClick={(e) => {
							e.preventDefault();
							dispatch(connectToSolana());
							console.log(solanaKey);
						}}
						id="button">
						<p id="login-text">Login w/Solana</p>
					</button>
					<button
						id="button"
						onClick={async (e) => {
							e.preventDefault();
							await login(3);
						}}>
						<p id="login-text">Connect w/DeSo</p>
					</button>
				</div>
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
			<footer id="footer">
				{" "}
				{publicKey && (
					<div>
						Hello, you are logged in{" "}
						<Button onClick={handlePageChange}>click me</Button> to procceed{" "}
						<div style={{ margin: "10px", padding: "10px" }}>
							This is your DeSo publicKey <span id="text">{publicKey} </span>
							<br></br>
							<p>If this is not your account click on login again!</p>
						</div>
					</div>
				)}
			</footer>
		</div>
	);
}

export default Login;
