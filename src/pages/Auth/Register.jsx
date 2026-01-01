import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

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

    async function register() {
        if (!validate()) {
            toast.error("Please fix the errors");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                import.meta.env.VITE_API_URL + "/admin/register",
                { name, email, password }
            );

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            toast.success("Register successful");
            navigate("/login");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Register failed"
            );
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") register();
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
                        Welcome to the Admin Portal!
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col justify-center items-center p-8 sm:p-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-10">
                        Register
                    </h1>

                    <div className="w-full max-w-sm space-y-6">

                        {/* Name */}
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors({ ...errors, name: "" });
                                }}
                                onKeyDown={handleKeyDown}
                                className={`w-full h-12 bg-transparent border-b text-dark placeholder:text-dark/40 focus:outline-none transition
                                    ${errors.name
                                        ? "border-red-500"
                                        : "border-dark/30 focus:border-gold"
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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
                            <input
                                type="password"
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
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Button */}
                        <button
                            onClick={register}
                            disabled={loading}
                            className={`w-full h-12 border border-dark font-semibold rounded-xl transition-all duration-300
                                ${loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-dark/80 hover:text-white"
                                }`}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>

                        <p className="text-dark/70 text-sm text-center pt-4">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-gold hover:underline font-medium"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
