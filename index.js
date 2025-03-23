const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongosanatize = require("express-mongo-sanitize");
const DatabaseConnection = require("./Config/Database");
const globalErrHandler = require("./Middleware/globalerror");
const BranchRouter = require("./Routes/Branch");
const AdminRouter = require("./Routes/Admin");
const FloorRouter = require("./Routes/Floor");
const KitchenRouter = require("./Routes/Kitchen");
const TableRouter = require("./Routes/Table");
const CategoryRouter = require("./Routes/Categories");
const MenuRouter = require("./Routes/Menu");
require("dotenv").config();
DatabaseConnection();
const app = express();

// Global Middileware
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(mongosanatize());

// Route Middleware
app.use("/api/v1/Admin", AdminRouter);
app.use("/api/v1/Branch", BranchRouter);
app.use("/api/v1/Floor", FloorRouter);
app.use("/api/v1/Kitchen", KitchenRouter);
app.use("/api/v1/Table", TableRouter);
app.use("/api/v1/Category", CategoryRouter);
app.use("/api/v1/Menu", MenuRouter);

// Not Found Route
app.use("*", (req, res, next) => {
  return res.status(404).json({
    status: false,
    code: 404,
    message: "Route Not Found",
  });
});

// Global Error Middleware
app.use(globalErrHandler);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`App is listening at Port ${PORT}`);
});
