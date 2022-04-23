import {
  ACTION_CHANGE_HOMEWORK_SHOW_POPUP, ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS,
  ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE, ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM
} from '../types';

export function change_homework_show_popup_class(isShowClass) {
  return {
    type: ACTION_CHANGE_HOMEWORK_SHOW_POPUP, // )))
    payload: isShowClass
  }
}

export function change_homework_popup_warning_title_class(new_class) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS, // )))
    payload: new_class
  }
}

export function change_homework_warning_title(title) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE, // )))
    payload: title
  }
}

export function change_homework_popup_active_menu_item(new_active_item) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM, // )))
    payload: new_active_item
  }
}