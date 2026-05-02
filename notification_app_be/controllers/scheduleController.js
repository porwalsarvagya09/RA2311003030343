import { fetchDepots, fetchVehicles } from "../services/apiService.js";
import { selectBestTasks } from "../utils/knapsack.js";

export const getSchedule = async (req, res) => {
  try {
    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    if (!depots.length || !vehicles.length) {
      return res.status(400).json({
        message: "No data available"
      });
    }

    const mechanicHours = depots[0]["mechanic hours"];

    
    const tasks = vehicles.map(v => ({
      taskId: v.TaskId,
      duration: v.duration,
      impact: v.Impact
    }));

    const result = selectBestTasks(tasks, mechanicHours);

    const totalTime = result.selectedTasks.reduce(
      (sum, t) => sum + t.duration,
      0
    );

    res.json({
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