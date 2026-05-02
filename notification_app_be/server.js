import app from "./app.js";
import { registerService } from "./services/apiService.js";

const PORT = 5000;

const start = async () => {
  try {
    await registerService(); 

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err.message);
  }
};

start();