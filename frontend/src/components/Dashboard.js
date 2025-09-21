import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Play, 
  TrendingUp, 
  Target,
  Code,
  Briefcase,
  GraduationCap,
  Settings,
  Send,
  RefreshCw,
  Clock
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

const Dashboard = () => {
  const { 
    tasks, 
    loading, 
    dashboardData, 
    updateTaskStatus, 
    initializeSchedule,
    fetchDashboardData 
  } = useContext(AppContext);

  const [todayTasks, setTodayTasks] = useState([]);
  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const filtered = tasks.filter(task => task.date === today);
    setTodayTasks(filtered);
  }, [tasks]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'DSA': return <Code className="w-4 h-4" />;
      case 'PROJECT': return <Briefcase className="w-4 h-4" />;
      case 'LEARN': return <GraduationCap className="w-4 h-4" />;
      case 'OPS': return <Settings className="w-4 h-4" />;
      case 'APPLY': return <Send className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'DSA': return 'from-purple-500 to-purple-600';
      case 'PROJECT': return 'from-blue-500 to-blue-600';
      case 'LEARN': return 'from-green-500 to-green-600';
      case 'OPS': return 'from-orange-500 to-orange-600';
      case 'APPLY': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'IN_PROGRESS': return <Play className="w-5 h-5 text-yellow-400" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleTaskClick = async (task) => {
    let newStatus;
    if (task.status === 'PENDING') {
      newStatus = 'IN_PROGRESS';
    } else if (task.status === 'IN_PROGRESS') {
      newStatus = 'COMPLETED';
    } else {
      newStatus = 'PENDING';
    }
    
    await updateTaskStatus(task.id, newStatus);
    toast.success(`Task marked as ${newStatus.toLowerCase().replace('_', ' ')}`);
  };

  const handleInitialize = async () => {
    await initializeSchedule();
    toast.success("Schedule initialized successfully!");
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Internship Prep Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleInitialize}
            variant="outline"
            className="border-purple-500/30 hover:bg-purple-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Initialize Schedule
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass border-purple-500/20 hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(dashboardData.overview.overall_completion)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {dashboardData.overview.completed_tasks} / {dashboardData.overview.total_tasks} tasks
                  </div>
                </div>
              </div>
              <Progress 
                value={dashboardData.overview.overall_completion} 
                className="mt-3 h-2"
              />
            </CardContent>
          </Card>

          <Card className="glass border-blue-500/20 hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(dashboardData.today.completion_percentage)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {dashboardData.today.completed_tasks} / {dashboardData.today.total_tasks} today
                  </div>
                </div>
              </div>
              <Progress 
                value={dashboardData.today.completion_percentage} 
                className="mt-3 h-2"
              />
            </CardContent>
          </Card>

          <Card className="glass border-green-500/20 hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Current Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    Week {dashboardData.current_week.week_number}
                  </div>
                  <div className="text-xs text-gray-400">
                    {Math.round(dashboardData.current_week.completion_percentage)}% complete
                  </div>
                </div>
              </div>
              <Progress 
                value={dashboardData.current_week.completion_percentage} 
                className="mt-3 h-2"
              />
            </CardContent>
          </Card>

          <Card className="glass border-orange-500/20 hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Focus Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-orange-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {todayTasks.length}
                  </div>
                  <div className="text-xs text-gray-400">
                    tasks scheduled
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-orange-400">
                +1 hour anime break 🎌
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Today's Tasks */}
      <Card className="glass border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span>Today's Tasks</span>
            <Badge variant="secondary" className="ml-auto">
              {todayTasks.length} tasks
            </Badge>
          </CardTitle>
          <CardDescription>
            Click on tasks to update their status: Pending → In Progress → Completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <Circle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No tasks for today</p>
              <p className="text-sm text-gray-500 mt-1">
                Initialize the schedule to load your tasks
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`
                    task-card glass p-4 rounded-lg cursor-pointer transition-all duration-200
                    ${task.category.toLowerCase()} ${task.status.toLowerCase()}
                    hover:bg-white/5 border border-white/10
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`
                          inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium
                          bg-gradient-to-r ${getCategoryColor(task.category)}
                        `}>
                          {getCategoryIcon(task.category)}
                          <span className="text-white">{task.category}</span>
                        </div>
                        
                        <Badge 
                          variant={task.priority === 3 ? 'destructive' : task.priority === 2 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          P{task.priority}
                        </Badge>
                      </div>
                      
                      <p className={`text-sm ${
                        task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-200'
                      }`}>
                        {task.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Week {task.week_number}</span>
                        <span>{task.phase}</span>
                        {task.completed_at && (
                          <span className="text-green-400">
                            ✓ {new Date(task.completed_at).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-purple-500/20 hover-lift cursor-pointer">
          <CardContent className="p-6 text-center">
            <Code className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">DSA Practice</h3>
            <p className="text-sm text-gray-400">
              Track your daily coding problems
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-blue-500/20 hover-lift cursor-pointer">
          <CardContent className="p-6 text-center">
            <Briefcase className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">Projects</h3>
            <p className="text-sm text-gray-400">
              Build and showcase your work
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-red-500/20 hover-lift cursor-pointer">
          <CardContent className="p-6 text-center">
            <Send className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">Applications</h3>
            <p className="text-sm text-gray-400">
              Track your job applications
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;