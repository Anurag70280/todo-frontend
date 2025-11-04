import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./task.css";

const AddTask: React.FC = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("incomplete");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a task title");

    try {
      await axiosInstance.post("/tasks", { title, status });
      navigate("/"); // redirect back to Home
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    }
  };

  return (
    <div className="home-container">
      <h2>Add New Task</h2>
      <form className="add-task-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="incomplete">Incomplete</option>
          <option value="complete">Complete</option>
        </select>

        <button type="submit">Add Task</button>
      </form>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
};

export default AddTask;
