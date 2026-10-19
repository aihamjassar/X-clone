const dotenv = require("dotenv");
const app = require("./app");
const connectMongoDB = require("./db/db");

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectMongoDB();
});
