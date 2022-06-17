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

router.get('/diary_menu/homework/get_sent_requests_to_teachers',
    auth_middleware,
    student_controller.get_sent_requests_to_teachers
);

router.delete('/diary_menu/homework/delete_sent_request_to_teacher_item',
    auth_middleware,
    student_controller.delete_sent_request_to_teacher_item
);

router.get('/diary_menu/homework/get_accepted_teachers',
    auth_middleware,
    student_controller.get_accepted_teachers
);

router.delete('/diary_menu/homework/unsubscribe_from_teacher',
    auth_middleware,
    student_controller.unsubscribe_from_teacher
);

router.post("/diary_menu/homework/get_homework_tasks",
    body("start_date").isString(),
    body("end_date").isString(),
    auth_middleware,
    student_controller.get_homework_tasks
);

router.get("/diary_menu/school_marks/get_marks/:start_date/:end_date",
    param("start_date").isString(),
    param("end_date").isString(),
    auth_middleware,
    student_controller.get_marks
);

module.exports = router;