import axios from "axios";

const BASE_URL = "http://20.207.122.201/evaluation-service";

let accessToken = null;

export const registerService = async () => {
  const payload = {
    name: "Sarvagya Porwal",
    email: "sarvagya489@gmail.com",
    mobileNo: "9876543213",
    githubUsername: "your-github",
    rollNo: "your-roll",
    accessCode: "QkbpxH",
  };

  try {
    const res = await axios.post(`${BASE_URL}/register`, payload);
    accessToken = res.data.access_token;
    console.log("Registered successfully");
  } catch (error) {
    if (error.response?.status === 409) {
      console.log(
        "User already registered (409 Conflict). Using existing registration.",
      );
    } else {
      console.error("Registration error:", error.message);
    }
  }
};

export const fetchDepots = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/depots`);
    return res.data.depots;
  } catch (err) {
    console.error("Depot fetch error:", err.message);
    return [];
  }
};

export const fetchVehicles = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/vehicles`);
    return res.data.vehicles;
  } catch (err) {
    console.error("Vehicle fetch error:", err.message);
    return [];
  }
};

export const getToken = () => accessToken;
