var express = require('express');
var router = express.Router();
const { showTeachers,
    registerStudent,
    suspendAStudent,
    NotificationRecipients,
    commonStudents } = require('../controllers/TeacherController');

/* GET users listing. */
router.get('/all_teachers', showTeachers);
router.post('/register', registerStudent);
router.post('/suspend', suspendAStudent);
router.post('/retrievefornotifications', NotificationRecipients);
router.get('/commonstudents', commonStudents);



module.exports = router;
