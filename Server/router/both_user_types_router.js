const router = require('express').Router();
const both_user_types_controller = require('../controllers/both_user_types_controller');
const {body} = require('express-validator');
const auth_middleware = require('../middlewares/auth_middleware');

router.post( 
    "/signup", 
    body('email').isEmail(), 
    body('password').isLength({min: 6 , max: 32}), 
    both_user_types_controller.user_signup
);
router.post("/login", both_user_types_controller.user_login);
router.post('/logout',both_user_types_controller.user_logout);
router.get('/refresh', both_user_types_controller.user_refresh_token);
router.get("/diary_menu/profile", student_controller.profile_get_data); // i am not sure about GET method
// router.post("/diary_menu/profile/save_input_data", student_controller.profile_post_data);

module.exports = router; 