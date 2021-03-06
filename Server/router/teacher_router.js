const router = require('express').Router();
const teacher_controller = require('../controllers/teacher_controller');
const {body} = require('express-validator');
const auth_middleware = require('../middlewares/auth_middleware');

router.get("/diary_menu/homework/get_classes", 
    auth_middleware,
    teacher_controller.teacher_get_classes
);

router.post("/diary_menu/homework/add_new_class",
    body("title").isString(),
    body("school_subjects").isArray({min: 1}),
    auth_middleware,
    teacher_controller.add_new_class
);
router.put("/diary_menu/homework/edit_class", 
    body("class_id").isString(),
    body("title").isString(),
    body("school_subjects").isArray({min: 1}),
    auth_middleware,
    teacher_controller.teacher_edit_class
);

router.delete("/diary_menu/homework/delete_class",
    body("class_id").isString(),
    auth_middleware,
    teacher_controller.teacher_delete_class
);

router.get("/diary_menu/homework/get_student_requests_to_join/:class_id", 
    auth_middleware,
    teacher_controller.get_student_requests_to_join
);

router.put("/diary_menu/homework/submit_student_request_to_join", 
    body("student_id").isString(),
    body("class_id").isString(),
    auth_middleware,
    teacher_controller.submit_student_request_to_join
);

router.delete("/diary_menu/homework/deny_student_request_to_join",
    body("student_id").isString(),
    body("class_id").isString(),
    auth_middleware,
    teacher_controller.deny_student_request_to_join
);

router.get("/diary_menu/homework/get_student_subscribers/:class_id", 
    auth_middleware,
    teacher_controller.get_student_subscribers
);

router.delete("/diary_menu/homework/kick_student",
    body("student_id").isString(),
    body("class_id").isString(),
    auth_middleware,
    teacher_controller.kick_student
);

router.post("/diary_menu/homework/add_homework",
    body("class_id").isString(),
    body("subject").isString(),
    body("homeworkText").isString(),
    body("date").isString(),
    auth_middleware,
    teacher_controller.add_homework
);

router.put("/diary_menu/homework/edit_homework",
    body("record_id").isString(),
    body("subject").isString(),
    body("homeworkText").isString(),
    body("date").isString(),
    auth_middleware,
    teacher_controller.edit_homework
);

router.delete("/diary_menu/homework/delete_homework",
    body("record_id").isString(),
    auth_middleware,
    teacher_controller.delete_homework
);

router.post("/diary_menu/homework/get_homework_tasks",
    body("class_id").isString(),
    body("start_date").isString(),
    body("end_date").isString(),
    auth_middleware,
    teacher_controller.get_homework_tasks
);

router.post("/diary_menu/school_marks/get_marks",
    body("class_id").isString(),
    body("start_date").isString(),
    body("end_date").isString(),
    auth_middleware,
    teacher_controller.get_marks
);

router.post("/diary_menu/school_marks/get_deleted_students",
    body("students").isArray(),
    auth_middleware,
    teacher_controller.get_deleted_students
);

router.post("/diary_menu/school_marks/saveOrEditMarks",
    body("marksForSave").isObject(),
    auth_middleware,
    teacher_controller.saveOrEditMarks
);

module.exports = router;