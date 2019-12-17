import axios from "axios";
import { BROWSER_RETURN, SORT_BY_BACK, SET_ALERT } from "./actionTypes";

export const getBrowse = async dispatch => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  const res = await axios.get(`api/browse/getBrowse`, config);
  dispatch({
    type: BROWSER_RETURN,
    payload: res.data.data
  });
  dispatch({
    type: SORT_BY_BACK,
    payload: res.data.sort_by
  });
};

export const sortProfiles = async (profile, dispatch, sort) => {
  dispatch({
    type: SORT_BY_BACK,
    payload: sort.sort_by
  });
  switch (sort.sort_by) {
    case "Fame rating":
      profile.sort((a, b) =>
        a.fame_rate < b.fame_rate
          ? 1
          : b.fame_rate < a.fame_rate
          ? -1
          : a.common_tags > b.common_tags
          ? -1
          : 1
      );
      break;
    case "Age":
      profile.sort((a, b) =>
        a.user_birth > b.user_birth
          ? 1
          : b.user_birth > a.user_birth
          ? -1
          : a.common_tags > b.common_tags
          ? -1
          : 1
      );
      break;
    default:
      profile.sort((a, b) =>
        a.destination > b.destination
          ? 1
          : b.destination > a.destination
          ? -1
          : a.common_tags > b.common_tags
          ? -1
          : 1
      );
  }
};

export const filterBrowser = async (filter, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  const res = await axios.get(
    `api/browse/getFilter`,
    {
      params: {
        filter: filter
      }
    },
    config
  );
  if (!res.data.success) {
    dispatch({
      type: SET_ALERT,
      payload: {
        alertType: "danger",
        msg: res.data.errorMsg
      }
    });
  } else {
    dispatch({
      type: BROWSER_RETURN,
      payload: res.data.data
    });
    dispatch({
      type: SORT_BY_BACK,
      payload: res.data.sort_by
    });
  }
};

export const getSearch = async (filter, dispatch) => {
  //console.log(filter);
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  const res = await axios.get(
    `api/browse/getSearch`,
    {
      params: {
        filter: filter
      }
    },
    config
  );
  if (!res.data.success) {
    dispatch({
      type: SET_ALERT,
      payload: {
        alertType: "danger",
        msg: res.data.errorMsg
      }
    });
  } else {
    dispatch({
      type: BROWSER_RETURN,
      payload: res.data.data
    });
    dispatch({
      type: SORT_BY_BACK,
      payload: res.data.sort_by
    });
  }
};
