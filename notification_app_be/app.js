import express from "express";
import testRoutes from "./routes/testRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

const app = express();
app.use(express.json());

app.use("/api", testRoutes);
app.use("/api", scheduleRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

export default app;