export const selectBestTasks = (tasks, maxTime) => {
  const n = tasks.length;

  const dp = Array.from({ length: n + 1 }, () =>
    Array(maxTime + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const { duration, impact } = tasks[i - 1];

    for (let t = 0; t <= maxTime; t++) {
      if (duration <= t) {
        dp[i][t] = Math.max(
          dp[i - 1][t],
          impact + dp[i - 1][t - duration]
        );
      } else {
        dp[i][t] = dp[i - 1][t];
      }
    }
  }

  let t = maxTime;
  const selected = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][t] !== dp[i - 1][t]) {
      selected.push(tasks[i - 1]);
      t -= tasks[i - 1].duration;
    }
  }

  return {
    totalImpact: dp[n][maxTime],
    selectedTasks: selected
  };
};