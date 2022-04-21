import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { toastySuccess, toastyFailure } from "../../consts/toasts";
import { connectToSolana } from "../../redux/Solana/actions";
import axios from "axios";

function MyformSolana(props) {
	const dispatch = useDispatch();
	const [link, setLink] = useState("");
	const [name, setname] = useState("");
	const [symbol, setsymbol] = useState("");
	const [desc, setdesc] = useState("");
	const solana = useSelector((state) => state.solana);
	const solanaKey = useSelector((state) => state.solana.key);

	function onChangeTextFeild(event, name) {
		switch (name) {
			case "name":
				setname(event.target.value);
				break;

			case "link":
				setLink(event.target.value);
				break;

			case "symbol":
				setsymbol(event.target.value);
				break;

			case "desc":
				setdesc(event.target.value);
				break;

			default:
				break;

			// setProjectName(event.target.value);
		}
	}

	const makeNftSolana = async () => {
		const res = await axios({
			method: "post",
			url: "http://localhost:3001/mint",
			data: {
				pubKey: solana.key,
				img: link,
				name,
				symbol,
				desc,
			},
		}).then((rest) => {
			console.log(rest);
		});
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Enter the link for your NFT"
				value={link}
				onChange={(e) => {
					onChangeTextFeild(e, "link");
				}}
			/>
			<input
				type="text"
				placeholder="Enter the symbol for your NFT"
				value={symbol}
				onChange={(e) => {
					onChangeTextFeild(e, "symbol");
				}}
			/>

			<input
				type="text"
				placeholder="Enter the name for your NFT"
				value={name}
				onChange={(e) => {
					onChangeTextFeild(e, "name");
				}}
			/>
			<input
				type="text"
				placeholder="Enter the description for your NFT"
				value={name}
				onChange={(e) => {
					onChangeTextFeild(e, "desc");
				}}
			/>
			<div>
				<button
					className="cta-button mint-button"
					onClick={(e) => {
						e.preventDefault();
						dispatch(connectToSolana());
					}}>
					Connect to Solana
				</button>
				<button
					className="cta-button mint-button"
					type="submit"
					style={{ marginRight: "10px" }}
					onClick={async (e) => {
						e.preventDefault();
						await makeNftSolana();

						toastySuccess("NFT Minted, check your wallet");
					}}>
					Submit NFT on Solana
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
		</div>
	);
}

export default MyformSolana;
