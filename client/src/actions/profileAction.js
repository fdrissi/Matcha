import axios from "axios";
import { PHOTO_SUCCESS, SET_ALERT } from "./actionTypes";

export const setImage = async (formData, row, dispatch) => {
  const config = {
    header: {
      "content-type": "multipart/form-data"
    }
  };
  console.log(formData);
  try {
    const res = await axios.post(`api/profile/upload/${row}`, formData, config);
    if (res.data.success) {
      console.log(res);
      alert("The file is successfully uploaded");
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};
