require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")

port = 3000;

connectDB()

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})