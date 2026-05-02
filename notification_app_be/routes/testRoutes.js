import express from "express";
import { fetchDepots, fetchVehicles } from "../services/apiService.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    res.json({
      depots,
      vehicles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;