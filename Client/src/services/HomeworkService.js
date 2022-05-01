import $api from "../http/axios_instance";

export default class HomeworkService {
 
    static async get_classes_info() {
        return $api.get(`/teacher/diary_menu/homework/get_classes`);
    }

    static async add_new_class(title, school_subjects) {
        return $api.post(`/teacher/diary_menu/homework/add_new_class`, {title, school_subjects});
    }

    static async edit_class(class_id, title, school_subjects) {
        return $api.put(`/teacher/diary_menu/homework/edit_class`, {class_id, title, school_subjects});
    }

    static async delete_class(class_id) {
        return $api.delete(`/teacher/diary_menu/homework/delete_class`, {data : {class_id}});
    }

    //////////////////////////////////////////StudentHomeworkController///////////////////////////////////////////////////

    static async search_teacher_by_id(_id) {
        return $api.get(`/student/diary_menu/homework/search_teacher_by_id/${_id}`)
    }

    static async send_subscription_request(class_id) {
        return $api.post(`/student/diary_menu/homework/send_subscription_request`, {class_id});
    }

}