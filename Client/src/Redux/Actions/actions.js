import {
  ACTION_CHANGE_WHAT_CHECKED , ACTION_CHANGE_WHO_LOG , 
  ACTION_CHANGE_LOGIN , ACTION_CHANGE_PASSWORD ,
  ACTION_CHANGE_REDIRECT , ACTION_CHANGE_POPUP_TITLE ,
  ACTION_CHANGE_SHOW_POPUP,ACTION_CHANGE_INPUT_DATA_ALL,
  ACTION_CHANGE_INPUT_DATA_IMG_SRC,ACTION_CHANGE_INPUT_DATA_TEMPORARY_IMG_SRC,
  ACTION_CHANGE_INPUT_DATA_IMG_CROP_INFO,ACTION_LOGOUT,
  ACTION_CHANGE_INPUT_DATA_IMG_SHOW_POPUP,ACTION_CHANGE_INPUT_DATA_IMG_SHOW_POPUP_CROP_WRAPPER,
  ACTION_CHANGE_INPUT_DATA_NAME, ACTION_CHANGE_INPUT_DATA_SURNAME,
  ACTION_CHANGE_INPUT_DATA_LASTNAME,ACTION_CHANGE_INPUT_DATA_SCHOOL,
  ACTION_CHANGE_INPUT_DATA_SCHOOL_SUBJECT,ACTION_CHANGE_INPUT_DATA_PHONE_NUMBERS,
  ACTION_SAVE_INPUT_DATA_ALL,ACTION_SAVE_PROFILE_POPUP_SPAN_CLASS,ACTION_SAVE_PROFILE_POPUP_SPAN_TITLE} from '../types';


export function change_what_checked(log_or_reg) {
  return {
    type: ACTION_CHANGE_WHAT_CHECKED,
    payload: log_or_reg
  }
}

export function change_who_log(who) {
  return {
    type: ACTION_CHANGE_WHO_LOG,
    payload: who
  }
}

export function change_login(newLogin) {
  return {
    type: ACTION_CHANGE_LOGIN,
    payload: newLogin
  }
}

export function change_password(newPassword) {
  return {
    type: ACTION_CHANGE_PASSWORD,
    payload: newPassword
  }
}

export function change_redirect(isRedirect) {
  return {
    type: ACTION_CHANGE_REDIRECT,
    payload: isRedirect
  }
}

export function change_popup_title(title) {
  return {
    type: ACTION_CHANGE_POPUP_TITLE,
    payload: title
  }
}

export function change_show_popup(isShow) {
  return { 
    type: ACTION_CHANGE_SHOW_POPUP,
    payload : isShow
  }
}                                               // REGISTRATION
////////////////////////////////////////////////////////////////////////////////////////

export function change_redirect_logout() {
  return { 
    type: ACTION_LOGOUT
  }
}

export function change_input_data_all(all_data) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_ALL,
    payload : all_data
  }
}

export function change_input_data_img_src(new_src) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_IMG_SRC,
    payload : new_src
  }
}

export function change_input_data_temporary_img_src(new_src) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_TEMPORARY_IMG_SRC,
    payload : new_src
  }
}

export function change_input_data_img_crop_info(new_crop_info) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_IMG_CROP_INFO,
    payload : new_crop_info
  }
}

export function change_input_data_img_show_popup(isshow) { 
  return { 
    type: ACTION_CHANGE_INPUT_DATA_IMG_SHOW_POPUP,
    payload : isshow
  }
}

export function change_input_data_img_show_popup_crop_wrapper(isshow) { 
  return { 
    type: ACTION_CHANGE_INPUT_DATA_IMG_SHOW_POPUP_CROP_WRAPPER,
    payload : isshow
  }
}

export function change_input_data_name(new_input_name) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_NAME,
    payload : new_input_name
  }
}

export function change_input_data_surname(new_input_surname) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_SURNAME,
    payload : new_input_surname
  }
}

export function change_input_data_lastName(new_input_lastName) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_LASTNAME,
    payload : new_input_lastName
  }
}

export function change_input_data_school(new_input_school) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_SCHOOL,
    payload : new_input_school
  }
}

export function change_input_data_school_subject(new_input_school_subject) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_SCHOOL_SUBJECT,
    payload : new_input_school_subject
  }
}

export function change_input_data_phone_numbers(new_input_phone) {
  return { 
    type: ACTION_CHANGE_INPUT_DATA_PHONE_NUMBERS,
    payload : new_input_phone
  }
}

export function save_input_data_all(new_data) { // Асинхронный запрос в бд
  return { 
    type: ACTION_SAVE_INPUT_DATA_ALL, // наш екшн
    payload : new_data
  }
}

export function change_profile_save_popup_class(new_class) { 
  return { 
    type: ACTION_SAVE_PROFILE_POPUP_SPAN_CLASS, // наш екшн
    payload : new_class
  }
}

export function change_profile_save_popup_title(new_title) { 
  return { 
    type: ACTION_SAVE_PROFILE_POPUP_SPAN_TITLE, // наш екшн
    payload : new_title
  }
}