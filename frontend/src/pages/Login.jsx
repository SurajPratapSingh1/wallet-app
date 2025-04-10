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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input className="w-full mb-4 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white" name="username" placeholder="Username" onChange={handleChange} required />
        <input className="w-full mb-4 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white" name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">Login</button>
        <p className="text-sm mt-4 text-center text-black dark:text-gray-300">
          Don't have an account? <a className="text-blue-600" href="/register">Register</a>
        </p>
      </form>
    </div>
    
  );

}
