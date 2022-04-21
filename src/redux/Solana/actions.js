import { SolActionTypes } from "./solanaActionTypes";

const connectionRequest = () => {
	return {
		type: SolActionTypes.LOGIN_REQUEST,
	};
};

const connectionSuccess = (payload) => {
	return {
		type: SolActionTypes.LOGIN_SUCCESS,
		payload,
	};
};
const connectionFailure = (payload) => {
	return {
		type: SolActionTypes.LOGIN_FAILURE,
		payload,
	};
};
const updateAccount = (payload) => {
	return {
		type: SolActionTypes.UPDATE_ACCOUNT,
		payload,
	};
};

export const connectToSolana = () => {
	return async (dispatch) => {
		dispatch(connectionRequest());
		const { solana } = window;
		if (solana && solana.isPhantom) {
			console.log("Phanton is found and everything is a ok");
			// const res1 = await solana.request({ method: "connect" });
			const res1 = await solana.connect();
			console.log("Conected with Public Key", res1.publicKey.toString());
			dispatch(connectionSuccess({ key: res1.publicKey.toString(), solana }));
		}
	};
};
