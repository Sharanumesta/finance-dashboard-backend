import "dotenv/config";
import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

app.get("/", (req, res) => {
  res.send("API working 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`server is started ${PORT}`);
  });
}

export default app;