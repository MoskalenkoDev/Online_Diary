import {
  ACTION_CHANGE_HOMEWORK_SHOW_POPUP, ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS,
  ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE, ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM,
  ACTION_CHANGE_HOMEWORK_CLASSES_LI_LIST, ACTION_CHANGE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST,
  ACTION_DELETE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST_ITEM
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

export function change_homework_classes_li_list(new_list) {
  return {
    type: ACTION_CHANGE_HOMEWORK_CLASSES_LI_LIST, // )))
    payload: new_list
  }
}

export function change_homework_requests_to_teachers_li_list(new_list) {
  return {
    type: ACTION_CHANGE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST, // )))
    payload: new_list
  }
}

export function delete_homework_requests_to_teachers_li_list_item(class_id) {
  return {
    type: ACTION_DELETE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST_ITEM, // )))
    payload: class_id
  }
}