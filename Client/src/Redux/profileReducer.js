import {ACTION_CHANGE_INPUT_DATA_ALL, ACTION_CHANGE_INPUT_DATA_IMG_SRC,
  ACTION_CHANGE_INPUT_DATA_TEMPORARY_IMG_SRC,ACTION_LOGOUT,
  ACTION_CHANGE_INPUT_DATA_IMG_CROP_INFO,ACTION_CHANGE_INPUT_DATA_IMG_SHOW_POPUP,
  ACTION_CHANGE_INPUT_DATA_IMG_SHOW_POPUP_CROP_WRAPPER,
  ACTION_CHANGE_INPUT_DATA_NAME, ACTION_CHANGE_INPUT_DATA_SURNAME,
  ACTION_CHANGE_INPUT_DATA_LASTNAME,ACTION_CHANGE_INPUT_DATA_SCHOOL,
  ACTION_CHANGE_INPUT_DATA_PHONE_NUMBERS,
  ACTION_SAVE_PROFILE_POPUP_SPAN_CLASS,ACTION_SAVE_PROFILE_POPUP_SPAN_TITLE} from './types';

const initialState = 
{
  redirect_back : false, // когда нажмем кнопку выхода из аккаунта
  img_src : "", // сгенерированная ссылка для img (полученная из бд или после сохранения обрезанного фото)
  temporary_img_src : "", // когда нажимает сменить фото и обрезаем его, то здесь храниться обрезаное фото до сохранения
  img_crop_info: 
  {
    aspect : 1/1,
    unit : "%", 
    x : 25,
    y : 25,
    width: 50
  },
  img_show_popup: "",  // "img_show_popup_active" - когда активен
  img_show_crop_wrapper : "", // "img_show_crop_wrapper_active" - когда активен
  name: "",
  surname : "",
  lastName : "",
  school : "",
  phoneNumbers : "",
  save_popup_span_class : "", // active_save_profile_popup_title - когда активен
  save_popup_span_title : "Изменения успешно сохранены" // или (Что-то пошло не так) когда что-то не так
};

// Pure Functions
export const profileReducer = (state = initialState, action) => {
  switch (action.type) 
  {
    case ACTION_LOGOUT:
      return {...initialState, redirect_back: !state.redirect_back }
    case ACTION_CHANGE_INPUT_DATA_ALL:
      {
        return action.payload.img_src === "" ? {...state , ...action.payload, img_src : initialState.img_src } : {...state , ...action.payload }; // возможно криво работает
      }  
    case ACTION_CHANGE_INPUT_DATA_IMG_SRC:
      return { ...state, img_src: action.payload }
    case ACTION_CHANGE_INPUT_DATA_TEMPORARY_IMG_SRC:
      return { ...state, temporary_img_src: action.payload }
    case ACTION_CHANGE_INPUT_DATA_IMG_CROP_INFO:
      return { ...state, img_crop_info : {...action.payload} }
    case ACTION_CHANGE_INPUT_DATA_IMG_SHOW_POPUP:
      {
        if(action.payload == "") return { ...state, img_show_popup: action.payload, img_crop_info : {...initialState.img_crop_info} }
        else  return { ...state, img_show_popup: action.payload};
      }
    case ACTION_CHANGE_INPUT_DATA_IMG_SHOW_POPUP_CROP_WRAPPER:
      return { ...state, img_show_crop_wrapper: action.payload }
    case ACTION_CHANGE_INPUT_DATA_NAME:
      return { ...state, name: action.payload }
    case ACTION_CHANGE_INPUT_DATA_SURNAME:
      return { ...state, surname: action.payload }
    case ACTION_CHANGE_INPUT_DATA_LASTNAME:
      return { ...state, lastName: action.payload }
    case ACTION_CHANGE_INPUT_DATA_SCHOOL:
      return { ...state, school: action.payload }
    case ACTION_CHANGE_INPUT_DATA_PHONE_NUMBERS:
      return { ...state, phoneNumbers: action.payload }
    case ACTION_SAVE_PROFILE_POPUP_SPAN_CLASS:
      return { ...state, save_popup_span_class: action.payload }
    case ACTION_SAVE_PROFILE_POPUP_SPAN_TITLE:
      return { ...state, save_popup_span_title: action.payload }
    default: return state
  }
}
