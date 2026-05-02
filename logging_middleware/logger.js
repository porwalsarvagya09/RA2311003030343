import axios from "axios";
import { getToken } from "../notification_app_be/services/apiService.js";

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

export const Log = async (stack, level, pkg, message) => {
  try {
    const token = getToken();

    if (!token) {
      console.log("No token available for logging");
      return;
    }

    await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (err) {
    console.error("Log failed:", err.response?.data || err.message);
  }
};