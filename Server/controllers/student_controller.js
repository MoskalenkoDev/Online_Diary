const student_service = require('../service/student_service');
const ApiError = require('../exceptions/api_error');
const {validationResult} = require('express-validator');

class StudentController {

    async search_teacher_by_id(req, res, next) {
        try {
            const {_id} = req.params;
            const {id} = req.user;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
               return next(ApiError.BadRequest('wrong parameter type', errors.array())); 
            }
            const classInfo = await student_service.search_teacher_by_id(_id, id);
            return res.json(classInfo);
        }
        catch (e) {
            next(e);
        }
    }

    async send_subscription_request(req, res, next) {
        try {
            const {id} = req.user; // student_id
            const {class_id} = req.body;
            await student_service.send_subscription_request(class_id, id);
            return res.sendStatus(200);
        }
        catch (e) {
            console.log(e);
            next(e);
        }
    }

    async get_sent_requests_to_teachers(req, res, next) {
        try {
            const {id} = req.user; // student_id
            let classList = await student_service.get_sent_requests_to_teachers(id);
            return res.json(classList);
        }
        catch (e) {
            console.log(e);
            next(e);
        }
    }

}

module.exports = new StudentController();