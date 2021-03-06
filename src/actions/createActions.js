//contains action-creators for create-applet

import * as ACTIONS from "./actionTypes";
import axios from "./axiosInstances"; // Pre configured axios instance

export function addApplet(appletData) {
	return dispatch => {
		axios
			.post("/applets", appletData,{ withCredentials: true })
			.then(r => {
				dispatch({
					type: ACTIONS.CREATE_APPLET,
					payload: appletData
				});
			})
			.catch(err => {
				console.log(err);
				dispatch({
					type: ACTIONS.CREATE_APPLET + "_REJECTED",
					payload: err.response // We are using "err.reponse" to get error response text from server. If we just used "err" onely then we get axios manipulated error.
				});
			});
	};
}
