const class_model = require("../models/class_model");
const student_users_model = require("../models/student_users_model");
const student_in_classes = require("../models/student_in_classes");
const ApiError = require('../exceptions/api_error');
const StudentInfo = require("../dtos/student_info_dto");
class TeacherService {

    async add_new_class(teacher_id, title, school_subjects) {

        let classModel = new class_model({teacher_id, title, school_subjects});
        await classModel.save();
    }

    async teacher_delete_class(_id) {
        let result = await class_model.deleteOne({_id});
        return result.deletedCount;
    }

    async teacher_edit_class(_id, updateObj) {
        await class_model.findByIdAndUpdate(_id , {$set : updateObj}, function(err, doc) {
            if(err) throw ApiError.BadRequest("wrond class_id");
        });
    }

    async teacher_get_classes(teacher_id) {

        let classes = await class_model.find({teacher_id});
        
        let new_arr = [];
        classes.forEach((class_obj) => 
        {
            let new_obj = {...class_obj};
            delete new_obj._doc.teacher_id;
            delete new_obj._doc.__v;
            new_arr.push(new_obj._doc);
        });
        return new_arr;                                                                    
    }

    async get_student_requests_to_join(class_id) {

        let classInfo = await class_model.findById(class_id);
        let studentsArr = [];
        for(let student_id of classInfo.new_students) {
            let studentInfo = await student_users_model.findById(student_id);
            let newStudentInfo = new StudentInfo(studentInfo);
            studentsArr.push(newStudentInfo);
        }    
        return studentsArr;                                                               
    }

    async submit_student_request_to_join(student_id, class_id) {
        await class_model.findByIdAndUpdate(class_id , {$pull : {"new_students": student_id}, $push : {"students" : student_id}});
        await student_in_classes.findOneAndUpdate({student_id}, {$pull: {"requests_to_join" : class_id}, $push : {"classes" : class_id}});
    }

    async deny_student_request_to_join(student_id, class_id) {
        await class_model.findByIdAndUpdate(class_id , {$pull : {"new_students": student_id}});
        await student_in_classes.findOneAndUpdate({student_id}, {$pull: {"requests_to_join" : class_id}});
    }


    async get_student_subscribers(class_id) {

        let classInfo = await class_model.findById(class_id);
        let studentsArr = [];
        for(let student_id of classInfo.students) {
            let studentInfo = await student_users_model.findById(student_id);
            let newStudentInfo = new StudentInfo(studentInfo);
            studentsArr.push(newStudentInfo);
        }    
        return studentsArr;
    }

    async kick_student(student_id, class_id) {
        await class_model.findByIdAndUpdate(class_id , {$pull : {"students": student_id}});
        await student_in_classes.findOneAndUpdate({student_id}, {$pull: {"classes" : class_id}});
    }

}

module.exports = new TeacherService();