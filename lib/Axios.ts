import axios from "axios";

export const marketApi = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 8000,
});
