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
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8f9] dark:bg-[#1e1e1e] px-4">
        <div className="w-full max-w-sm bg-white dark:bg-[#2a2b2d] rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
            Sign in to your account
          </h2>
  
          {error && (
            <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
              {error}
            </p>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                name="username"
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="w-full px-5 py-3 text-base rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3 text-base rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition"
              />
            </div>
  
            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-[#10a37f] hover:bg-[#0e8e6d] text-white rounded-lg transition"
            >
              Continue
            </button>
          </form>
  
          <p className="text-sm mt-6 text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#10a37f] hover:underline font-medium"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    );

}
