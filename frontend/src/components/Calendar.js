import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
  Circle,
  Play,
  Sparkles,
  Target,
  Star
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const Calendar = () => {
  const { tasks, updateTaskStatus, fetchTasks } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Get calendar data
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDateLoop = new Date(startDate);
    
    while (currentDateLoop <= lastDay || days.length < 42) {
      days.push(new Date(currentDateLoop));
      currentDateLoop.setDate(currentDateLoop.getDate() + 1);
      
      if (days.length >= 42) break;
    }
    
    return days;
  };

  const getDayTasks = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      const matchesDate = task.date === dateStr;
      const matchesCategory = categoryFilter === "ALL" || task.category === categoryFilter;
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
      return matchesDate && matchesCategory && matchesStatus;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
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
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'DSA': return 'bg-purple-500';
      case 'PROJECT': return 'bg-blue-500';
      case 'LEARN': return 'bg-green-500';
      case 'OPS': return 'bg-orange-500';
      case 'APPLY': return 'bg-red-500';
      default: return 'bg-gray-500';
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
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'IN_PROGRESS': return <Play className="w-4 h-4 text-yellow-400" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const calendarDays = getCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-8 fade-in">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="relative">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Schedule Calendar
          </h1>
          <div className="flex items-center space-x-3 mt-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Visual overview of your internship preparation timeline</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Interactive</span>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="glass rounded-2xl p-1">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36 bg-transparent border-none text-white font-medium">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="glass-elevated border-white/20">
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="DSA">DSA</SelectItem>
                <SelectItem value="PROJECT">Project</SelectItem>
                <SelectItem value="LEARN">Learn</SelectItem>
                <SelectItem value="OPS">Ops</SelectItem>
                <SelectItem value="APPLY">Apply</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="glass rounded-2xl p-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-transparent border-none text-white font-medium">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass-elevated border-white/20">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Calendar View */}
        <div className="lg:col-span-2">
          <Card className="glass-elevated border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-4 text-2xl font-bold">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center glow">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                </CardTitle>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => navigateMonth(-1)}
                    className="glass-interactive w-12 h-12 rounded-2xl p-0 border-white/10 hover:border-white/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => navigateMonth(1)}
                    className="glass-interactive w-12 h-12 rounded-2xl p-0 border-white/10 hover:border-white/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-bold text-gray-400 p-3">
                    {day}
                  </div>
                ))}
              </div>

              {/* Enhanced Calendar grid */}
              <div className="calendar-grid">
                {calendarDays.map((day, index) => {
                  const dayTasks = getDayTasks(day);
                  const hasTasksClass = dayTasks.length > 0 ? 'has-tasks' : '';
                  const todayClass = isToday(day) ? 'today' : '';
                  const currentMonthClass = isCurrentMonth(day) ? '' : 'opacity-40';
                  
                  return (
                    <div
                      key={index}
                      className={`calendar-day ${hasTasksClass} ${todayClass} ${currentMonthClass} bounce-in`}
                      onClick={() => setSelectedDate(day)}
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      <span className="text-sm font-bold relative z-10">{day.getDate()}</span>
                      {dayTasks.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 relative z-10">
                          {dayTasks.slice(0, 4).map((task, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${getCategoryColor(task.category)} ${
                                task.status === 'COMPLETED' ? 'opacity-60' : 'glow'
                              }`}
                            />
                          ))}
                          {dayTasks.length > 4 && (
                            <span className="text-xs text-gray-300 font-bold">+{dayTasks.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Selected Date Tasks */}
        <div className="space-y-6">
          <Card className="glass-elevated border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {selectedDate 
                    ? selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    : 'Select a Date'
                  }
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              {selectedDate ? (
                <div className="space-y-4">
                  {getDayTasks(selectedDate).length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 glow">
                        <CalendarIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-semibold text-gray-300 mb-2">No tasks for this date</p>
                      <p className="text-sm text-gray-500">Try selecting another date</p>
                    </div>
                  ) : (
                    getDayTasks(selectedDate).map((task, index) => (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className="glass-interactive p-4 rounded-2xl cursor-pointer hover:scale-102 transition-all duration-300 relative overflow-hidden group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Task gradient background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(task.category)} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                        
                        <div className="relative z-10 flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                              {getStatusIcon(task.status)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge 
                                className={`text-xs font-bold bg-gradient-to-r ${getCategoryGradient(task.category)} text-white border-none`}
                              >
                                {task.category}
                              </Badge>
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
                            
                            <p className={`text-sm font-medium leading-relaxed ${
                              task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-100'
                            }`}>
                              {task.description}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-3">
                              <div className="flex items-center space-x-1">
                                <Target className="w-3 h-3" />
                                <span>Week {task.week_number}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>{task.phase}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-6 glow float">
                    <CalendarIcon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-300 mb-2">Select a Date</p>
                  <p className="text-sm text-gray-500">Click on any date to view tasks</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Legend */}
          <Card className="glass-elevated border-gray-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-lg font-bold">
                <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span>Category Legend</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-purple-500 glow"></div>
                <span className="text-sm text-gray-200 font-medium">DSA Problems</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-blue-500 glow"></div>
                <span className="text-sm text-gray-200 font-medium">Projects</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-green-500 glow"></div>
                <span className="text-sm text-gray-200 font-medium">Learning</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-orange-500 glow"></div>
                <span className="text-sm text-gray-200 font-medium">DevOps</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-500 glow"></div>
                <span className="text-sm text-gray-200 font-medium">Applications</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;