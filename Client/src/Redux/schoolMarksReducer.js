
import {
  ACTION_CHANGE_SCHOOL_MARKS_CLASS_LIST, ACTION_CHANGE_SCHOOL_MARKS_STUDENT_START_AND_END_DATE, 
  ACTION_CHANGE_SCHOOL_MARKS_STUDENT_MARKS_INFO
} from './types';

const initialState = {
  school_marks_class_list : [],
  school_marks_student_start_and_end_date: [0,0], // the period from when we got homework info from DB
  school_marks_student_marks_info: [], // our homework from DB
};

// Pure Functions
export const schoolMarksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_SCHOOL_MARKS_CLASS_LIST:
      return {...state, school_marks_class_list: action.payload}

    case ACTION_CHANGE_SCHOOL_MARKS_STUDENT_START_AND_END_DATE: {
        return {...state, school_marks_student_start_and_end_date: [...action.payload]}
      }

    case ACTION_CHANGE_SCHOOL_MARKS_STUDENT_MARKS_INFO: {
        return {...state, school_marks_student_marks_info: [...state.school_marks_student_marks_info, ...action.payload]}
      }

    default: return state
  }
}
