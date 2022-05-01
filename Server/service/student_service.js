const class_model = require("../models/class_model");
const TeacherInfo = require('../dtos/teacher_info_dto');
const teacher_users_model = require('../models/teacher_users_model');
const student_in_classes = require('../models/student_in_classes');
const ApiError = require('../exceptions/api_error');

class StudentService {

    async search_teacher_by_id(_id, student_id) {
        
        const classInfo = await class_model.findById(_id).lean();
        if (!classInfo) throw ApiError.BadRequest("wrong class_id");

        const teacher = await teacher_users_model.findById(classInfo.teacher_id).lean();
        if (!teacher) throw ApiError.BadRequest("teacher not found");
        
        let newClassInfo = JSON.parse(JSON.stringify(classInfo));

        let containStudent = ( newClassInfo.new_students.includes(student_id) || newClassInfo.students.includes(student_id));

        let result_obj = new TeacherInfo(teacher, classInfo, containStudent);
        return result_obj;

    }

    async send_subscription_request(class_id, id) {
        const classInfo = await class_model.findById(class_id);
        if (!classInfo) throw ApiError.BadRequest("wrong class_id");
        if(classInfo.new_students.includes(id) || classInfo.students.includes(id)) throw ApiError.BadRequest("you have already sent a request");
        classInfo.new_students.push(id);
        await student_in_classes.findOneAndUpdate({student_id: id}, {$push: {"requests_to_join": class_id}}, {new: true, upsert: true });
        await classInfo.save();
    }

}

module.exports = new StudentService();