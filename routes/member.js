var express = require('express');
var router = express.Router();
var member = require('../controller/membercontroller')
var auth  = require('../middleware/auth');
/* GET home page. */
router.post('/',member.login)
router.get('/logout',member.logout)
router.post('/register',member.register)
router.get('/students',member.view_students)
router.get('/student/:id',member.student)
router.get('/all_faculties',member.all_faculties)
router.get('/all_course',member.all_course)
router.get('/all_languages',member.all_languages)
router.get('/your_student',member.your_students)
router.get('/update_student/:id',member.update_search_student)
router.post('/update_student/:id',member.update_student)
router.get('/delete_student/:id',member.delete_student)
router.post('/add_marks/:id',member.add_marks)
router.get('/pending_fees',member.pending_fees)
router.get('/fee_paid/:id',member.fee_paid)
module.exports = router;
