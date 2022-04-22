import jwtDecode from 'jwt-decode';
import {
  ACTION_CHANGE_IS_LOGGED,
  ACTION_CHANGE_IS_FILLED_PROFILE,
  ACTION_CHANGE_USER_TYPE
} from './types';

const initialState = {
  isLogged : false,
  userType : "",
  isFilledProfile: false
};

let token = localStorage.getItem("token");
if(token) {
  initialState.isLogged = true;
  let decodedInfo = jwtDecode(token);
  initialState.userType = decodedInfo.userType;
  initialState.isFilledProfile = decodedInfo.isFilledProfile;
  console.log("Hello from signupReducer");
} 

// Pure Functions
export const signupReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_IS_LOGGED:
      return {...state, isLogged: action.payload}
    case ACTION_CHANGE_USER_TYPE:
      return {...state, userType : action.payload}
    case ACTION_CHANGE_IS_FILLED_PROFILE: 
      return {...state, isFilledProfile : action.payload}
    default: return state
  }
}
