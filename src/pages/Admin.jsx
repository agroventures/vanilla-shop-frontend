import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Gift,
    LayoutDashboard,
    LogOut,
    ShoppingBag,
    Menu,
} from "lucide-react";
import axios from "axios";

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
        if (!token) window.location.href = "/login";

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
                window.location.href = "/";
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
        <div className="w-full h-screen flex bg-vanilla-100 font-sans overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-vanilla-900/60 backdrop-blur-sm z-30 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static z-40
                    w-72 h-full bg-vanilla-900 border-r border-vanilla-800
                    flex flex-col shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Logo & User Info */}
                <div className="h-32 px-6 flex flex-col justify-center items-center gap-4 border-b border-vanilla-800 bg-vanilla-900">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-12 w-12 object-contain brightness-0 invert opacity-90"
                    />
                    <h1 className="text-2xl font-bold font-serif text-gold-500 tracking-wide">
                        {admin?.name || "Admin"}
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    h-12 flex items-center gap-4 px-5 rounded-lg
                                    text-base font-medium transition-all duration-200 group
                                    ${
                                        active
                                            ? "bg-vanilla-800 text-gold-500 shadow-md translate-x-1"
                                            : "text-vanilla-200 hover:bg-vanilla-800/50 hover:text-vanilla-50 hover:translate-x-1"
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 ${active ? "text-gold-500" : "text-vanilla-200 group-hover:text-vanilla-50"}`} />
                                <span className="tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-6 mb-8">
                    <button
                        onClick={logout}
                        className="w-full h-12 flex items-center justify-center gap-3 border border-vanilla-800 rounded-lg text-vanilla-200 hover:text-gold-500 hover:border-gold-500 hover:bg-vanilla-800 transition-all duration-300"
                    >
                        <span className="font-medium tracking-wide">Logout</span>
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col relative">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 px-6 flex items-center justify-between bg-vanilla-50 border-b border-vanilla-200">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-vanilla-900 hover:bg-vanilla-200 rounded-md transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-serif text-lg font-bold text-vanilla-900">Admin Panel</span>
                    <div className="w-6" /> {/* Spacer for centering */}
                </header>

                {/* Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-hidden bg-vanilla-100">
                    <div className="w-full h-full rounded-2xl bg-vanilla-50 shadow-xl border border-vanilla-200 overflow-y-auto p-4 lg:p-8">
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