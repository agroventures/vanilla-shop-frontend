import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export const initPayment = (payload) => api.post("/payments/init", payload);

export const getTransaction = (reqid) => api.get(`/payments/transaction/${reqid}`);

export const listTransactions = () => api.get("/payments/transactions");

export const payWithToken = (payload) => api.post("/payments/pay-with-token", payload);

export default api;
