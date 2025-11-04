import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./home.css";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaClipboardList } from "react-icons/fa";

interface Task {
  _id: string;
  title: string;
  status: string; 
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      let query = "";
      if (statusFilter !== "all") query += `status=${statusFilter}`;
      if (search.trim()) query += `${query ? "&" : ""}search=${search}`;
      const res = await axiosInstance.get(`/tasks${query ? `?${query}` : ""}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]); 

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axiosInstance.post("/tasks", { title: newTask });
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task._id);
    setEditedText(task.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedText("");
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await axiosInstance.put(`/tasks/${id}`, { title: editedText });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      cancelEditing();
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "complete" ? "incomplete" : "complete";
      const res = await axiosInstance.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling task status:", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasks();
  };

  return (
    <div className="todo-container">
      <h1 className="todo-header">
        <FaClipboardList className="icon" /> What To Do
      </h1>

      <div className="add-task">
        <input
          type="text"
          placeholder="Add a Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ color: "#000" }}
        />
        <button onClick={addTask}>Add Todo</button>
      </div>

     
      <form onSubmit={handleSearch} className="filter-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ color: "#000" }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="complete">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <button type="submit">Search</button>
      </form>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-item">
            <button
              className="status-btn"
              onClick={() => toggleStatus(task._id, task.status)}
              style={{
                backgroundColor: task.status === "complete" ? "#81c784" : "#e57373",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                fontWeight: 500,
                marginRight: "10px",
              }}
            >
              {task.status === "complete" ? "Completed" : "Incomplete"}
            </button>

            {editingId === task._id ? (
              <>
                <input
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="edit-input"
                  style={{ color: "#000", backgroundColor: "#fff" }}
                />
                <FaCheck className="icon success" onClick={() => saveEdit(task._id)} />
                <FaTimes className="icon cancel" onClick={cancelEditing} />
              </>
            ) : (
              <>
                <span
                  className="task-title"
                  style={{
                    color: "#000",
                    textDecoration: task.status === "complete" ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </span>
                <div className="task-actions">
                  <FaEdit className="icon edit" onClick={() => startEditing(task)} />
                  <FaTrash className="icon delete" onClick={() => deleteTask(task._id)} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
