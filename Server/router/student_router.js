const router = require('express').Router();
const student_controller = require('../controllers/student_controller');

router.post("/signup", student_controller.student_signup);
router.get("/login", student_controller.student_login);
router.get("/diary_menu/profile", student_controller.profile_get_data);
router.post("/diary_menu/profile/save_input_data", student_controller.profile_post_data);

module.exports = router;