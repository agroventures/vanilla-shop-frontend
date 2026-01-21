import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const initPayment = (payload) =>
  api.post("/payments/init", payload);

export const completePayment = (reqid) =>
  api.post("/payements/complete", { reqid });
