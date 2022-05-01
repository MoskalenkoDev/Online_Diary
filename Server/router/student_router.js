const router = require('express').Router();
const student_controller = require('../controllers/student_controller');
const {body, param} = require('express-validator');
const auth_middleware = require('../middlewares/auth_middleware');

router.get('/diary_menu/homework/search_teacher_by_id/:_id',
    auth_middleware,
    param('_id').exists(),
    param('_id').isLength({min: 24, max: 24}),
    student_controller.search_teacher_by_id
);

router.post("/diary_menu/homework/send_subscription_request",
    auth_middleware,
    student_controller.send_subscription_request
)

module.exports = router;