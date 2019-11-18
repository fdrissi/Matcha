import axios from "axios";
import { PHOTO_SUCCESS, SET_ALERT } from "./actionTypes";

export const setImage = async (formData, row, dispatch) => {
  const config = {
    header: {
      "content-type": "multipart/form-data"
    }
  };
  console.log("test");
  try {
    const res = await axios.post(`api/profile/upload/${row}`, formData, config);
    if (res.data.success) {
      dispatch({
        type: PHOTO_SUCCESS,
        payload: res.data.result
      });
      dispatch({
        type: SET_ALERT,
        payload: {
          alertType: "success",
          msg: res.data.errorMsg
        }
      });
    } else {
      dispatch({
        type: SET_ALERT,
        payload: {
          alertType: "danger",
          msg: res.data.errorMsg
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const setCover = async (filed, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post("api/profile/setCover", {
      data: { filed: filed },
      config
    });
    if (res.data.success) {
      dispatch({
        type: SET_ALERT,
        payload: {
          alertType: "success",
          msg: res.data.errorMsg
        }
      });
    } else {
      dispatch({
        type: SET_ALERT,
        payload: {
          alertType: "danger",
          msg: res.data.errorMsg
        }
      });
    }
  } catch (error) {}
};

export const getImage = async dispatch => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.get("api/profile/getImage", config);
    if (res.data.success) {
      dispatch({
        type: PHOTO_SUCCESS,
        payload: res.data.result
      });
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeImage = async (photo, filed, dispatch) => {
  const config = {
    header: {
      "Conetne-Type": "application/json"
    }
  };
  try {
    const res = await axios.delete(
      "api/profile/removeImage",
      { data: { filed: filed, photo: photo } },
      config
    );
    if (!res.data.success)
      dispatch({
        type: SET_ALERT,
        payload: {
          alertType: "danger",
          msg: res.data.errorMsg
        }
      });
    else {
      dispatch({
        type: SET_ALERT,
        payload: {
          alertType: "success",
          msg: res.data.errorMsg
        }
      });
      dispatch({
        type: PHOTO_SUCCESS,
        payload: res.data.result
      });
    }
  } catch (error) {}
};
