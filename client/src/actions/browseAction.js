import axios from "axios";
import { BROWSER_RETURN, SORT_BY_BACK } from "./actionTypes";

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
  console.log(profile);
  switch (sort) {
    case "Location":
      profile.browser.result.sort((a, b) =>
        a.destination > b.destination
          ? 1
          : b.destination > a.destination
          ? -1
          : 0
      );
      break;
    case "Age":
      profile.browser.result.sort((a, b) =>
        a.user_birth > b.user_birth ? 1 : b.user_birth > a.user_birth ? -1 : 0
      );
      break;
    default:
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
    console.log(res.data.errorMsg);
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
