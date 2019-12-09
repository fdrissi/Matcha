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
  console.log("test");
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
