import { useNavigate } from "react-router-dom"; 
import { useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
    const [form, setForm] = useState({username : "", email : "", password : ""});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name] : e.target.value});
    } 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/api/auth/register`, form);
            navigate("/");
        } catch(err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1e1e1e] px-4">
        <div className="w-full max-w-sm bg-white dark:bg-[#2a2b2d] rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Create Account
          </h2>
  
          {error && (
            <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm">
              {error}
            </p>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                className="w-full px-4 py-3 text-base rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
              />
            </div>
  
            <div>
              <input
                className="w-full px-4 py-3 text-base rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>
  
            <div>
              <input
                className="w-full px-4 py-3 text-base rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              Register
            </button>
          </form>
  
          <p className="text-sm mt-6 text-center text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <a
              href="/"
              className="text-green-500 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    );

}