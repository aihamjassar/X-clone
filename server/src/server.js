require("dotenv").config();
const app = require("./app");
const connectMongoDB = require("./db/db");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectMongoDB();
});
