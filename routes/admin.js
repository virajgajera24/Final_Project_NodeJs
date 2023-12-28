var express = require('express');
var router = express.Router();
var admin = require('../controller/admincontroller')
/* GET home page. */
router.post('/',admin.login)
router.get('/logout',admin.logout)
router.post('/register',admin.register)
router.get('/members',admin.view_members)
router.get('/update_member/:id',admin.update_search_member)
router.post('/update_member/:id',admin.update_member)
router.get('/delete_member/:id',admin.delete_member)
router.get('/students',admin.view_students)
router.get('/student/:id',admin.view_student)
router.post('/add_languages',admin.add_languages)
router.post('/add_course',admin.add_course)
router.get('/view_languages',admin.view_languages)
router.get('/view_course',admin.view_course)
module.exports = router;
