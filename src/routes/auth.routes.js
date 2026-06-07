const { Router } = require("express")

const authController = require("../controllers/auth.controllers")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description it register a new user
 * @access Public
 */


authRouter.post("/register",authController.registerUserController)



/**
 * @route POST /api/auth/login
 * @description it logins existing users
 * @access Public
 */
authRouter.post("/login",authController.LoginUserController)





module.exports = authRouter