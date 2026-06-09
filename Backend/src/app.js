const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
app = express()

app.use(cors({
  origin: "http://localhost:5173",   // your Vite frontend URL
  credentials: true,                 // required for cookies/auth headers
}));



app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({extended:true}))
/* require all routes here*/
const authRouter = require("./routes/auth.routes")



/* using all the routes here*/
app.use("/api/auth",authRouter)













module.exports = app;