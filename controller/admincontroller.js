const memberdb = require('../model/membermodel')
const studentdb = require('../model/studentsmodel')
const admindb = require('../model/adminmodel')
const languagedb = require('../model/languagesmodel')
const coursedb = require('../model/coursemodel')
const storage = require('node-persist');

exports.login = async (req, res) => {
    var data = await admindb.find({ email: req.body.email });
    await storage.init( /* options ... */);
    var admin_id = await storage.getItem('admin_id')
    if (admin_id == undefined) {
        if (data.length == 1) {
            if (req.body.password == data[0].password) {
                await storage.init( /* options ... */);
                await storage.setItem('admin_id', data[0].id)
                res.status(200).json({
                    status: "login sucessfull"
                })
            }
            else{
                res.status(200).json({
                    status: "please enter correct username or password"
                })
            }
        }
        else {
            res.status(200).json({
                status: "please enter correct username or password"
            })
        }
    }
    else {
        res.status(200).json({
            status: "please logout first"
        })
    }
}
exports.register = async (req, res) => {
    if (req.body.role == "fac" || req.body.role == "rec") {
        var data = await memberdb.create(req.body)
        res.status(200).json({
            status: `${req.body.role} added`
        })
    }
    else {
        res.status(200).json({
            status: "please ask your faculty or recipient"
        })
    }
}
exports.logout = async (req, res) => {
    await storage.init( /* options ... */);
    await storage.clear()
    res.status(200).json({
        status: "logout successfully"
    })
}
exports.view_members = async (req, res) => {
    if(req.query.sort != undefined){
        var sort = req.query.sort.split(',')
    }
    else{
        var sort = ['name',1];
    }
    if(req.query.name == undefined){
    var data = await memberdb.find().sort({[sort[0]]:Number(sort[1])})
    }
    else{
        var data = await memberdb.find({name:{$regex:'.*'+ req.query.name +'.*'}}).sort({[sort[0]]:Number(sort[1])})
    }
    res.status(200).json({
        status: "view members",
        data
    })
}
exports.update_search_member = async (req, res) => {
    var data = await memberdb.findById(req.params.id)
    res.status(200).json({
        status: "update search member",
        data
    })
}
exports.update_member = async (req, res) => {
    var data = await memberdb.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({
        status: "member updated",
        data
    })
}
exports.delete_member = async (req, res) => {
    var data = await memberdb.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: "deleted",
        data
    })
}
exports.view_students= async(req,res)=>{
    var data = await studentdb.find();
    res.status(200).json({
        status: "view students",
        data
    })
}
exports.view_student = async(req,res)=>{
    var data = await studentdb.findById(req.params.id);
    res.status(200).json({
        status: "view student",
        data
    })
}
exports.add_languages = async(req,res)=>{
    var data = await languagedb.create(req.body)
    res.status(200).json({
        status: "language added",
        data
    })
}
exports.view_languages = async(req,res)=>{
    var data = await languagedb.find()
    res.status(200).json({
        status: "language view",
        data
    })
}
exports.add_course = async(req,res)=>{
    var duration=0
    for(var i=0;i<req.body.languages.length;i++){
        var lang = await languagedb.findById(req.body.languages[i]);
        duration+=lang.duration;
    }
    req.body.duration = duration;
    var data = await coursedb.create(req.body)
    res.status(200).json({
        status: "course added",
        data
    })
}
exports.view_course = async(req,res)=>{
    var data = await coursedb.find()
    res.status(200).json({
        status: "course view",
        data
    })
}
