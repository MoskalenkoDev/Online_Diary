import {
    ACTION_CHANGE_IS_LOGGED,
    ACTION_CHANGE_IS_FILLED_PROFILE,
    ACTION_CHANGE_USER_TYPE
} from '../types';

export function change_is_logged(isLogged) {
    return {
        type: ACTION_CHANGE_IS_LOGGED,
        payload: isLogged
    }
}

export function change_is_filled_profile(isFilledProfile) {
    return {
        type: ACTION_CHANGE_IS_FILLED_PROFILE,
        payload: isFilledProfile
    }
}

export function change_user_type(userType) {
    return {
        type: ACTION_CHANGE_USER_TYPE,
        payload: userType
    }
}