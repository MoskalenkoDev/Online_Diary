const router = require('express').Router();
const teacher_controller = require('../controllers/teacher_controller');

router.post("/signup", teacher_controller.teacher_signup);
router.get("/login", teacher_controller.teacher_login);
router.get("/diary_menu/profile", teacher_controller.profile_get_data);
router.post("/diary_menu/profile/save_input_data", teacher_controller.profile_post_data);
router.get("/diary_menu/homework/get_classes", teacher_controller.teacher_get_classes);
router.post("/diary_menu/homework/add_new_class", teacher_controller.add_new_class);
router.post("/diary_menu/homework/edit_class", teacher_controller.teacher_edit_class);
router.post("/diary_menu/homework/delete_class", teacher_controller.teacher_delete_class);

module.exports = router;