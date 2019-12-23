import axios from "axios";
import {
  PROFILE_MATCHED,
  PHOTO_SUCCESS,
  SET_ALERT,
  INFO_SUCCESS,
  FAILIED_UPDATE_USER,
  REMOVE_ERRORS,
  PROFILE_BLOCKED,
  PROFILE_LIKED,
  PROFILE_IS_VERIFIED
} from "./actionTypes";

export const setUserImages = async (formData, row, dispatch) => {
  const config = {
    header: {
      "Content-Type": "multipart/form-data"
    }
  };
  try {
    const res = await axios.post(
      `/api/profile/upload/${row}`,
      formData,
      config
    );
    const respond = await axios.get("/api/profile/checkIsVerified");
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
    dispatch({
      type: PROFILE_IS_VERIFIED,
      payload: respond.data.isVerified
    });
  } catch (error) {
    return false;
  }
};

export const setUserCover = async (filed, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post("/api/profile/setCover", {
      data: { filed: filed },
      config
    });
    const respond = await axios.get("/api/profile/checkIsVerified");
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
    dispatch({
      type: PROFILE_IS_VERIFIED,
      payload: respond.data.isVerified
    });
  } catch (error) {
    return false;
  }
};

export const getUserImages = async (dispatch, id = null) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.get(
      "/api/profile/getImage",
      { params: { id } },
      config
    );
    if (res.data.success) {
      dispatch({
        type: PHOTO_SUCCESS,
        payload: res.data.result
      });
    } else {
    }
  } catch (error) {
    return false;
  }
};

export const removeUserImage = async (photo, filed, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.delete(
      "/api/profile/removeImage",
      { data: { filed: filed, photo: photo } },
      config
    );
    const respond = await axios.get("/api/profile/checkIsVerified");
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
    dispatch({
      type: PROFILE_IS_VERIFIED,
      payload: respond.data.isVerified
    });
  } catch (error) {
    return false;
  }
};

export const getUserInfo = async (dispatch, id = null) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.get(
      "/api/profile/getUserInfo",
      { params: { id } },
      config
    );
    if (res.data.success) {
      dispatch({
        type: INFO_SUCCESS,
        payload: res.data.info
      });
    }
  } catch (error) {
    return false;
  }
};

export const updateUserInfo = async (mydata, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      "/api/profile/updateUserInfo",
      {
        data: mydata
      },
      config
    );
    const respond = await axios.get("/api/profile/checkIsVerified");
    if (res.data.success) {
      dispatch({
        type: SET_ALERT,
        payload: {
          alertType: "success",
          msg: res.data.errorMsg
        }
      });
      dispatch({
        type: INFO_SUCCESS,
        payload: res.data.my_info
      });
      dispatch({
        type: REMOVE_ERRORS
      });
    } else {
      dispatch({
        type: FAILIED_UPDATE_USER,
        payload: res.data
      });
      dispatch({
        type: SET_ALERT,
        payload: {
          alertType: "danger",
          msg: res.data.errorMsg
        }
      });
    }
    dispatch({
      type: PROFILE_IS_VERIFIED,
      payload: respond.data.isVerified
    });
  } catch (error) {
    return false;
  }
};

export const setUserLocation = async (latitude, longitude, error, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  await axios.post(
    "/api/profile/setUserLocation",
    { data: { latitude, longitude, error } },
    config
  );
  const respond = await axios.get("/api/profile/checkIsVerified");
  if (respond.data.success) {
    dispatch({
      type: PROFILE_IS_VERIFIED,
      payload: respond.data.isVerified
    });
  }
};

export const getpreedefined = async () => {
  const res = await axios.get("/api/profile/getpreedefined");
  if (res.data.success) {
    return res.data.predefined;
  }
};

export const likeProfile = async (profileId, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const result = await axios.post(
      "/api/profile/userLikeProfile",
      {
        profile: { id: profileId }
      },
      config
    );
    await isUserLikedProfile(profileId, dispatch);
    await areMatched(profileId, dispatch);
    return result;
  } catch (error) {
    return false;
  }
};

export const areMatched = async (profileId, dispatch) => {
  try {
    const result = await axios.get(`/api/profile/areMatched/${profileId}`);
    dispatch({
      type: PROFILE_MATCHED,
      payload: result.data.success
    });
    return result;
  } catch (error) {
    return false;
  }
};

export const isUserLikedProfile = async (profileId, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      "/api/profile/isUserLikedProfile",
      {
        profile: { id: profileId }
      },
      config
    );
    dispatch({
      type: PROFILE_LIKED,
      payload: res.data.success
    });
  } catch (error) {
    return false;
  }
};

export const blockProfile = async (profileId, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    await axios.post(
      "/api/profile/userBlockProfile",
      {
        profile: { id: profileId }
      },
      config
    );
    await isProfileBlocked(profileId, dispatch);
  } catch (error) {
    return false;
  }
};

export const isProfileBlocked = async (profileId, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      "/api/profile/isUserBlockedProfile",
      {
        profile: { id: profileId }
      },
      config
    );

    dispatch({
      type: PROFILE_BLOCKED,
      payload: res.data.success
    });
  } catch (error) {
    return false;
  }
};

export const reportProfile = async profileId => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      "/api/profile/reportProfile",
      {
        profile: { id: profileId }
      },
      config
    );
    return res.data.success;
  } catch (error) {
    return false;
  }
};

export const recordVisitedProfiles = async profileId => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      "/api/profile/recordVisitedProfiles",
      {
        profile: { id: profileId }
      },
      config
    );
    return res.data.success;
  } catch (error) {
    return false;
  }
};
