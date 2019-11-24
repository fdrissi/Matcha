import { PHOTO_SUCCESS } from "../actions/actionTypes";
import { INFO_SUCCESS } from "../actions/actionTypes";

export const profileInitState = {
  photo: {
    profile_Image: "",
    cover_Image: "",
    first_Image: "",
    second_Image: "",
    third_Image: "",
    fourth_Image: ""
  },
  info: {
    user_gender: "",
    user_relationship: "",
    user_birth_day: "",
    user_birth_month: "",
    user_gender_interest: "",
    user_birth_year: "",
    user_tags: "",
    user_city: "",
    user_current_occupancy: "",
    user_biography: "",
    user_location: {
      lat: "",
      lng: ""
    }
  }
};

export const profileReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case PHOTO_SUCCESS:
      return { ...state, photo: payload };
    case INFO_SUCCESS:
      return { ...state, info: payload };
    default:
      return state;
  }
};
