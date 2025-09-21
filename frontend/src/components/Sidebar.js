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
  TrendingUp
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: Home,
      description: "Overview & Today's Tasks"
    },
    {
      path: "/calendar",
      name: "Calendar",
      icon: Calendar,
      description: "Schedule View"
    },
    {
      path: "/progress",
      name: "Progress",
      icon: TrendingUp,
      description: "Analytics & KPIs"
    },
    {
      path: "/ai",
      name: "AI Assistant",
      icon: Bot,
      description: "Recommendations"
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-xl border-r border-purple-500/20
        transition-all duration-300 z-50
        ${isOpen ? 'w-64' : 'w-16'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          {isOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg">InterPrep</h1>
                <p className="text-xs text-gray-400">Sep 2025 - May 2026</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white' 
                    : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <div className="min-w-0">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {item.description}
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">Stay Focused</div>
                  <div className="text-xs text-gray-400">Zero weekends off!</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;