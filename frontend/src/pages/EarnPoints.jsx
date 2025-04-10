import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { notify } from "../utils/Notify";

const tasks = [
    { id: "daily-login", label: "Daily Login" },
    { id: "share-app", label: "Share the App" },
    { id: "complete-profile", label: "Complete Profile" },
];

export default function EarnPoints() {
    const { user } = useAuth();
    const [msg, setMsg ] = useState("");

    const handleEarn = async (taskId) => {
        try {
            const res = await axios.post("http://localhost:5000/api/wallet/earn", {
                task : taskId,
            }, {
                headers : {Authorization : user.token},
            });
            setMsg(res.data.message);
            notify("🎉 Points Earned", `You earned ₹{res.data.reward} points!`);
        } catch (err) {
          if (err.response?.status === 403 || err.response?.status === 401) {
            alert("Session expired. Please log in again.");
            logout();
            navigate("/");
          } else {
            setMsg(err.response?.data?.error || "Something went wrong");
          }   
      }
  }
    
    return (
      <div className="p-4 md:p-8 max-w-md mx-auto bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Earn Points</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center border p-4 rounded shadow-sm bg-white dark:bg-gray-800">
            <span className="text-black dark:text-white">{task.label}</span>
            <button
              onClick={() => handleEarn(task.id)}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
            >
              Claim
            </button>
          </li>
        ))}
      </ul>
      {msg && <p className="mt-4 text-sm text-center text-blue-600">{msg}</p>}
    </div>    
  );

}