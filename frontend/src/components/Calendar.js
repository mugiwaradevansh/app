import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
  Circle,
  Play
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
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Schedule Calendar
          </h1>
          <p className="text-gray-400 mt-1">
            Visual overview of your internship preparation timeline
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="DSA">DSA</SelectItem>
              <SelectItem value="PROJECT">Project</SelectItem>
              <SelectItem value="LEARN">Learn</SelectItem>
              <SelectItem value="OPS">Ops</SelectItem>
              <SelectItem value="APPLY">Apply</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card className="glass border-purple-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-purple-400" />
                  <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                </CardTitle>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                    className="border-gray-700 hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                    className="border-gray-700 hover:bg-gray-800"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="calendar-grid">
                {calendarDays.map((day, index) => {
                  const dayTasks = getDayTasks(day);
                  const hasTasksClass = dayTasks.length > 0 ? 'has-tasks' : '';
                  const todayClass = isToday(day) ? 'today' : '';
                  const currentMonthClass = isCurrentMonth(day) ? '' : 'opacity-30';
                  
                  return (
                    <div
                      key={index}
                      className={`calendar-day ${hasTasksClass} ${todayClass} ${currentMonthClass}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <span className="text-sm font-medium">{day.getDate()}</span>
                      {dayTasks.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayTasks.slice(0, 3).map((task, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${getCategoryColor(task.category)} ${
                                task.status === 'COMPLETED' ? 'opacity-50' : ''
                              }`}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <span className="text-xs text-gray-400">+{dayTasks.length - 3}</span>
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

        {/* Selected Date Tasks */}
        <div>
          <Card className="glass border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate 
                  ? selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : 'Select a Date'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-3">
                  {getDayTasks(selectedDate).length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No tasks for this date</p>
                    </div>
                  ) : (
                    getDayTasks(selectedDate).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className="glass p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors border border-white/10"
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {getStatusIcon(task.status)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getCategoryColor(task.category)} text-white`}
                              >
                                {task.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                P{task.priority}
                              </Badge>
                            </div>
                            
                            <p className={`text-sm ${
                              task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-200'
                            }`}>
                              {task.description}
                            </p>
                            
                            <div className="text-xs text-gray-500 mt-1">
                              Week {task.week_number} • {task.phase}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Click on a date to view tasks</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="glass border-gray-500/20 mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Category Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-300">DSA Problems</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-300">Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-300">Learning</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-300">DevOps</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-300">Applications</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;