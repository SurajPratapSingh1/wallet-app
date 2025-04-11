import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [form, setForm] = useState({ username : "", password : ""});
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const API = import.meta.env.VITE_API_BASE_URL;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name] : e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/api/auth/login`, form);
            login(res.data);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md backdrop-blur-md bg-white/20 dark:bg-gray-800/30 p-8 rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700 transition-all"
        >
          <h2 className="text-3xl font-extrabold text-white dark:text-white text-center mb-6 drop-shadow">
            Welcome Back 👋
          </h2>
  
          {error && (
            <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
              {error}
            </p>
          )}
  
          <div className="mb-4">
            <label className="block text-white dark:text-gray-200 mb-1 text-sm font-semibold">
              Username
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="mb-6">
            <label className="block text-white dark:text-gray-200 mb-1 text-sm font-semibold">
              Password
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Sign In
          </button>
  
          <p className="mt-4 text-sm text-center text-white dark:text-gray-300">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-yellow-300 hover:text-yellow-400 font-medium transition"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    );

}
