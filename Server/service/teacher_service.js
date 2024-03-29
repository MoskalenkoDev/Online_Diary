const class_model = require("../models/class_model");
const student_users_model = require("../models/student_users_model");
const student_in_classes = require("../models/student_in_classes");
const homework_tasks = require("../models/homework_tasks");
const school_mark_model = require('../models/school_mark_model');
const ApiError = require('../exceptions/api_error');
const StudentInfo = require("../dtos/student_info_dto");
const HomeworkTasks = require("../dtos/homework_tasks_dto");
const MarkRecord = require('../dtos/mark_record_dto');
class TeacherService {

    async add_new_class(teacher_id, title, school_subjects) {

        let classModel = new class_model({ teacher_id, title, school_subjects });
        await classModel.save();
    }

    async teacher_delete_class(_id) {

        let classRecord = await class_model.findById(_id);
        for(let student_id of classRecord.new_students) {
            await student_in_classes.findOneAndUpdate({student_id}, {$pull : {"requests_to_join" : _id}});
        }
        for(let student_id of classRecord.students) {
            await student_in_classes.findOneAndUpdate({student_id}, {$pull : {"classes" : _id}});
        }
        await homework_tasks.deleteMany({class_id : _id});
        await school_mark_model.deleteMany({class_id : _id});
        let result = await class_model.deleteOne({ _id });
        
        return result.deletedCount;
    }

    async teacher_edit_class(_id, updateObj) {
        await class_model.findByIdAndUpdate(_id, { $set: updateObj }, function (err, doc) {
            if (err) throw ApiError.BadRequest("wrond class_id");
        });
    }

    async teacher_get_classes(teacher_id) {

        let classes = await class_model.find({ teacher_id });

        let new_arr = [];
        classes.forEach((class_obj) => {
            let new_obj = { ...class_obj };
            delete new_obj._doc.teacher_id;
            delete new_obj._doc.__v;
            new_arr.push(new_obj._doc);
        });
        return new_arr;
    }

    async get_student_requests_to_join(class_id) {

        let classInfo = await class_model.findById(class_id);
        let studentsArr = [];
        for (let student_id of classInfo.new_students) {
            let studentInfo = await student_users_model.findById(student_id);
            let newStudentInfo = new StudentInfo(studentInfo);
            studentsArr.push(newStudentInfo);
        }
        return studentsArr;
    }

    async submit_student_request_to_join(student_id, class_id) {
        await class_model.findByIdAndUpdate(class_id, { $pull: { "new_students": student_id }, $push: { "students": student_id } });
        await student_in_classes.findOneAndUpdate({ student_id }, { $pull: { "requests_to_join": class_id }, $push: { "classes": class_id } });
    }

    async deny_student_request_to_join(student_id, class_id) {
        await class_model.findByIdAndUpdate(class_id, { $pull: { "new_students": student_id } });
        await student_in_classes.findOneAndUpdate({ student_id }, { $pull: { "requests_to_join": class_id } });
    }


    async get_student_subscribers(class_id) {
        let classInfo = await class_model.findById(class_id);
        let studentsArr = [];
        for (let student_id of classInfo.students) {
            let studentInfo = await student_users_model.findById(student_id);
            let newStudentInfo = new StudentInfo(studentInfo);
            studentsArr.push(newStudentInfo);
        }
        return studentsArr;
    }

    async kick_student(student_id, class_id) {
        await class_model.findByIdAndUpdate(class_id, { $pull: { "students": student_id } });
        await student_in_classes.findOneAndUpdate({ student_id }, { $pull: { "classes": class_id } });
    }


    async get_homework_tasks(class_id, start_date, end_date) {
        let new_homework_tasks = [];
        let homeworks = await homework_tasks.find({ class_id, date: { $gte: start_date, $lt: end_date } }).lean(); //   ;
        homeworks.forEach(record => {
            const newTask = new HomeworkTasks(record);
            new_homework_tasks.push(newTask);
        });
        return new_homework_tasks;
    }

    async add_homework(class_id, school_subject, task, date) {
        let homeworkTaskModel = new homework_tasks({ class_id, school_subject, task, date });
        await homeworkTaskModel.save();
    }

    async edit_homework(record_id, subject, homeworkText, date) {
        let updateObj = {
            school_subject: subject,
            task: homeworkText,
            date
        };
        await homework_tasks.findByIdAndUpdate(record_id, { $set: updateObj }, function (err, doc) {
            if (err) throw ApiError.BadRequest("wrond record_id");
        });
    }

    async delete_homework(record_id) {
        await homework_tasks.findByIdAndDelete(record_id);
    }

    async get_marks(class_id, start_date, end_date) {
        let new_mark_records = [];
        let marks = await school_mark_model.find({ class_id, date: { $gte: start_date, $lt: end_date } }).lean();
        marks.forEach(record => {
            const newMark = new MarkRecord(record);
            new_mark_records.push(newMark);
        });

        return new_mark_records;
    }

    async get_deleted_students(students) {
        let new_students_info = [];

        const deleted_students_from_class = await student_users_model.find({ "_id": { $in: students } });

        deleted_students_from_class.forEach(record => {
            const student = new StudentInfo(record);
            new_students_info.push(student);
        });
        return new_students_info;
    }

    async saveOrEditMarks(marksForSave) {

        // markArr = [{ 
        //     student_id: "62690381a146a6275007b405",
        //     mark: "12",
        //     description: "круто що все вийшло"
        // } ...]

        // let marksForSave = {
        //     marksMainInfo: markArr, // 
        //     subject,
        //     date,
        //     class_id
        // }

        let { class_id, subject: school_subject, date, marksMainInfo } = marksForSave;

        for(let markInfo of marksMainInfo) {

            let markArr = markInfo.mark.split(',')?.map(mark => mark.trim())?.filter(mark => mark);

            if(markArr.length || markInfo.description) {
                await school_mark_model.findOneAndUpdate(
                {class_id, school_subject, date, "student_id": markInfo.student_id}, 
                {class_id, school_subject, date, "student_id": markInfo.student_id, marks: markArr, description: markInfo.description },
                {upsert: true}
            );}
            else if(!markArr.length && !markInfo.description) {
                await school_mark_model.findOneAndDelete({class_id, school_subject, date, "student_id": markInfo.student_id});
            } 
        }
        return true;
    }

}

module.exports = new TeacherService();