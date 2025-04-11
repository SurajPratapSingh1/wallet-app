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
      <div className="min-h-screen flex items-center justify-center bg-[#f2f4f7] dark:bg-[#1e1e1e] px-4">
        <div className="w-full max-w-[400px] bg-white dark:bg-[#2a2b2d] rounded-2xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Welcome Back
          </h2>
  
          {error && (
            <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm">
              {error}
            </p>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-lg rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition"
            />
  
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-lg rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition"
            />
  
            <button
              type="submit"
              className="w-full py-4 text-lg font-semibold bg-[#10a37f] hover:bg-[#0e8e6d] text-white rounded-lg transition"
            >
              Sign In
            </button>
          </form>
  
          <p className="text-sm mt-6 text-center text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[#10a37f] font-medium hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    );

}
