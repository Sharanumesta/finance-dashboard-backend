import "dotenv/config";
import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/transactions", transactionRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is started ${PORT}`);
});
