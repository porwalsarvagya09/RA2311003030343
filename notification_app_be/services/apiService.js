import axios from "axios";

const BASE_URL = "http://20.207.122.201/evaluation-service";

let registrationInfo = null;


export const registerService = async () => {
  try {
    const payload = {
      name: "vehicle-maintenance-scheduler"
    };

    const res = await axios.post(`${BASE_URL}/register`, payload);

    registrationInfo = res.data;

    console.log("Service registered");
  } catch (err) {
    console.error("Registration failed:", err.message);
    throw err;
  }
};


export const fetchDepots = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/depots`);

    if (!res.data?.depots) {
      throw new Error("Depot data missing");
    }

    return res.data.depots;
  } catch (err) {
    console.error("Error fetching depots:", err.message);
    throw err;
  }
};

export const fetchVehicles = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/vehicles`);

    if (!res.data?.vehicles) {
      throw new Error("Vehicle data missing");
    }

    return res.data.vehicles;
  } catch (err) {
    console.error("Error fetching vehicles:", err.message);
    throw err;
  }
};


export const getRegistrationInfo = () => registrationInfo;