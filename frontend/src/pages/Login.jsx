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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1e1e1e] px-4">
        <div className="w-full max-w-sm bg-white dark:bg-[#2a2b2d] rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-white-800 dark:text-white mb-8">
            Welcome Back
          </h2>
  
          {error && (
            <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm">
              {error}
            </p>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block mb-1 text-base font-medium text-white-700 dark:text-gray-200"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your username"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition"
              />
            </div>
  
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-base font-medium text-white-700 dark:text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition"
              />
            </div>
  
            <button
              type="submit"
              className="w-full py-3 text-base font-semibold bg-[#10a37f] hover:bg-[#0e8e6d] text-white rounded-md transition"
            >
              Sign In
            </button>
          </form>
  
          <p className="text-sm mt-6 text-center text-white-600 dark:text-gray-300">
            Don't have an account?{" "}
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
