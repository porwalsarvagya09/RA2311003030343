import { fetchDepots, fetchVehicles } from "../services/apiService.js";
import { selectBestTasks } from "../utils/knapsack.js";

export const getSchedule = async (req, res) => {
  try {
    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    if (!depots?.length || !vehicles?.length) {
      return res.status(400).json({
        message: "No data available from APIs"
      });
    }

    const mechanicHours =
      depots[0].mechanic_hours ||
      depots[0]["mechanic hours"] ||
      0;

    if (!mechanicHours) {
      return res.status(400).json({
        message: "Invalid depot data"
      });
    }

    const tasks = vehicles.map((v, index) => ({
      taskId: v.TaskId || v.taskId || index,
      duration: Number(v.duration) || 0,
      impact: Number(v.Impact || v.impact) || 0
    })).filter(t => t.duration > 0 && t.impact > 0);

    if (!tasks.length) {
      return res.status(400).json({
        message: "No valid tasks found"
      });
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
    console.error("Schedule error:", err.message);

    res.status(500).json({
      message: "Scheduling failed",
      error: err.message
    });
  }
};