const { Router } = require("express")

const authController = require("../controllers/auth.controllers")

const authMiddleware = require("../middlewares/auth.middlewares")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description it register a new user
 * @access public
 */


authRouter.post("/register",authController.registerUserController)



/**
 * @route POST /api/auth/login
 * @description it logins existing users
 * @access public
 */


authRouter.post("/login",authController.LoginUserController)



/**
 * @route GET /api/auth/route
 * @description clear token from user cookies and add the token in the blacklist
 * @access public
 */


authRouter.post("/logout",authController.LogoutUserController)


/**
 * @roure GET /api.auth/get-me
 * @description get the current logged in user details
 * @access private
 */


authRouter.get("/get-me",authMiddleware.authUser, authController.getMeController)



module.exports = authRouter