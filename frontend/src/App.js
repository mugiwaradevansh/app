import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import Progress from "./components/Progress";
import AIRecommendations from "./components/AIRecommendations";
import Sidebar from "./components/Sidebar";
import { Toaster } from "./components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Context for global state
export const AppContext = React.createContext();

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchTasks = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await axios.get(`${API}/tasks?${params}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/overview`);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`${API}/tasks/${taskId}`, { status });
      await fetchTasks();
      await fetchDashboardData();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const initializeSchedule = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/tasks/initialize`);
      await fetchTasks();
      await fetchDashboardData();
    } catch (error) {
      console.error("Error initializing schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDashboardData();
  }, []);

  const contextValue = {
    tasks,
    setTasks,
    loading,
    dashboardData,
    fetchTasks,
    fetchDashboardData,
    updateTaskStatus,
    initializeSchedule
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="App">
        <BrowserRouter>
          <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
              <main className="p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/ai" element={<AIRecommendations />} />
                </Routes>
              </main>
            </div>
          </div>
          <Toaster />
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
}

export default App;