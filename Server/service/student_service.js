const class_model = require("../models/class_model");
const TeacherInfo = require('../dtos/teacher_info_dto');
const teacher_users_model = require('../models/teacher_users_model');
const student_in_classes = require('../models/student_in_classes');
const ApiError = require('../exceptions/api_error');
const homework_tasks = require("../models/homework_tasks");
const HomeworkTasks = require("../dtos/homework_tasks_dto");
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

    async get_sent_requests_to_teachers(student_id) {
        const classList = await student_in_classes.findOne({student_id}).lean();
        let teachersInfoArr = [];
        for(let class_id of classList.requests_to_join) {
            const classInfo = await class_model.findById(class_id).lean();
            const teacherInfo = await teacher_users_model.findById(classInfo.teacher_id).lean();
            let result_obj = new TeacherInfo(teacherInfo, classInfo);
            delete result_obj.contain_student;
            delete result_obj.phoneNumbers;
            result_obj.school_subjects = result_obj.school_subjects.join(", ")
            delete result_obj.school;
            teachersInfoArr.push(result_obj);
        }
        return teachersInfoArr;
    }

    async delete_sent_request_to_teacher_item(class_id, student_id) {
        await class_model.findByIdAndUpdate(class_id, {$pull : {"new_students": student_id}});
        await student_in_classes.findOneAndUpdate({"student_id" : student_id}, {$pull : {"requests_to_join": class_id}});
    }

    async get_accepted_teachers(student_id) {
        const classList = await student_in_classes.findOne({student_id}).lean();
        let teachersInfoArr = [];
        for(let class_id of classList.classes) {
            const classInfo = await class_model.findById(class_id).lean();
            const teacherInfo = await teacher_users_model.findById(classInfo.teacher_id).lean();
            let result_obj = new TeacherInfo(teacherInfo, classInfo);
            delete result_obj.contain_student;
            result_obj.school_subjects = result_obj.school_subjects.join(", ")
            delete result_obj.school;
            teachersInfoArr.push(result_obj);
        }
        return teachersInfoArr;
    }

    async unsubscribe_from_teacher(class_id, student_id) {
        await class_model.findByIdAndUpdate(class_id, {$pull : {"students": student_id}});
        await student_in_classes.findOneAndUpdate({"student_id" : student_id}, {$pull : {"classes": class_id}});
    }

    async get_homework_tasks(student_id, start_date, end_date) {
        let new_homework_tasks = [];
        let studentClasses = await student_in_classes.findOne({student_id});
        let homeworks = await homework_tasks.find({"class_id": {$in: studentClasses.classes}, date :{$gte: start_date ,$lt:end_date}}); // 
        console.log(homeworks);
        homeworks.forEach(record => {
            const newTask = new HomeworkTasks(record);
            new_homework_tasks.push(newTask);
        });
        return new_homework_tasks;
    }
}

module.exports = new StudentService();