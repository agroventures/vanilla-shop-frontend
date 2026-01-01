import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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

    async function login() {
        if (!validate()) {
            toast.error("Please fix the errors");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                import.meta.env.VITE_API_URL + "/admin/login",
                { email, password }
            );

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            toast.success("Login successful");

            if (res.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") login();
    };

    return (
        <div className="min-h-screen w-full bg-white/50 flex items-center justify-center px-4">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">

                {/* LEFT SIDE */}
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-dark">
                    <img
                        src="/logo.png"
                        alt="logo"
                        className="w-48 mb-6 brightness-100 invert-0 drop-shadow-xl"
                    />
                    <p className="text-white/70 text-center text-lg max-w-sm">
                        Welcome back!
                        <span className="block">
                            Please login to access your account.
                        </span>
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col justify-center items-center p-8 sm:p-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-10">
                        Login
                    </h1>

                    <div className="w-full max-w-sm space-y-6">

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
                                onKeyDown={handleKeyDown}
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
                                    onKeyDown={handleKeyDown}
                                    className={`w-full h-12 bg-transparent border-b text-dark placeholder:text-dark/40 focus:outline-none transition
                                        ${errors.password
                                            ? "border-red-500"
                                            : "border-dark/30 focus:border-gold"
                                        }`}
                                />
                                <div
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-3 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <Eye className="w-6 h-6 text-dark/30" />
                                    ) : (
                                        <EyeOff className="w-6 h-6 text-dark/30" />
                                    )}
                                </div>
                            </div>

                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Forgot */}
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
                            onClick={login}
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
                </div>
            </div>
        </div>
    );
}
