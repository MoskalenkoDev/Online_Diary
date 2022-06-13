import {combineReducers} from 'redux'
import {profileReducer} from './profileReducer';
import {homeworkReducer} from './homeworkReducer';
import {languageReducer} from './languageReducer';
import {signupReducer} from './signupReducer';
import { schoolMarksReducer } from './schoolMarksReducer';

export const rootReducer = combineReducers({
  profileState : profileReducer,
  homeworkState : homeworkReducer,
  languageState : languageReducer,
  signupState : signupReducer,
  schoolMarksState: schoolMarksReducer
})
