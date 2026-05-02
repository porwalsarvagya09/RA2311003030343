import { fetchDepots, fetchVehicles } from "../services/apiService.js";
import { selectBestTasks } from "../utils/knapsack.js";

export const getSchedule = async (req, res) => {
  try {
    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    if (!Array.isArray(depots) || depots.length === 0) {
      return res.status(400).json({ message: "No depot data available" });
    }

    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({ message: "No vehicle data available" });
    }

    const mechanicHours =
      Number(depots[0].mechanic_hours) ||
      Number(depots[0]["mechanic hours"]) ||
      0;

    if (!mechanicHours) {
      return res.status(400).json({ message: "Invalid mechanic hours" });
    }

    const tasks = vehicles
      .map((v, index) => ({
        taskId: v.TaskId || v.taskId || index,
        duration: Number(v.duration),
        impact: Number(v.Impact ?? v.impact)
      }))
      .filter(
        t =>
          Number.isFinite(t.duration) &&
          Number.isFinite(t.impact) &&
          t.duration > 0 &&
          t.impact > 0
      );

    if (!tasks.length) {
      return res.status(400).json({ message: "No valid tasks found" });
    }

    const result = selectBestTasks(tasks, mechanicHours);

    const totalTime = result.selectedTasks.reduce(
      (sum, t) => sum + t.duration,
      0
    );

    res.json({
      mechanicHours,
      totalTime,
      totalImpact: result.totalImpact,
      selectedTasks: result.selectedTasks
    });
  } catch (err) {
    res.status(500).json({
      message: "Scheduling failed",
      error: err.message
    });
  }
};