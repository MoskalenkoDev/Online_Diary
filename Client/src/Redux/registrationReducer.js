import {
  ACTION_CHANGE_WHAT_CHECKED , ACTION_CHANGE_WHO_LOG , 
  ACTION_CHANGE_LOGIN , ACTION_CHANGE_PASSWORD ,
  ACTION_CHANGE_REDIRECT , ACTION_CHANGE_POPUP_TITLE ,
  ACTION_CHANGE_SHOW_POPUP} from './types';

const initialState = 
{
  what_checked : "login", // what is checked now
  whoLog : "student",
  login : "", 
  password: "",
  redirect : false, // if true, we go to the next page
  popupTitle : "" ,// idk why i added this shit here
  show_popup : false
};

// Pure Functions
export const registrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_WHAT_CHECKED:
      return { ...state, what_checked: action.payload }
    case ACTION_CHANGE_WHO_LOG:
      return { ...state, whoLog: action.payload }
    case ACTION_CHANGE_LOGIN:
      return { ...state, login: action.payload }
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
