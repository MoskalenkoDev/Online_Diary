import $api from "../http/axios_instance";

export default class MarksService {
 
    static async get_marks(class_id, start_date, end_date) {
        return $api.post(`/teacher/diary_menu/school_marks/get_marks`, {class_id, start_date, end_date});
    }

    static async get_deleted_students(students) {
        return $api.post(`/teacher/diary_menu/school_marks/get_deleted_students`, {students});
    }
    
}