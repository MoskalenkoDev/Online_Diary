import {
    ACTION_CHANGE_SCHOOL_MARKS_CLASS_LIST
} from '../types';

export function school_marks_change_class_list(newClassList) {
    return {
        type: ACTION_CHANGE_SCHOOL_MARKS_CLASS_LIST,
        payload: newClassList
    }
}