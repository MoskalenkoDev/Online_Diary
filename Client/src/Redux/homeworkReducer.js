import 
{
  ACTION_CHANGE_HOMEWORK_SHOW_POPUP, ACTION_CHANGE_HOMEWORK_POPUP_NEW_CLASS_TITLE,
  ACTION_CHANGE_HOMEWORK_POPUP_SCHOOL_SUBJECTS,ACTION_CHANGE_HOMEWORK_POPUP_CLEAR_INPUTS,
  ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS,ACTION_CHANGE_CLASSES_LI_LIST, ACTION_CHANGE_HOMEWORK_POPUP_TYPE,
  ACTION_CHANGE_HOMEWORK_POPUP_EDIT_OBJ_ID,ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE,ACTION_CHANGE_HOMEWORK_SHOW_INVITE_LINK_POPUP,
  ACTION_CHANGE_INVITE_LINK, ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM
} from './types';

const initialState = 
{
  homework_popup_class : "", // активный класс - homework_popup_active
  homework_copy_invite_link_popup_class : "",// активный класс - active_invite_copy_link_popup
  homework_popup_active_type : "homework_add_class_popup", // "homework_edit_popup" , "homework_add_homework_class", "homework_students_editor"
  homework_popup_active_menu_item : "active_popup_menu_students_list", // "active_popup_menu_requests_list" "active_popup_menu_invite_link" 
  homework_warning_title : "..", // 
  edit_obj_id : "", // _id обьекта в бд который мы изменяем или удаляем
  new_class_title: "",
  school_subjects : "", // пока что строка, но при отправке на бек мы превратим ее в массив
  popup_warning_class: "", //активный класс - homework_popup_warning_active
  classes_li_list : [],
  invite_link : "" // ссылка, по которой студенты будут регистрироватся на преподавателей
};

// Pure Functions
export const homeworkReducer = (state = initialState, action) => {
  switch (action.type) 
  {
    case ACTION_CHANGE_HOMEWORK_SHOW_POPUP:
      return { ...state, homework_popup_class: action.payload }
    case ACTION_CHANGE_HOMEWORK_SHOW_INVITE_LINK_POPUP:
      return { ...state, homework_copy_invite_link_popup_class: action.payload }
    case ACTION_CHANGE_HOMEWORK_POPUP_NEW_CLASS_TITLE:
      return { ...state, new_class_title: action.payload }
    case ACTION_CHANGE_HOMEWORK_POPUP_SCHOOL_SUBJECTS:
      return { ...state, school_subjects: action.payload }
    case ACTION_CHANGE_HOMEWORK_POPUP_CLEAR_INPUTS:
      return { ...state, new_class_title: "", school_subjects : ""}
    case ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS:
      return { ...state, popup_warning_class: action.payload }
    case ACTION_CHANGE_CLASSES_LI_LIST:
      return { ...state, classes_li_list: action.payload } 
    case ACTION_CHANGE_HOMEWORK_POPUP_TYPE:
      return { ...state, homework_popup_active_type: action.payload } 
    case ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM:
      return { ...state, homework_popup_active_menu_item: action.payload } 
    case ACTION_CHANGE_HOMEWORK_POPUP_EDIT_OBJ_ID:
      return { ...state, edit_obj_id: action.payload }
    case ACTION_CHANGE_INVITE_LINK:
      return { ...state, invite_link: action.payload }  
    case ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE:
      return { ...state, homework_warning_title: action.payload } 
    default: return state
  }
}
