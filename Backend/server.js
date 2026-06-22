require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const port = process.env.PORT || 3000;

async function startServer() {
  await connectDB();          // ✅ wait for DB first
  app.listen(port, () => {
    console.log(`server is running on ${port}`);
  });
}

startServer();