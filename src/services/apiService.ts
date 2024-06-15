import axios from "axios";

const API_ULR = "https://api.alegra.com/api/v1/";
const API_KEY = process.env.VUE_APP_ALEGRA_API_KEY;

const apiClient = axios.create({
  baseURL: API_ULR,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(API_KEY + ":")}`,
  },
});

const apiService = {
  getSellers() {
    return apiClient.get("/sellers");
  },
};

export default apiService;
