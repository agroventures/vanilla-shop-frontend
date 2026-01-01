import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Gift,
    LayoutDashboard,
    LogOut,
    ShoppingBag,
    Menu,
    X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import AuthRoute from "./Auth/AuthRoute";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminProducts from "./Admin/AdminProducts";
import AdminOrders from "./Admin/AdminOrders";
import AdminAddProduct from "./Admin/AdminAddProduct";
import AdminEditProduct from "./Admin/AdminEditProduct";

export default function Admin() {
    const location = useLocation();
    const [admin, setAdmin] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) window.location.href = "/";

        axios
            .get(`${import.meta.env.VITE_API_URL}/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.data.admin.userRole === "admin") {
                    setAdmin(res.data.admin);
                } else {
                    window.location.href = "/";
                }
            })
            .catch(() => {
                window.location.href = "/login";
            });
    }, []);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
    }

    const isActive = (path) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/products", icon: Gift, label: "Products" },
        { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    ];

    return (
        <div className="w-full h-screen flex bg-vanilla-100 overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static z-40
                    w-72 h-full bg-dark border-r border-zinc-600
                    flex flex-col
                    transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Logo */}
                <div className="h-30 px-6 flex flex-col justify-center items-center gap-3 border-b border-zinc-600">
                    <img
                        src="/logo.png"
                        className="h-12 w-12 object-contain brightness-0 invert"
                    />
                    <h1 className="text-xl font-bold text-cream">
                        {admin?.name}
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    h-12 flex items-center gap-3 px-4 rounded-lg
                                    text-base text-white font-medium transition-all
                                    ${isActive(item.path)
                                        ? "bg-zinc-600 shadow-md"
                                        : "hover:bg-zinc-600"}
                                `}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-6 mb-4">
                    <button
                        onClick={logout}
                        className="w-full h-10 flex items-center justify-center gap-3 border border-white rounded-lg text-white hover:bg-zinc-600"
                    >
                        Logout
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <header className="lg:hidden h-14 px-4 flex items-center justify-between bg-white border-b">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <div />
                </header>

                {/* Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-hidden">
                    <div className="w-full h-full rounded-2xl bg-white shadow-2xl overflow-y-auto p-4 lg:p-6">
                        <Routes>
                            <Route element={<AuthRoute />}>
                                <Route path="/" element={<AdminDashboard />} />
                                <Route path="/products" element={<AdminProducts />} />
                                <Route path="/products/add" element={<AdminAddProduct />} />
                                <Route path="/products/edit/:slug" element={<AdminEditProduct />} />
                                <Route path="/orders" element={<AdminOrders />} />
                            </Route>
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
}
