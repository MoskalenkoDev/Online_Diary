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

}