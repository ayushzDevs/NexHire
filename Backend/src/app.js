const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({extended:true}))
/* require all routes here*/
const authRouter = require("./routes/auth.routes")




/* using all the routes here*/
app.use("/api/auth",authRouter)


const profileRoutes = require("../src/routes/profile.routes");
app.use("/api/profile", profileRoutes);





const analyzeRoutes = require("./routes/analyze.routes");
app.use("/api/analyze", analyzeRoutes);


module.exports = app;