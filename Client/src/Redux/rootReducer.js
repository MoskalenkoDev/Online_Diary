import {combineReducers} from 'redux'
import {registrationReducer} from './registrationReducer';
import {profileReducer} from './profileReducer';
import {homeworkReducer} from './homeworkReducer';
import {languageReducer} from './languageReducer';

export const rootReducer = combineReducers({
  registrationState: registrationReducer,
  profileState : profileReducer,
  homeworkState : homeworkReducer,
  languageState : languageReducer
})
