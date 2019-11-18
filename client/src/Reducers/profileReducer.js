import { PHOTO_SUCCESS } from "../actions/actionTypes";

export const photoInitState = {
  profile_Image: "",
  first_Image: "",
  second_Image: "",
  third_Image: "",
  fourth_Image: ""
};

export const photoReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case PHOTO_SUCCESS:
      return (
        state = payload
      );
    default:
      return state;
  }
};
