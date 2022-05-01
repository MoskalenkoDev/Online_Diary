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
}

module.exports = new TeacherController();