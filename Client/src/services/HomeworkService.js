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

    static async get_student_requests_to_join(class_id) {
        return $api.get(`/teacher/diary_menu/homework/get_student_requests_to_join/${class_id}`);
    }

    static async submit_student_request_to_join(student_id, class_id) {
        return $api.put(`/teacher/diary_menu/homework/submit_student_request_to_join`, {student_id, class_id});
    }

    static async deny_student_request_to_join(student_id, class_id) {
        return $api.delete(`/teacher/diary_menu/homework/deny_student_request_to_join`, {data : {student_id, class_id}});
    }
    
    static async get_student_subscribers(class_id) {
        return $api.get(`/teacher/diary_menu/homework/get_student_subscribers/${class_id}`);
    }

    static async kick_student(student_id, class_id) {
        return $api.delete(`/teacher/diary_menu/homework/kick_student`, {data : {student_id, class_id}});
    }

    
    static async get_teacher_homework_tasks(class_id, start_date, end_date) {
        return $api.post(`/teacher/diary_menu/homework/get_homework_tasks`, {class_id, start_date, end_date});
    }

    static async add_homework(class_id, subject, homeworkText, date) { ///
        return $api.post(`/teacher/diary_menu/homework/add_homework`, {class_id,subject, homeworkText, date});
    }

    static async edit_homework(record_id ,subject, homeworkText, date) { ///
        return $api.put(`/teacher/diary_menu/homework/edit_homework`, {record_id ,subject, homeworkText, date});
    }

    static async delete_homework(record_id) {
        return $api.delete(`/teacher/diary_menu/homework/delete_homework`, {data : {record_id}});
    }

    //////////////////////////////////////////StudentHomeworkController///////////////////////////////////////////////////

    static async search_teacher_by_id(_id) {
        return $api.get(`/student/diary_menu/homework/search_teacher_by_id/${_id}`)
    }

    static async send_subscription_request(class_id) {
        return $api.post(`/student/diary_menu/homework/send_subscription_request`, {class_id});
    }

    static async get_sent_requests_to_teachers() {
        return $api.get(`/student/diary_menu/homework/get_sent_requests_to_teachers`);
    }

    static async delete_sent_request_to_teacher_item(class_id) {
        return $api.delete(`/student/diary_menu/homework/delete_sent_request_to_teacher_item`, {data : {class_id}});
    }
    
    static async get_accepted_teachers() {
        return $api.get(`/student/diary_menu/homework/get_accepted_teachers`);
    }

    static async unsubscribe_from_teacher(class_id) {
        return $api.delete(`/student/diary_menu/homework/unsubscribe_from_teacher`, {data : {class_id}});
    }

}