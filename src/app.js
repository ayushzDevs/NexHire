const express = require("express")
const cookieParser = require("cookie-parser")
app = express()



app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({extended:true}))
/* require all routes here*/
const authRouter = require("./routes/auth.routes")



/* using all the routes here*/
app.use("/api/auth",authRouter)













module.exports = app;