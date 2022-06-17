import {
  ACTION_CHANGE_HOMEWORK_SHOW_POPUP, ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE_CLASS,
  ACTION_CHANGE_HOMEWORK_POPUP_WARNING_TITLE, ACTION_CHANGE_HOMEWORK_POPUP_ACTIVE_MENU_ITEM,
  ACTION_CHANGE_HOMEWORK_CLASSES_LI_LIST, ACTION_CHANGE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST,
  ACTION_DELETE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST_ITEM, ACTION_CHANGE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST,
  ACTION_DELETE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST_ITEM, ACTION_CHANGE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST,
  ACTION_DELETE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST_ITEM, ACTION_CHANGE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST,
  ACTION_DELETE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST_ITEM, ACTION_CLEANUP_HOMEWORK_LI_LIST, ACTION_CLEAN_HOMEWORK_TEACHERS_LI_LISTS,
  ACTION_CHANGE_HOMEWORK_STUDENT_START_AND_END_DATE, ACTION_CHANGE_HOMEWORK_STUDENT_HOMEWORK_INFO
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
  homework_students_in_class_li_list: [], // the list of teachers accepted request
  homework_student_start_and_end_date: [0,0], // the period from when we got homework info from DB
  homework_student_homework_info: [], // our homework from DB
};

const changeLiList = (goalList, newList, key = null) => {
  
  let updatedList = [];

  if(!key) { // якщо ми не видаляємо конкретний елемент
    goalList.forEach((li)=> { // провіряє чи є всі елементи попереднього списку в новому, якщо ні, то позначає відсутні як deleted
      let foundLi = newList.find(val => val.key === li.key);
      if(foundLi) updatedList.push(foundLi);
      else {
        let deletedLi = {...li, props : {...li.props, className: "compact_user_card deleted" }};
        updatedList.push(deletedLi); // ми добавили відсутньому елементу клас deleted
      }
    });

    newList.forEach((li)=> { // всі елементи нового списку, які не присутні в попередньому - будуть добавлені в updatedList
      let foundLi = updatedList.find(val => val.key === li.key);
      if(!foundLi) updatedList.push(li);
    });
  }
  else { // якщо ми хочемо видалити конкретний елемент списку
    updatedList = goalList.map(li => {
      if(li.key === key) {
        return {...li, props : {...li.props, className: "compact_user_card deleted" }};
      }
      return li;
    })
  }
  return updatedList;
}

const deleteLiItem = (goalList) => {
  return goalList.filter(li => !li.props.className.split(" ").includes("deleted"));
}

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
      return { ...state, homework_requests_to_teachers_li_list: changeLiList(state.homework_requests_to_teachers_li_list , action.payload)}

    case ACTION_DELETE_HOMEWORK_REQUESTS_TO_TEACHERS_LI_LIST_ITEM: {
      return {...state, homework_requests_to_teachers_li_list : changeLiList(state.homework_requests_to_teachers_li_list, null, action.payload)}
    }
    case ACTION_CHANGE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST: {
      return {...state, homework_student_requests_to_join_li_list: changeLiList(state.homework_student_requests_to_join_li_list, action.payload) }
    }
    case ACTION_DELETE_HOMEWORK_STUDENT_REQUESTS_TO_JOIN_LI_LIST_ITEM: {
      return {...state, homework_student_requests_to_join_li_list : changeLiList(state.homework_student_requests_to_join_li_list, null, action.payload)}
    }
    case ACTION_CHANGE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST: {
      return {...state, homework_students_in_class_li_list: changeLiList(state.homework_students_in_class_li_list, action.payload)}
    }
    case ACTION_DELETE_HOMEWORK_STUDENTS_IN_CLASS_LI_LIST_ITEM: {
      return {...state, homework_students_in_class_li_list : changeLiList(state.homework_students_in_class_li_list, null, action.payload)}
    }
    case ACTION_CHANGE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST: {
      return {...state, homework_accepted_teachers_li_list: changeLiList(state.homework_accepted_teachers_li_list, action.payload)}
    }
    case ACTION_DELETE_HOMEWORK_ACCEPTED_TEACHERS_LI_LIST_ITEM: {
      return {...state, homework_accepted_teachers_li_list : changeLiList(state.homework_accepted_teachers_li_list, null, action.payload)}
    }
    case ACTION_CLEANUP_HOMEWORK_LI_LIST:{
      return {...state,  [action.payload] : deleteLiItem(state[action.payload])}
    }
    case ACTION_CLEAN_HOMEWORK_TEACHERS_LI_LISTS: {
      return {...state, homework_student_requests_to_join_li_list: [], homework_students_in_class_li_list: []}
    }
    case ACTION_CHANGE_HOMEWORK_STUDENT_START_AND_END_DATE: {
      return {...state, homework_student_start_and_end_date: [...action.payload]}
    }
    case ACTION_CHANGE_HOMEWORK_STUDENT_HOMEWORK_INFO: {
      return {...state, homework_student_homework_info: [...state.homework_student_homework_info, ...action.payload]}
    }
    default: return state
  }
}
