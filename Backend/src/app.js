const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
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

const resumeRoutes = require("./routes/resume.routes");
app.use("/api/resume", resumeRoutes);


const multer = require("multer");

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Max size is 5MB." });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.message === "Only PDF and DOCX files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;