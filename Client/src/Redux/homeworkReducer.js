import {
  ACTION_CHANGE_HOMEWORK_SHOW_POPUP, ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS, 
  ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE, ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM,
  ACTION_CHANGE_HOMEWORK_CLASSES_LI_LIST
} from './types';

const initialState = 
{
  homework_popup_class : "", // активный класс - homework_popup_active
  homework_popup_active_menu_item : "active_popup_menu_students_list", // "active_popup_menu_requests_list" "active_popup_menu_invite_link" 
  homework_warning_title : "..", // 
  popup_warning_class: "", //активный класс - homework_popup_warning_active
  homework_classes_li_list: [],
  homework_subscribed_teacher_cards : [], // for the list of teachers we are subscribed to
  homework_request_teacher_cards: [], // for the list of teachers to whom the request was sent
};


// Pure Functions
export const homeworkReducer = (state = initialState, action) => {
  switch (action.type) 
  {
    case ACTION_CHANGE_HOMEWORK_SHOW_POPUP:
      return { ...state, homework_popup_class: action.payload }

    case ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS:
      return { ...state, popup_warning_class: action.payload }

    case ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM:
      return { ...state, homework_popup_active_menu_item: action.payload } 

    case ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE:
      return { ...state, homework_warning_title: action.payload } 

    case ACTION_CHANGE_HOMEWORK_CLASSES_LI_LIST : 
      return {...state, homework_classes_li_list: action.payload}

    default: return state
  }
}
