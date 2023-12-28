var jwt = require('jsonwebtoken');

exports.token = (req,res,next)=>{
    jwt.verify(req.headers.autharization,'viraj',next);
}