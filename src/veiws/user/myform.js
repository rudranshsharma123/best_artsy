import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { toastySuccess } from "../../consts/toasts";
import Deso from "deso-protocol";
import axios from "axios";
function Myform(props) {
	const dispatch = useDispatch();
	const deso = new Deso();

	const [link, setLink] = useState("");
	const [body, setBody] = useState("");
	const [sellPrice, setSellPrice] = useState(0);
	const [isForSale, setIsForSale] = useState("");
	const [amountToBeSold, setAmountToBeSold] = useState(0);
	const [publicKey, setPublic] = useState("");
	const [PostHashHex, setPostHashHex] = useState("");

	const createPostForNft = async () => {
		const request = {
			UpdaterPublicKeyBase58Check: publicKey,
			BodyObj: {
				Body: body,
				VideoURLs: [],
				ImageURLs: [link],
			},
		};

		const res = await deso.posts.submitPost(request);
		setPostHashHex(res.PostHashHex);
	};
	function timeout(delay) {
		return new Promise((res) => setTimeout(res, delay));
	}
	const makePostNft = async () => {
		const DEFAULT_NODE_URL = "https://api.desodev.com/api";
		const path = "/v0/get-posts-for-public-key";
		const data = {
			PublicKeyBase58Check: publicKey,
			ReaderPublicKeyBase58Check: "",
			NumToFetch: 20,
			MediaRequired: false,
		};

		await timeout(5000);
		const lastPostHex = await axios
			.post(DEFAULT_NODE_URL + path, data)
			.then((res) => {
				return res.data.Posts[0].PostHashHex;
			});
		// await setTimeout(() => {}, 30000);
		console.log(lastPostHex);

		const request = {
			UpdaterPublicKeyBase58Check: publicKey,
			NFTPostHashHex: lastPostHex,
			NumCopies: 1,
			NFTRoyaltyToCreatorBasisPoints: 0,
			NFTRoyaltyToCoinBasisPoints: 0,
			HasUnlockable: false,
			IsForSale: true,
			MinFeeRateNanosPerKB: 1000,
		};

		const response = await deso.nft.createNft(request);
		console.log(response);
	};
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
		if (publicKey === "" || publicKey === null) {
			const key = deso.identity.getUserKey();
			setPublic(key);
		}
	}, []);
	function onChangeTextFeild(event, name) {
		switch (name) {
			case "body":
				setBody(event.target.value);
				break;
			case "number":
				setAmountToBeSold(event.target.value);
				break;

			case "link":
				setLink(event.target.value);
				break;

			case "sellPrice":
				setSellPrice(event.target.value);
				break;

			case "isForSale":
				setIsForSale(event.target.value);
				break;

			default:
				break;

			// setProjectName(event.target.value);
		}
	}

	const switchI = () => {
		setIsForSale(!isForSale);
		console.log(isForSale);
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
				type="number"
				placeholder="Enter the price for your NFT"
				value={sellPrice}
				onChange={(e) => {
					onChangeTextFeild(e, "sellPrice");
				}}
			/>

			<input
				type="text"
				placeholder="Enter the body for your NFT"
				value={body}
				onChange={(e) => {
					onChangeTextFeild(e, "body");
				}}
			/>
			<input
				type="text"
				placeholder="Is your NFT for sale?"
				value={isForSale}
				onChange={(e) => {
					onChangeTextFeild(e, "isForSale");
				}}
			/>
			<input
				type="text"
				placeholder="How many NFT would you want to sell?"
				value={amountToBeSold}
				onChange={(e) => {
					onChangeTextFeild(e, "number");
				}}
			/>

			<div>
				<button
					className="cta-button mint-button"
					onClick={async (e) => {
						e.preventDefault();
						toastySuccess("Your NFTs are being created");
						await createPostForNft();
						await makePostNft();
						toastySuccess("NFTs are now for sale");
						setBody("");
						setAmountToBeSold("");
						setLink("");
						setSellPrice("");
					}}>
					Submit your profile on chain!
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

		// <Button
		// 	variant="primary"
		// 	onClick={async (e) => {
		// 		e.preventDefault();
		// 		toastySuccess("Your NFTs are being created");
		// 		await createPostForNft();
		// 		await makePostNft();
		// 		toastySuccess("NFTs are now for sale");
		// 		setBody("");
		// 		setAmountToBeSold("");
		// 		setLink("");
		// 		setSellPrice("");
		// 	}}>
		// 	Submit
		// </Button>{" "}
	);
}

export default Myform;
