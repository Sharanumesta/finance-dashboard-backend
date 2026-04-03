import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ message: "Supabase connected 🚀", users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8080, () => {
  console.log("server is started");
});