import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useSEO from "../../hooks/useSEO";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const url = window.location.href;

    useSEO({
        title: "Login - The Vanilla Shop",
        description:
            "The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique.",
        url,
        image_alt: "Login",
        twitter_card: "summary_large_image",
    });

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Invalid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const login = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!validate()) {
            toast.error("Please fix the errors");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/admin/login`,
                {
                    email: email.trim(),
                    password,
                }
            );

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            toast.success("Login successful");

            navigate(res.data.role === "admin" ? "/admin" : "/");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white/50 flex items-center justify-center px-4">
            <form
                onSubmit={login}
                className="w-full max-w-md bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-6"
            >
                <div className="flex flex-col items-center mb-8">
                    <img src="/logo.png" alt="logo" className="w-30 mb-4" />
                    <h1 className="text-xl font-bold text-dark">Login</h1>
                </div>

                <div className="space-y-6">

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({ ...errors, email: "" });
                            }}
                            className={`w-full h-12 bg-transparent border-b text-dark placeholder:text-dark/40 focus:outline-none transition
                                ${errors.email
                                    ? "border-red-500"
                                    : "border-dark/30 focus:border-gold"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors({ ...errors, password: "" });
                                }}
                                className={`w-full h-12 bg-transparent border-b text-dark placeholder:text-dark/40 focus:outline-none transition
                                    ${errors.password
                                        ? "border-red-500"
                                        : "border-dark/30 focus:border-gold"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-3"
                            >
                                {showPassword ? (
                                    <Eye className="w-6 h-6 text-dark/30" />
                                ) : (
                                    <EyeOff className="w-6 h-6 text-dark/30" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Forgot password */}
                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-dark hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full h-12 border border-dark font-semibold rounded-xl transition-all duration-300
                            ${loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-dark/80 hover:text-white"
                            }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </form>
        </div>
    );
}
