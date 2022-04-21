import React from "react";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "../../navbar/navbar";
import "./styles.css";
import Deso from "deso-protocol";

function MyCarousel() {
	const dispatch = useDispatch();
	const deso = new Deso();

	const [publicKey, setPublicKey] = useState("");
	const [images, setImages] = useState([]);
	const [onlyImages, setOnlyImages] = useState([]);
	const [body, setBody] = useState("");
	const [loaded, setLoaded] = useState(false);

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
	useEffect(() => {
		if (publicKey) {
		} else {
			getNfts(publicKey);
		}
	}, [publicKey]);

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
			// console.log(nft, postBody, postImage);
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
	useEffect(() => {
		if (!publicKey) {
		} else {
			getNfts(publicKey);
		}
	}, [publicKey]);

	return (
		<Carousel fade>
			{images.map((image) => {
				// console.log(image);
				return (
					<Carousel.Item>
						<img className="d-block w-100" src={image.url} />
						<Carousel.Caption>
							<h3>{image.name}</h3>
							<p>{image.title}</p>
						</Carousel.Caption>
					</Carousel.Item>
				);
			})}
		</Carousel>
	);
}

export default MyCarousel;
