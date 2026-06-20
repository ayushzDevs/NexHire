const userModel = require("../models/user.models")
 const tokenBlacklistModel = require("../models/blacklist.models")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



/**
 * @name registerUserController
 * @description register a new user , expects username , email and passowrd in the request body
 * @access Public
 */


async function registerUserController(req,res){
    let {username , email , password} = req.body;

    if ( !username || !email || !password){
        return res.status(400).json({
            messgae: !username 
            ? "Please provide your username" 
            : !email 
            ? "please provide your email"
            : "please set you password"
        })
        
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username},{email}]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message: "Account already exists with this username or email"
        })
    }
    
    const hashed = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password : hashed
    })

    const token = jwt.sign({
        id: user._id , username : user.username
    }, process.env.JWT_SECRET,
    {expiresIn:"5d"})

    res.cookie("token",token)

    res.status(201).json({
        message: "User registered successfully",
        user :{
            id: user._id,
            username : user.username,
            email : user.email
        }
    })
}

/**
 * @name LoginUserController
 * @description login a user , expects email and passowrd
 * @access Public
 */

async function LoginUserController(req,res){
    
    const {email , password } = req.body

    if (!email || !password){
        return res.status(400).json({
            message : !email 
            ? "Please enter you registered email"
            : "Please enter your password"
        })
    } 

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message : "Invalid Email or Password , please register first"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid Email or Password , please register first"
        })
    }

    const token = jwt.sign({
        id: user._id , username : user.username}
        , process.env.JWT_SECRET,
            {expiresIn:"5d"})

    res.cookie("token",token)

    res.status(200).json({
        message: "User logged in successfully",
        user:{

            id: user._id,
            username : user.username,
            email : user.email

        }
    })

}


/**
 * @name LogoutUserController
 * @description Logouts user from the system and blacklists their user token from cookies
 */

async function LogoutUserController(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(token){
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message : "User logged out successfully"

    })
    }

/**
 * @name getMeController
 * @description get the current logged in user details 
 */


async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(401).json({
            message: "User not found, please login again"
        });
    }

    return res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

module.exports = {
    registerUserController,
    LoginUserController,
    LogoutUserController,
    getMeController
}