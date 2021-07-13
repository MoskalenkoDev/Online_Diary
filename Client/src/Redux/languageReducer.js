import {
  ACTION_CHANGE_LANGUAGE,ACTION_CHANGE_LANGUAGE_ACTIVE_CLASS,
  ACTION_CHANGE_LANGUAGE_FIRST_LABEL,ACTION_CHANGE_LANGUAGE_SECOND_LABEL,
} from './types';

const initialState = 
{
  language : window.localStorage.getItem("language"), // what is checked now
  activeClass : "",
  firstLabel: "",
  secondLabel: "",
};

if(!initialState.language) initialState.language = "ua";

// Pure Functions
export const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_LANGUAGE:
      {
        window.localStorage.setItem("language",action.payload);
        return { ...state, language: action.payload }
      }
    case ACTION_CHANGE_LANGUAGE_ACTIVE_CLASS:
      return {...state,activeClass: action.payload}
    case ACTION_CHANGE_LANGUAGE_FIRST_LABEL:
      return {...state, firstLabel: action.payload}
    case ACTION_CHANGE_LANGUAGE_SECOND_LABEL:
      return {...state, secondLabel: action.payload}
    default: return state
  }
}
