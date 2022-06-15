const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api_error');

const teacher_service = require('../service/teacher_service');
const ObjectId = require('mongoose').Types.ObjectId;

class TeacherController 
{

    async add_new_class(req , res,next) {
        try {
            const {title, school_subjects} = req.body;
            const {id} = req.user; // teacher_id
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
               return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            await teacher_service.add_new_class(id, title, school_subjects);
            return res.sendStatus(200, 'OK');
        }
        catch(e) {
            next(e);
        }
    }

    async teacher_delete_class(req, res,next) {
        try {
            const {class_id} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            let isDeleted = await teacher_service.teacher_delete_class(class_id);
            if(!isDeleted) return next(ApiError.BadRequest('wrong class_id'));
            return res.sendStatus(200, 'OK');
        }
        catch(e) {
            next(e);
        }    
    }

    async teacher_edit_class(req,res,next) {
        try {
            const {class_id,title,school_subjects} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            await teacher_service.teacher_edit_class(class_id, {title,school_subjects} );
            return res.sendStatus(200, 'OK');
        }
        catch(e) {
            next(e);
        }
    }

    async teacher_get_classes(req,res,next) {
        try {
            const {id} = req.user; // teacher_id
            let classes = await teacher_service.teacher_get_classes(id);
            return res.json(classes);
        }
        catch(e) {
            next(e);
        }
    }

    async get_student_requests_to_join(req, res, next) {
        try {
            const {class_id} = req.params;
            const studentsInfoList = await teacher_service.get_student_requests_to_join(class_id);
            return res.json(studentsInfoList);
        }
        catch (e) {
            next(e);
        }
    }

    async submit_student_request_to_join(req, res, next) {
        try {
            const {student_id, class_id} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            await teacher_service.submit_student_request_to_join(student_id, class_id);
            return res.sendStatus(200, 'OK');
        }
        catch (e) {
            next(e);
        }
    }

    async deny_student_request_to_join(req, res, next) {
        try {
            const {student_id, class_id} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            await teacher_service.deny_student_request_to_join(student_id, class_id);
            return res.sendStatus(200, 'OK');
        }
        catch (e) {
            next(e);
        }
    }
    

    async get_student_subscribers(req, res, next) {
        try {
            const {class_id} = req.params;
            const studentsInfoList = await teacher_service.get_student_subscribers(class_id);
            return res.json(studentsInfoList);
        }
        catch (e) {
            next(e);
        }
    }


    async kick_student(req, res, next) {
        try {
            const {student_id, class_id} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            await teacher_service.kick_student(student_id, class_id);
            return res.sendStatus(200, 'OK');
        }
        catch (e) {
            next(e);
        }
    }

    async get_homework_tasks(req, res, next) {
        try {
            const {class_id, start_date, end_date} = req.body;
            
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
               return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            const homework_tasks = await teacher_service.get_homework_tasks(class_id, start_date, end_date);
            return res.json(homework_tasks);
        }
        catch (e) {
            next(e);
        }
    }

    async add_homework(req , res,next) {
        try {
            const {class_id, subject, homeworkText, date} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
               return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            await teacher_service.add_homework(class_id, subject, homeworkText, date);
            return res.sendStatus(200, 'OK');
        }
        catch(e) {
            next(e);
        }
    }

    async edit_homework(req , res,next) {
        try {
            const {record_id, subject, homeworkText, date} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
               return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            await teacher_service.edit_homework(record_id, subject, homeworkText, date);
            return res.sendStatus(200, 'OK');
        }
        catch(e) {
            next(e);
        }
    }

    async delete_homework(req, res, next) {
        try {
            const {record_id} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            await teacher_service.delete_homework(record_id);
            return res.sendStatus(200, 'OK');
        }
        catch (e) {
            next(e);
        }
    }

    async get_marks(req, res, next) {
        try {
            const {class_id, start_date, end_date} = req.body;
            
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
               return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            const mark_records = await teacher_service.get_marks(class_id, start_date, end_date);
            return res.json(mark_records);
        }
        catch (e) {
            next(e);
        }
    }

    async get_deleted_students(req, res, next) {
        try {
            const {students} = req.body;
            
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
               return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            const students_info = await teacher_service.get_deleted_students(students);
            return res.json(students_info);
        }
        catch (e) {
            next(e);
        }
    }

}

module.exports = new TeacherController();