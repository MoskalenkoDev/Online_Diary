import {
  ACTION_CHANGE_WHAT_CHECKED , ACTION_CHANGE_WHO_LOG , 
  ACTION_CHANGE_EMAIL , ACTION_CHANGE_PASSWORD ,
  ACTION_CHANGE_REDIRECT , ACTION_CHANGE_POPUP_TITLE ,
  ACTION_CHANGE_SHOW_POPUP} from './types';

const initialState = 
{
  what_checked : "login", // what is checked now
  whoLog : "student",
  email : "", 
  password: "",
  redirect : false, // if true, we go to the next page
  popupTitle : "" ,
  show_popup : false
};

let timer;

// Pure Functions
export const registrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_WHAT_CHECKED:
      return { ...state, what_checked: action.payload }
    case ACTION_CHANGE_WHO_LOG:
      return { ...state, whoLog: action.payload }
    case ACTION_CHANGE_EMAIL:
      return { ...state, email: action.payload }
    case ACTION_CHANGE_PASSWORD:
      return { ...state, password: action.payload }
    case ACTION_CHANGE_REDIRECT:
      return { ...state, redirect: action.payload }
    case ACTION_CHANGE_POPUP_TITLE: 
      return { ...state, popupTitle: action.payload }
    case ACTION_CHANGE_SHOW_POPUP:
      return { ...state, show_popup: action.payload }
    default: return state
  }
}
