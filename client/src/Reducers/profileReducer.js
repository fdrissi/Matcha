import { PHOTO_SUCCESS } from "../actions/actionTypes";

export const photoInitState = {
  profile_Image: "place-holder.png",
  first_Image: "place-holder.png",
  second_Image: "place-holder.png",
  third_Image: "place-holder.png",
  fourth_Image: "place-holder.png"
};

export const photoReducer = (state, action) => {
  const { type, paylod } = action;
  switch (type) {
    case PHOTO_SUCCESS:
      return {
        ...state,
        profile_Image: paylod.profile_Image,
        first_Image: paylod.first_Image,
        second_Image: paylod.second_Image,
        third_Image: paylod.third_Image,
        fourth_Image: paylod.fourth_Image
      };
    default:
      return state;
  }
};
