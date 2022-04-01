import {
  ACTION_CHANGE_IS_LOGGED
} from './types';

const initialState = {
  isLogged : false
};

let userType = localStorage.getItem("userType");
let token = localStorage.getItem("token");

if(userType && token) initialState.isLogged = true;

// Pure Functions
export const signupReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_IS_LOGGED:
      return {...state, isLogged: action.payload}
    default: return state
  }
}
