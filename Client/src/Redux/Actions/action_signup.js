import {
    ACTION_CHANGE_IS_LOGGED
} from '../types';
  
export function change_is_logged(isLogged) {
    return {
    type: ACTION_CHANGE_IS_LOGGED,
    payload: isLogged
    }
}