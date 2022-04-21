import axios from "axios";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Buffer } from "buffer";
import { toastySuccess } from "../../consts/toasts";
import "./styles.css";

function DifForm(props) {
	const [email, setEmail] = useState("");
	const [prompt, setPrompt] = useState("");
	const [style, setStyle] = useState("");
	const [image, setImage] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	function onChangeTextFeild(event, name) {
		switch (name) {
			case "email":
				setEmail(event.target.value);
				break;
			case "prompt":
				setPrompt(event.target.value);
				break;

			case "style":
				setStyle(event.target.value);
				break;

			default:
				break;
		}
	}

	const makeArt = async () => {
		const res = await axios({
			method: "post",
			url: "http://8208-35-196-0-137.ngrok.io/generate",
			responseType: "arraybuffer",
			data: {
				iterations: 10,
				prompts: prompt,
				style: style,
			},
		}).then((res) => {
			console.log(res);
			const blob = new Blob([res.data]);
			const url = URL.createObjectURL(blob);
			const base64String = Buffer(res.data).toString("base64");
			console.log(base64String);
			console.log(url);
			return { url, base64String };
		});
		setImage(res.url);
		const formData = new FormData();
		formData.append("key", "30ceb57534a7fb760bb72e9b638a5d67");

		formData.append("image", res.base64String);
		console.log(formData);
		let body = { key: "30ceb57534a7fb760bb72e9b638a5d67", image: res };

		const res2 = await axios({
			method: "post",
			url: "https://api.imgbb.com/1/upload",
			withCredentials: false,
			data: formData,
		}).then((res) => {
			return res.data.data.url;
		});
		setImageUrl(res2);
		toastySuccess(
			"Your Image url is " + res2 + "use it to mint your NFT if you like",
		);
	};

	return (
		<div className="main-container">
			<div className="form-container">
				<input
					type="text"
					placeholder="Enter Your Email to get your art"
					value={email}
					onChange={(e) => {
						onChangeTextFeild(e, "email");
					}}
				/>
				<input
					type="text"
					placeholder="Enter the prompt for the art"
					value={prompt}
					onChange={(e) => {
						onChangeTextFeild(e, "prompt");
					}}
				/>

				<input
					type="text"
					placeholder="Enter what kind of art you want to see"
					value={style}
					onChange={(e) => {
						onChangeTextFeild(e, "style");
					}}
				/>

				<div>
					<button
						className="cta-button mint-button"
						onClick={async (e) => {
							e.preventDefault();
							makeArt();
						}}>
						Make Art!
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
				<img src={image} style={{ width: "100%" }} className="img" />
			</div>
		</div>
	);
}

export default DifForm;
