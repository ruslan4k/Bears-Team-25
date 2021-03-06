import * as ACTIONS from "./actionTypes";
import axios from "./axiosInstances"; // Pre configured axios instance

function change_password_on() {
  return {
    type: ACTIONS.CHANGING_PASS
  };
}

function change_password_success(json) {
  return {
    type: ACTIONS.CHANGING_PASS_SUCCESS
  };
}

function change_password_failure(error) {
  return {
    type: ACTIONS.CHANGING_PASS_FAILURE,
    error: error
  };
}

function change_password_success_snackbar() {
  return {
    type: ACTIONS.RENDER_SNACKBAR,
    styling: "success",
    text: "You've successfully changed password!"
  };
}

function change_password_failure_snackbar(error) {
  return {
    type: ACTIONS.RENDER_SNACKBAR,
    styling: "error",
    text: error
  };
}

export function successOff() {
  return {
    type: ACTIONS.SUCCESS_OFF
  };
}

export function change_password(values) {
  return function(dispatch) {
    // First dispatch: the app state is updated to inform
    dispatch(change_password_on());
    axios
      .post(
        "/users/change_password",
        {
          oldPassword: values.currentPassword,
          password: values.password2
        },
        { withCredentials: true }
      )
      .then(json => {
        dispatch(change_password_success());
        dispatch(change_password_success_snackbar());
      })
      .catch(error => {
        if (error.response) {
          error = error.response.data.status;
        } else {
          error = "Something wrong with server";
        }
        dispatch(change_password_failure(error));
        dispatch(change_password_failure_snackbar(error));
      });
  };
}
