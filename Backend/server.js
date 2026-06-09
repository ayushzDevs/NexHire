require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")
const cors = require("cors")

port = 3000;

app.use(cors({
  origin: "http://localhost:5173",   // your Vite frontend URL
  credentials: true,                 // required for cookies/auth headers
}));

connectDB()

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})