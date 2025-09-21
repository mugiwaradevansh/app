import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import axios from "axios";
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  BarChart3,
  PieChart,
  Activity,
  Award,
  Clock,
  CheckCircle,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress as ProgressBar } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar
} from "recharts";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Progress = () => {
  const { tasks, dashboardData } = useContext(AppContext);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeeklyProgress();
  }, []);

  const fetchWeeklyProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/progress/weekly`);
      setWeeklyProgress(response.data);
    } catch (error) {
      console.error("Error fetching weekly progress:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate category statistics
  const getCategoryStats = () => {
    const stats = {
      DSA: { total: 0, completed: 0 },
      PROJECT: { total: 0, completed: 0 },
      LEARN: { total: 0, completed: 0 },
      OPS: { total: 0, completed: 0 },
      APPLY: { total: 0, completed: 0 }
    };

    tasks.forEach(task => {
      if (stats[task.category]) {
        stats[task.category].total++;
        if (task.status === 'COMPLETED') {
          stats[task.category].completed++;
        }
      }
    });

    return Object.entries(stats).map(([category, data]) => ({
      category,
      total: data.total,
      completed: data.completed,
      percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    }));
  };

  // Prepare data for charts
  const weeklyChartData = weeklyProgress.map(week => ({
    week: `Week ${week.week_number}`,
    completion: Math.round(week.completion_percentage),
    tasks: week.completed_tasks,
    total: week.total_tasks
  }));

  const categoryStats = getCategoryStats();
  const pieChartData = categoryStats.map(stat => ({
    name: stat.category,
    value: stat.completed,
    total: stat.total
  }));

  const COLORS = {
    DSA: '#7C3AED',
    PROJECT: '#0284C7',
    LEARN: '#059669',
    OPS: '#EA580C',
    APPLY: '#991B1B'
  };

  // KPI calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const dsaTasks = tasks.filter(t => t.category === 'DSA');
  const dsaCompleted = dsaTasks.filter(t => t.status === 'COMPLETED').length;

  const projectTasks = tasks.filter(t => t.category === 'PROJECT');
  const projectsCompleted = projectTasks.filter(t => t.status === 'COMPLETED').length;

  const applicationTasks = tasks.filter(t => t.category === 'APPLY');
  const applicationsCompleted = applicationTasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Progress Analytics
          </h1>
          <p className="text-gray-400 mt-1">
            Track your internship preparation journey with detailed insights
          </p>
        </div>

        <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-purple-500/20 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-white">{overallProgress}%</div>
              <ProgressBar value={overallProgress} className="h-2" />
              <div className="text-sm text-gray-400">
                {completedTasks} of {totalTasks} tasks completed
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-purple-500/20 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              DSA Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-purple-400">{dsaCompleted}</div>
              <ProgressBar 
                value={dsaTasks.length > 0 ? (dsaCompleted / dsaTasks.length) * 100 : 0} 
                className="h-2" 
              />
              <div className="text-sm text-gray-400">
                {dsaTasks.length} problems assigned
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-blue-500/20 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-blue-400">{projectsCompleted}</div>
              <ProgressBar 
                value={projectTasks.length > 0 ? (projectsCompleted / projectTasks.length) * 100 : 0} 
                className="h-2" 
              />
              <div className="text-sm text-gray-400">
                {projectTasks.length} project tasks
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-red-500/20 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-red-400">{applicationsCompleted}</div>
              <ProgressBar 
                value={applicationTasks.length > 0 ? (applicationsCompleted / applicationTasks.length) * 100 : 0} 
                className="h-2" 
              />
              <div className="text-sm text-gray-400">
                {applicationTasks.length} application tasks
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Line Chart */}
        <Card className="glass border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span>Weekly Progress Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value, name) => [
                      name === 'completion' ? `${value}%` : value,
                      name === 'completion' ? 'Completion' : name
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completion" 
                    stroke="#7C3AED" 
                    strokeWidth={3}
                    dot={{ fill: '#7C3AED', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#7C3AED', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card className="glass border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              <span>Task Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value, name, props) => [
                      `${value} completed / ${props.payload.total} total`,
                      props.payload.name
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="glass border-gray-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Category Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={`text-white`}
                    style={{ backgroundColor: COLORS[stat.category] }}
                  >
                    {stat.category}
                  </Badge>
                  <span className="text-lg font-bold text-white">
                    {stat.percentage}%
                  </span>
                </div>
                
                <ProgressBar 
                  value={stat.percentage} 
                  className="h-3"
                  style={{
                    '--progress-foreground': COLORS[stat.category]
                  }}
                />
                
                <div className="text-sm text-gray-400">
                  {stat.completed} / {stat.total} completed
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Breakdown Table */}
      {weeklyProgress.length > 0 && (
        <Card className="glass border-gray-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>Weekly Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Week</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Phase</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Progress</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">DSA</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Projects</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Applications</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyProgress.map((week) => (
                    <tr key={week.week_number} className="border-b border-gray-800 hover:bg-white/5">
                      <td className="py-3 px-4 font-medium text-white">
                        Week {week.week_number}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {week.phase}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <ProgressBar 
                            value={week.completion_percentage} 
                            className="w-16 h-2" 
                          />
                          <span className="text-sm text-gray-300">
                            {Math.round(week.completion_percentage)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-purple-400 font-medium">
                        {week.dsa_completed}
                      </td>
                      <td className="py-3 px-4 text-blue-400 font-medium">
                        {week.projects_completed}
                      </td>
                      <td className="py-3 px-4 text-red-400 font-medium">
                        {week.applications_sent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Progress;