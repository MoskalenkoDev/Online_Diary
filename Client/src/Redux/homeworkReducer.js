import {
  ACTION_CHANGE_HOMEWORK_SHOW_POPUP, ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS,
  ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE, ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM,
  ACTION_CHANGE_HOMEWORK_CLASSES_LI_LIST, ACTION_CHANGE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST,
  ACTION_DELETE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST_ITEM, ACTION_CHANGE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST,
  ACTION_DELETE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST_ITEM, ACTION_CHANGE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST,
  ACTION_DELETE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST_ITEM, ACTION_CHANGE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST,
  ACTION_DELETE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST_ITEM
} from './types';

const initialState =
{
  homework_popup_class: "", // активный класс - homework_popup_active
  homework_popup_active_menu_item: "active_popup_menu_students_list", // "active_popup_menu_students_list" "active_popup_menu_requests_list" "active_popup_menu_invite_link" 
  homework_warning_title: "..", // 
  popup_warning_class: "", //активный класс - homework_popup_warning_active
  homework_classes_li_list: [],

  homework_requests_to_teachers_li_list: [], // the teachers requests list
  homework_accepted_teachers_li_list: [], // the list of teachers accepted request

  homework_student_requests_to_join_li_list: [], // the student requests to join to the class list
  homework_students_in_class_li_list: [] // the list of teachers accepted request
};


// Pure Functions
export const homeworkReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_HOMEWORK_SHOW_POPUP:
      return { ...state, homework_popup_class: action.payload }

    case ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS:
      return { ...state, popup_warning_class: action.payload }

    case ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM:
      return { ...state, homework_popup_active_menu_item: action.payload }

    case ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE:
      return { ...state, homework_warning_title: action.payload }

    case ACTION_CHANGE_HOMEWORK_CLASSES_LI_LIST:
      return { ...state, homework_classes_li_list: action.payload }

    case ACTION_CHANGE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST:
      return { ...state, homework_requests_to_teachers_li_list: action.payload }

    case ACTION_DELETE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST_ITEM: {
      let newList = state.homework_requests_to_teachers_li_list.filter(obj => (obj.key !== action.payload)); // i hope it works correct
      return {...state, homework_requests_to_teachers_li_list : newList}
    }
    case ACTION_CHANGE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST: {
      return {...state, homework_student_requests_to_join_li_list: action.payload}
    }
    case ACTION_DELETE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST_ITEM: {
      let newList = state.homework_student_requests_to_join_li_list.filter(obj => (obj.key !== action.payload)); // i hope it works correct
      return {...state, homework_student_requests_to_join_li_list : newList}
    }
    case ACTION_CHANGE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST: {
      return {...state, homework_students_in_class_li_list: action.payload}
    }
    case ACTION_DELETE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST_ITEM: {
      let newList = state.homework_students_in_class_li_list.filter(obj => (obj.key !== action.payload)); // i hope it works correct
      return {...state, homework_students_in_class_li_list : newList}
    }
    case ACTION_CHANGE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST: {
      return {...state, homework_accepted_teachers_li_list: action.payload}
    }
    case ACTION_DELETE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST_ITEM: {
      let newList = state.homework_accepted_teachers_li_list.filter(obj => (obj.key !== action.payload)); // i hope it works correct
      return {...state, homework_accepted_teachers_li_list : newList}
    }
    default: return state
  }
}
