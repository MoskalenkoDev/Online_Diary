import {
  ACTION_CHANGE_HOMEWORK_SHOW_POPUP, ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS,
  ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE, ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM,
  ACTION_CHANGE_HOMEWORK_CLASSES_LI_LIST, ACTION_CHANGE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST,
  ACTION_DELETE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST_ITEM, ACTION_CHANGE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST,
  ACTION_DELETE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST_ITEM, ACTION_CHANGE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST,
  ACTION_DELETE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST_ITEM, ACTION_CHANGE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST,
  ACTION_DELETE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST_ITEM, ACTION_CLEANUP_HOMEWORK_LI_LIST, ACTION_CLEAN_HOMEWORK_TEACHERS_LI_LISTS
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

export function change_homework_student_requests_to_join_li_list(new_list) {
  return {
    type: ACTION_CHANGE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST, // )))
    payload: new_list
  }
}

export function delete_homework_student_requests_to_join_li_list_item(student_id) {
  return {
    type: ACTION_DELETE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST_ITEM, // )))
    payload: student_id
  }
}

export function change_homework_students_in_class_li_list(new_list) {
  return {
    type: ACTION_CHANGE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST, // )))
    payload: new_list
  }
}

export function delete_homework_students_in_class_li_list_item(student_id) {
  return {
    type: ACTION_DELETE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST_ITEM, // )))
    payload: student_id
  }
}

export function change_homework_accepted_teachers_li_list(new_list) {
  return {
    type: ACTION_CHANGE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST, // )))
    payload: new_list
  }
}

export function delete_homework_accepted_teachers_li_list_item(class_id) {
  return {
    type: ACTION_DELETE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST_ITEM, // )))
    payload: class_id
  }
}

export function cleanup_homework_li_list(list_name) {
  return {
    type: ACTION_CLEANUP_HOMEWORK_LI_LIST, // )))
    payload: list_name
  }
}

export function clean_homework_teachers_li_lists() {
  return {
    type: ACTION_CLEAN_HOMEWORK_TEACHERS_LI_LISTS, // )))
  }
}