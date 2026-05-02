import express from "express";
import testRoutes from "./routes/testRoutes.js";

const app = express();
app.use(express.json());

app.use("/api", testRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

export default app;