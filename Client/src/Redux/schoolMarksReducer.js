
import {
  ACTION_CHANGE_SCHOOL_MARKS_CLASS_LIST
} from './types';

const initialState = {
  school_marks_class_list : [],
};

// Pure Functions
export const schoolMarksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_SCHOOL_MARKS_CLASS_LIST:
      return {...state, school_marks_class_list: action.payload}
    default: return state
  }
}
