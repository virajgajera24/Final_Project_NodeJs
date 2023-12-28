const memberdb = require('../model/membermodel')
const studentdb = require('../model/studentsmodel')
const coursedb = require('../model/coursemodel')
const languagedb = require('../model/languagesmodel')
const storage = require('node-persist');
var jwt = require('jsonwebtoken');
exports.login = async (req, res) => {
    var data = await memberdb.find({ email: req.body.email });
    await storage.init( /* options ... */);
    var user_id = await storage.getItem('user_id')
    if (user_id == undefined) {
        if (data.length == 1) {
            if (req.body.password == data[0].password) {
                var token = jwt.sign({ id:data[0].id}, 'deep');
                req.headers.Authorization =token
                console.log(req.headers.Authorization)
                await storage.init( /* options ... */);
                await storage.setItem('user_id', data[0].id)
                await storage.setItem('user_role', data[0].role)
                res.status(200).json({
                    status: "login sucessfull",
                    token
                })
            }
            else{
                res.status(200).json({
                    status: "please enter correct username or password"
                })
            }
        }
        else {
            console.log(data)
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
exports.logout = async (req, res) => {
    await storage.init( /* options ... */);
    await storage.clear()
    res.status(200).json({
        status: "logout successfully"
    })
}
exports.register = async (req, res) => {
    console.log(req.body.coursename)
    var course = await coursedb.findById(req.body.coursename)
    console.log(course)
    var date = new Date();
    var dates = new Date();

    const installment_array = []
    for (var i = course.fees; i > 0; i = i - req.body.instalment) {
       dates.setMonth(dates.getMonth() + 1)
        if (i >= req.body.instalment) {
            installment_array.push([dates.toString(),"not paid",Number(req.body.instalment)])
           
        } else {
            installment_array.push([dates.toString(), "not paid", i])
        }
    }
    var endingdate = date.toString(date.setMonth(date.getMonth() + course.duration))
    var data = {
        name: req.body.firstname+" "+req.body.middlename+" "+req.body.lastname,
        contact: req.body.contact,
        dob:req.body.dob,
        address: req.body.address,
        coursename: req.body.coursename,
        pc_no:req.body.pc_no,
        endingdate: endingdate,
        faculty_name:req.body.faculty_name,
        installment: installment_array
    }
    var student = await studentdb.create(data)
    res.status(200).json({
        status: "register successfully",
        student
    })
}
exports.view_students = async (req, res) => {
    if(req.query.sort != undefined){
        var sort = req.query.sort.split(',')
    }
    else{
        var sort = ['name',1];
    }
    if(req.query.name == undefined){
        var data = await studentdb.find().populate('faculty_name',{name:1}).populate('coursename',{name:1}).sort({[sort[0]]:Number(sort[1])})
    }
    else{
        var data = await studentdb.find({name:{$regex:'.*'+ req.query.name +'.*'}}).populate('faculty_name',{name:1}).populate('coursename',{name:1}).sort({[sort[0]]:Number(sort[1])})
    }
    res.status(200).json({
        status: "view students",
        data
    })
}
exports.student = async (req, res) => {
    var data = await studentdb.findById(req.params.id)
    res.status(200).json({
        status: "single student",
        data
    })
}
exports.all_faculties =async(req,res)=>{
    var data = await memberdb.find({role:'fac'})
    res.status(200).json({
        status: "view all fac",
        data
    })
}
exports.all_course = async(req,res)=>{
    var data = await coursedb.find()
    res.status(200).json({
        status: "view all course",
        data
    })
}
exports.all_languages = async(req,res)=>{
    var data = await languagedb.find()
    res.status(200).json({
        status: "view all languages",
        data
    })
}
exports.your_students = async (req,res)=>{
    await storage.init( /* options ... */);
   var user_id = await storage.getItem('user_id')
    var data = await studentdb.find({faculty_name:user_id}).select("contact coursename")
    res.status(200).json({
        status: "view your students",
        data
    })
}
exports.update_search_student = async (req, res) => {
    var data = await studentdb.findById(req.params.id)
    res.status(200).json({
        status: "view update search",
        data
    })
}
exports.update_student = async (req, res) => {
    var data = await studentdb.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({
        status: "view updated",
        data
    })
}
exports.delete_student = async (req, res) => {
    var data = await studentdb.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: "deleted",
        data
    })
}
exports.add_marks = async (req, res)=>{
    var data = await studentdb.findById(req.params.id)
    var temp = true;
    for(var i=0;i<data.results.length;i++){
        console.log(req.body.result[0])
        console.log(data.results[i][0])
        if(data.results[i][0]==req.body.result[0]){
            data.results.splice(i,1,req.body.result);
            temp=false;
        }
    }
    if(temp){
        data.results.push(req.body.result)//[language,total,gained,percentage]
    }
    
    var average=0
    for(var i=0; i<data.results.length; i++){
        average += data.results[i][3]
    }
    console.log(data.results.length)
    average = average / data.results.length;
    var result = await studentdb.findByIdAndUpdate(req.params.id,{results: data.results,average:average})
    res.status(200).json({
        status: "result added",
        result
    })
}
exports.pending_fees =async(req,res)=>{
    if(req.query.name==undefined){
        var data= await studentdb.find().select('name coursename startingdate faculty_name installment').populate('coursename').populate('faculty_name')
    }
    else{
        var data= await studentdb.find({name:{$regex:'.*'+ req.query.name +'.*'}}).select('name coursename startingdate faculty_name installment').populate('coursename').populate('faculty_name')
    }
    var pending=[];
    for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].installment.length;j++){
            var date=new Date(data[i].installment[j][0])
            var today = new Date();
            if(date<today && data[i].installment[j][1]=='not paid'){
                if(!pending.includes(data[i])){
                    pending.push(data[i]);
                }
            }
        }
    }
    data=pending
    res.status(200).json({
        status: "pending fees",
        data
    })
}
exports.fee_paid=async(req,res)=>{
    var data=await studentdb.findById(req.params.id);

    for(var i=0;i<data.installment.length;i++){
        if(data.installment[i][1]=='not paid'){
            data.installment[i][1]='paid'
            break;
        }
    }
    
    var data = await studentdb.findByIdAndUpdate(req.params.id,{installment:data.installment})
    res.status(200).json({
        status: "success",
    })
}