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
  Clock,
  Sparkles,
  Zap,
  Star
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

  const getCategoryGradient = (category) => {
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
    toast.success(`Task marked as ${newStatus.toLowerCase().replace('_', ' ')}`, {
      className: "success-glow"
    });
  };

  const handleInitialize = async () => {
    await initializeSchedule();
    toast.success("Schedule initialized successfully! 🚀", {
      className: "success-glow"
    });
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="relative">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Internship Prep Dashboard
          </h1>
          <div className="flex items-center space-x-3 mt-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Premium Journey</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleInitialize}
            className="glass-interactive bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-blue-500/30 text-white font-semibold"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Initialize Schedule
          </Button>
        </div>
      </div>

      {/* Enhanced Overview Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-elevated hover-lift border-purple-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center glow">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-black text-white mb-1">
                    {Math.round(dashboardData.overview.overall_completion)}%
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    {dashboardData.overview.completed_tasks} / {dashboardData.overview.total_tasks} tasks
                  </div>
                  <Progress 
                    value={dashboardData.overview.overall_completion} 
                    className="h-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-elevated hover-lift border-blue-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-400 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center glow">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-black text-white mb-1">
                    {Math.round(dashboardData.today.completion_percentage)}%
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    {dashboardData.today.completed_tasks} / {dashboardData.today.total_tasks} today
                  </div>
                  <Progress 
                    value={dashboardData.today.completion_percentage} 
                    className="h-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-elevated hover-lift border-green-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-400 flex items-center">
                <Target className="w-4 h-4 mr-2 text-green-400" />
                Current Week
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center glow">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-black text-white mb-1">
                    Week {dashboardData.current_week.week_number}
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    {Math.round(dashboardData.current_week.completion_percentage)}% complete
                  </div>
                  <Progress 
                    value={dashboardData.current_week.completion_percentage} 
                    className="h-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-elevated hover-lift border-orange-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-400 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-orange-400" />
                Focus Time
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center glow">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-black text-white mb-1">
                    {todayTasks.length}
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    tasks scheduled
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-medium">+1 hour anime break 🎌</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Today's Tasks */}
      <Card className="glass-elevated border-purple-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-3 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span>Today's Tasks</span>
            <Badge className="ml-auto bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-200">
              {todayTasks.length} tasks
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Click on tasks to update their status: Pending → In Progress → Completed
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          {todayTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 glow">
                <Circle className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-300 mb-2">No tasks for today</p>
              <p className="text-sm text-gray-500">
                Initialize the schedule to load your tasks
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayTasks.map((task, index) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`
                    task-card glass-interactive p-6 rounded-2xl cursor-pointer
                    ${task.category.toLowerCase()} ${task.status.toLowerCase()}
                    relative overflow-hidden group
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Category gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(task.category)} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10 flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        {getStatusIcon(task.status)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`
                          inline-flex items-center space-x-2 px-3 py-2 rounded-2xl text-xs font-bold
                          bg-gradient-to-r ${getCategoryGradient(task.category)} text-white
                          shadow-lg
                        `}>
                          {getCategoryIcon(task.category)}
                          <span>{task.category}</span>
                        </div>
                        
                        <Badge 
                          className={`text-xs font-bold ${
                            task.priority === 3 
                              ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30 text-red-300' 
                              : task.priority === 2 
                                ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-300'
                                : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300'
                          }`}
                        >
                          P{task.priority}
                        </Badge>
                      </div>
                      
                      <p className={`text-base font-medium leading-relaxed ${
                        task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-100'
                      }`}>
                        {task.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 mt-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Target className="w-3 h-3" />
                          <span>Week {task.week_number}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-3 h-3" />
                          <span>{task.phase}</span>
                        </div>
                        {task.completed_at && (
                          <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>✓ {new Date(task.completed_at).toLocaleTimeString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-interactive hover-lift border-purple-500/20 cursor-pointer relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-8 text-center relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 glow float">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-white mb-3 text-lg">DSA Practice</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Track your daily coding problems and algorithm mastery
            </p>
          </CardContent>
        </Card>

        <Card className="glass-interactive hover-lift border-blue-500/20 cursor-pointer relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-8 text-center relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 glow float" style={{ animationDelay: '1s' }}>
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-white mb-3 text-lg">Projects</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Build and showcase your portfolio projects
            </p>
          </CardContent>
        </Card>

        <Card className="glass-interactive hover-lift border-red-500/20 cursor-pointer relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-8 text-center relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 glow float" style={{ animationDelay: '2s' }}>
              <Send className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-white mb-3 text-lg">Applications</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Track and manage your job applications
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;