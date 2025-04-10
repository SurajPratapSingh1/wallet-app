import { useNavigate } from "react-router-dom"; 
import { useState } from 'react';
import axios from 'axios';

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
            await axios.post("http://localhost:5000/api/auth/register", form);
            navigate("/");
        } catch(err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input className="w-full mb-4 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white" name="username" placeholder="Username" onChange={handleChange} required />
        <input className="w-full mb-4 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white" name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input className="w-full mb-4 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white" name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Register</button>
        <p className="text-sm mt-4 text-center text-black dark:text-gray-300">
          Already have an account? <a className="text-blue-600" href="/">Login</a>
        </p>
      </form>
    </div>
    
  );

}