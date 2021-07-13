import {
  ACTION_CHANGE_LANGUAGE,ACTION_CHANGE_LANGUAGE_ACTIVE_CLASS,
  ACTION_CHANGE_LANGUAGE_FIRST_LABEL,ACTION_CHANGE_LANGUAGE_SECOND_LABEL,
} from '../types';

export function change_language(newLang) {
    return {
      type: ACTION_CHANGE_LANGUAGE,
      payload: newLang
    }
}

export function change_language_active_class(isActive) {
  return {
    type: ACTION_CHANGE_LANGUAGE_ACTIVE_CLASS,
    payload: isActive
  }
}

export function change_language_first_label(new_label) {
  return {
    type: ACTION_CHANGE_LANGUAGE_FIRST_LABEL,
    payload: new_label
  }
}

export function change_language_second_label(new_label) {
  return {
    type: ACTION_CHANGE_LANGUAGE_SECOND_LABEL,
    payload: new_label
  }
}