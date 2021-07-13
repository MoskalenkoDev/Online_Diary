import 
{
  ACTION_CHANGE_HOMEWORK_SHOW_POPUP, ACTION_CHANGE_HOMEWORK_POPUP_NEW_CLASS_TITLE,
  ACTION_CHANGE_HOMEWORK_POPUP_SCHOOL_SUBJECTS,ACTION_CHANGE_HOMEWORK_POPUP_CLEAR_INPUTS,
  ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS,ACTION_CHANGE_CLASSES_LI_LIST,ACTION_CHANGE_HOMEWORK_POPUP_TYPE,
  ACTION_CHANGE_HOMEWORK_POPUP_EDIT_OBJ_ID,ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE,ACTION_CHANGE_HOMEWORK_SHOW_INVITE_LINK_POPUP,
  ACTION_CHANGE_INVITE_LINK, ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM
} from '../types';

export function change_homework_show_popup_class(isShowClass) {
  return {
    type: ACTION_CHANGE_HOMEWORK_SHOW_POPUP,
    payload: isShowClass
  }
}

export function change_homework_show_invite_link_popup_class(isShowClass) {
  return {
    type: ACTION_CHANGE_HOMEWORK_SHOW_INVITE_LINK_POPUP,
    payload: isShowClass
  }
}

export function change_homework_popup_class_title(new_title) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_NEW_CLASS_TITLE,
    payload: new_title
  }
}

export function change_homework_popup_school_subjects(subjects_array) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_SCHOOL_SUBJECTS,
    payload: subjects_array
  }
}

export function change_homework_popup_clear_inputs() {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_CLEAR_INPUTS
  }
}

export function change_homework_popup_warning_title_class(new_class) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS,
    payload: new_class
  }
}

export function change_homework_classes_li_list(new_li_list) {
  return {
    type: ACTION_CHANGE_CLASSES_LI_LIST,
    payload: new_li_list
  }
}

export function change_homework_popup_type(popup_type_class) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_TYPE,
    payload: popup_type_class
  }
}

export function change_homework_edit_obj_id(_id) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_EDIT_OBJ_ID,
    payload: _id
  }
}

export function change_homework_warning_title(title) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE,
    payload: title
  }
}

export function change_homework_invite_link(link) {
  return {
    type: ACTION_CHANGE_INVITE_LINK,
    payload: link
  }
}

export function change_homework_popup_active_menu_item(new_active_item) {
  return {
    type: ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM,
    payload: new_active_item
  }
}