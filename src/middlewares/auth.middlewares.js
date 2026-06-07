const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/user.models")

async function authUser(req,res,next){

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Token not provided"
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({toke})

    if(isTokenBlacklisted){
        return res.status(401).json({
            message : "Token is invalid"
        })
    }
    
    try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded

    return next()
}
    catch(e){
        return res.status(401).json({
            message:"invalid token"
        })
    }

}

module.exports = {
    authUser
}