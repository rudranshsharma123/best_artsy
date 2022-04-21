import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "../../navbar/navbar";
import "./styles.css";
import Myform from "./myform";
import MyformSolana from "./myFormSolana";
import Deso from "deso-protocol";

function User(props) {
	const dispatch = useDispatch();
	const deso = new Deso();
	const [images, setImages] = useState([]);
	const [onlyImages, setOnlyImages] = useState([]);
	const [body, setBody] = useState("");
	const [loaded, setLoaded] = useState(false);
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
			const publicKey = deso.identity.getUserKey();
			setPublicKey(publicKey);
		}
	}, []);
	// useEffect(() => {
	// 	if (!publicKey) {
	// 	} else {
	// 		getNfts(publicKey);
	// 	}
	// }, [publicKey]);

	const getNfts = async (user) => {
		const nfts = await deso.nft.getNftsForUser(user);
		console.log(nfts);
		const keys = Object.keys(nfts.NFTsMap);
		console.log(keys);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const nft = nfts.NFTsMap[key];
			const postBody = nft.PostEntryResponse.Body;
			// console.log(postBody);
			const postImage = nft.PostEntryResponse.ImageURLs;
			const poster = nft.PostEntryResponse.ProfileEntryResponse.Username;
			let actualImage = "";
			if (postImage) {
				actualImage = postImage[0];
			}
			console.log(nft, postBody, postImage);
			setOnlyImages((prev) => [...prev, actualImage]);
			setBody(postBody);
			setLoaded(true);
			setImages((prev) => {
				return [
					...prev,
					{
						name: poster,
						title: postBody,
						url: actualImage,
						created_at: "2022-02-20T23:30:01.000Z",
					},
				];
			});
		}
		console.log(images);
	};

	return (
		<div>
			<Navbar isHome={true} />
			<div className="test">
				{" "}
				<div className="form-container">
					<p className="text">Upload more Nfts</p>
					<Myform />
				</div>
				<div className="form-container">
					<p className="text">Upload more Nfts</p>
					<MyformSolana />
				</div>
			</div>
		</div>
	);
}

export default User;
