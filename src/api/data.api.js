import api from "./api";

export const getOrders = async () => {
    const response = await api.get("/orders");
    response.data = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return response.data;
};

export const getProducts = async () => {
    const response = await api.get(`/products`)
    return response.data;
};

export const getTodayOrders = async () => {
    const response = await api.get(`/orders`)
    response.data = response.data.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString());
    return response.data;
};

export const getTotalRevenue = async () => {
    const response = await api.get(`/orders`)
    response.data = response.data.filter((order) => order.status !== "cancelled").reduce((total, order) => total + order.totalPrice, 0);
    return response.data;
};

export const getOrderData = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`)
    return response.data;
};

