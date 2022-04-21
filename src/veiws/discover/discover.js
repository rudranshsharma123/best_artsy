import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../navbar/navbar";
import { connectToSolana } from "../../redux/Solana/actions";
import { toastySuccess, toastyFailure } from "../../consts/toasts";
import "./styles.css";
import { Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import TPin from "./testingpin";
import axios from "axios";
import Deso from "deso-protocol";

function Discover(props) {
	const dispatch = useDispatch();

	const deso = new Deso();
	const solana = useSelector((state) => state.solana);
	const [publicKey, setPublicKey] = useState("");

	const solanaKey = useSelector((state) => state.solana.key);
	const [solanaImages, setSolanaImages] = useState([]);
	const [images, setImages] = useState([{}]);

	const [isSol, setIsSol] = useState(false);

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
			const key = deso.identity.getUserKey();
			setPublicKey(key);
			// login(3);
		}
	}, []);

	useEffect(() => {
		if (isSol) {
			if (solanaKey == "" || solanaKey == null) {
				toastySuccess("Connecting to Solana for you");
				dispatch(connectToSolana());
				console.log(solana);
				toastyFailure(
					"If you dont see a success message check your phantom wallet",
				);
			} else {
				toastySuccess(`We are now live on Solana! ${solana.key}`);
				if (solanaImages.length <= 1) {
					getNFTSol(solana.key);
				}
			}
		}
	}, [isSol, solanaKey]);
	const changeChains = () => {
		setIsSol(!isSol);
	};
	// console.log(deso);
	const getNfts = async (user) => {
		const request = {
			UserPublicKeyBase58Check: user,
		};
		const nfts = await deso.nft.getNftsForUser(request);
		const keys = Object.keys(nfts.data.NFTsMap);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const nft = nfts.data.NFTsMap[key];
			const postBody = nft.PostEntryResponse.Body;
			const PostHashHex = nft.PostEntryResponse.PostHashHex;
			const link = `https://diamondapp.com/posts/${PostHashHex}`;
			const postImage = nft.PostEntryResponse.ImageURLs;
			const poster = nft.PostEntryResponse.ProfileEntryResponse.Username;
			let actualImage = "";
			if (postImage) {
				actualImage = postImage[0];
			}
			console.log(nft, postBody, postImage);
			setImages((prev) => {
				return [
					...prev,
					{
						name: poster,
						title: postBody,
						url: actualImage,
						created_at: "2022-02-20T23:30:01.000Z",
						dialink: link,
					},
				];
			});
		}
		console.log(images);
	};

	const getNFTSol = async (user) => {
		const url = "http://localhost:3001/nft";
		const res = await axios({
			method: "post",
			url,
			data: {
				pubKey: user,
			},

			headers: {
				"Access-Control-Allow-Credentials": true,
			},
		}).then((res) => {
			return res.data;
		});
		console.log(res);
		for (let i in res) {
			const name = res[i]["data"]["name"];
			const url = res[i]["data"]["uri"];
			const sym = res[i]["data"]["symbol"];
			const x = await axios.get(url);

			setSolanaImages((prev) => {
				return [
					...prev,
					{
						name: name,
						title: sym,
						url: x["data"]["image"],
						created_at: "2022-02-20T23:30:01.000Z",
					},
				];
			});
		}
	};

	const test = () => {
		console.log(images);
	};

	useEffect(() => {
		if (publicKey != null && images.length === 1) {
			console.log(publicKey);
			getNfts(publicKey);
		}
	}, [publicKey]);
	const arr = ["small", "medium", "large"];
	return (
		<>
			<Navbar />
			<div>
				<Button
					id="button"
					onClick={changeChains}
					style={{ marginLeft: "100px" }}>
					Change Chains {isSol ? "Switch To DeSo" : "Switch to Solana"}
				</Button>
			</div>

			<div className="mainContainer">
				{!isSol &&
					images &&
					images.map((data, key) => (
						<TPin
							key={data.id}
							pinSize={arr[key % 3]}
							imgSrc={data.url}
							name={data.title}
							link={data.dialink}
						/>
					))}
			</div>
			<div className="mainContainer">
				{isSol &&
					solanaImages &&
					solanaImages.map(
						(data, key) => (
							console.log(data),
							(
								<TPin
									key={data.id}
									pinSize={arr[key % 3]}
									imgSrc={data.url}
									name={data.name}
									link={data}
								/>
							)
						),
					)}
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
			<iframe
				title="desoidentity"
				id="identity"
				frameBorder="0"
				src="https://identity.deso.org/embed?v=2"
				style={{
					height: "100vh",
					width: "100vw",
					display: "none",
					position: "fixed",
					zIndex: 1000,
					left: 0,
					top: 0,
				}}></iframe>
		</>
	);
}

export default Discover;
