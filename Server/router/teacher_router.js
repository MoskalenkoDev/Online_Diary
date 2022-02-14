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

module.exports = router;