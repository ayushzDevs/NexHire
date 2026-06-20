require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const cors = require("cors");

const port = process.env.PORT || 3000;

async function startServer() {
  await connectDB();          // ✅ wait for DB first
  app.listen(port, () => {
    console.log(`server is running on ${port}`);
  });
}

app.use(cors({
  origin: "http://localhost:5173",   // your Vite frontend URL
  credentials: true,                 // required for cookies/auth headers
}));


startServer();