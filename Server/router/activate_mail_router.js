const router = require('express').Router();
const both_user_types_controller = require('../controllers/both_user_types_controller');

router.get("/activate_mail/:link", both_user_types_controller.activate_mail);

module.exports = router;