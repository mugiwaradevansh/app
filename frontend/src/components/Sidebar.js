import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Calendar, 
  BarChart3, 
  Bot, 
  Home, 
  Menu, 
  X,
  Target,
  TrendingUp,
  Sparkles,
  Zap
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: Home,
      description: "Overview & Today's Tasks",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      path: "/calendar",
      name: "Calendar",
      icon: Calendar,
      description: "Schedule View",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      path: "/progress",
      name: "Progress",
      icon: TrendingUp,
      description: "Analytics & KPIs",
      gradient: "from-green-500 to-green-600"
    },
    {
      path: "/ai",
      name: "AI Assistant",
      icon: Bot,
      description: "Smart Recommendations",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <>
      {/* Mobile overlay with blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar with advanced glassmorphism */}
      <div className={`
        fixed left-0 top-0 h-full glass-elevated depth-5
        transition-all duration-500 cubic-bezier(0.23, 1, 0.320, 1) z-50
        ${isOpen ? 'w-72' : 'w-20'}
      `}>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-3xl" />
        
        {/* Header with enhanced styling */}
        <div className="relative flex items-center justify-between p-6 border-b border-white/10">
          {isOpen && (
            <div className="flex items-center space-x-4 fade-in">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center glow">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-black text-white text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  InterPrep
                </h1>
                <p className="text-xs text-gray-400 font-medium">Sep 2025 - May 2026</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 glass-interactive"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation with enhanced styling */}
        <nav className="relative p-6 space-y-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group relative flex items-center space-x-4 p-4 rounded-2xl 
                  transition-all duration-400 cubic-bezier(0.23, 1, 0.320, 1)
                  ${isActive 
                    ? 'glass-blue text-white transform scale-105' 
                    : 'hover:glass-interactive text-gray-300 hover:text-white hover:scale-102'
                  }
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {({ isActive }) => (
                  <>
                    {/* Icon with gradient background */}
                    <div className={`
                      relative w-10 h-10 rounded-xl flex items-center justify-center
                      bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-100
                      transition-all duration-300 group-hover:scale-110
                    `}>
                      <Icon className="w-5 h-5 text-white" />
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {isOpen && (
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm leading-tight">{item.name}</div>
                        <div className="text-xs text-gray-400 truncate mt-1 group-hover:text-gray-300 transition-colors">
                          {item.description}
                        </div>
                      </div>
                    )}

                    {/* Active indicator */}
                    <div className={`
                      absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 
                      bg-gradient-to-b from-purple-400 to-blue-400 rounded-l-full
                      transition-all duration-300
                      ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                    `} />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Enhanced footer */}
        {isOpen && (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass-purple rounded-2xl p-5 relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-400 via-transparent to-blue-400 animate-pulse" />
              </div>
              
              <div className="relative flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center pulse-glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Stay Focused</div>
                  <div className="text-xs text-purple-200 font-medium">Zero weekends off! 🔥</div>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full w-3/4 transition-all duration-1000 ease-out" />
              </div>
              <div className="text-xs text-purple-200 mt-2 text-center">Journey Progress</div>
            </div>
          </div>
        )}

        {/* Floating action button when collapsed */}
        {!isOpen && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center glass-interactive float">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;