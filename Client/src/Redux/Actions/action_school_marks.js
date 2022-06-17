import {
    ACTION_CHANGE_SCHOOL_MARKS_CLASS_LIST, ACTION_CHANGE_SCHOOL_MARKS_STUDENT_START_AND_END_DATE, 
    ACTION_CHANGE_SCHOOL_MARKS_STUDENT_MARKS_INFO
} from '../types';

export function school_marks_change_class_list(newClassList) {
    return {
        type: ACTION_CHANGE_SCHOOL_MARKS_CLASS_LIST,
        payload: newClassList
    }
}

export function school_marks_change_student_start_and_end_date(newDatesArr) {
    return {
        type: ACTION_CHANGE_SCHOOL_MARKS_STUDENT_START_AND_END_DATE,
        payload: newDatesArr
    }
}

export function school_marks_change_student_marks_info(newInfoPart) {
    return {
        type: ACTION_CHANGE_SCHOOL_MARKS_STUDENT_MARKS_INFO,
        payload: newInfoPart
    }
}