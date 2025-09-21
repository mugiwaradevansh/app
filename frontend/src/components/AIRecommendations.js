import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../App";
import axios from "axios";
import { 
  Bot, 
  Send, 
  Copy, 
  Sparkles, 
  Brain,
  Target,
  Clock,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  Zap,
  Star,
  Wand2
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIRecommendations = () => {
  const { dashboardData } = useContext(AppContext);
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [aiPromptTemplate, setAiPromptTemplate] = useState(`
You are an AI assistant helping with internship preparation. You analyze daily tasks, progress, and provide focused recommendations for software engineering roles (frontend/backend/fullstack). Be concise and actionable.

Based on my internship preparation progress, provide focused recommendations for today.

Please provide:
1. Top 3 priority tasks for today
2. Focus areas that need attention  
3. Specific actionable recommendations
4. Time management tips

Keep it concise and actionable.
  `.trim());

  useEffect(() => {
    fetchRecommendationHistory();
  }, []);

  const fetchRecommendationHistory = async () => {
    try {
      const response = await axios.get(`${API}/ai/recommendations/history`);
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching recommendation history:", error);
    }
  };

  const handleGetRecommendations = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a question or request");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/ai/recommendations`, {
        user_prompt: prompt,
        context: "dashboard"
      });

      setRecommendations(response.data.recommendations);
      setPrompt("");
      await fetchRecommendationHistory();
      toast.success("AI recommendations generated! ✨", {
        className: "success-glow"
      });
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      toast.error("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPromptTemplate);
    toast.success("Prompt template copied to clipboard! 📋", {
      className: "success-glow"
    });
  };

  const quickPrompts = [
    {
      text: "What should I focus on today?",
      icon: Target,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      text: "How can I improve my DSA skills?",
      icon: Brain,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      text: "Give me project recommendations",
      icon: Lightbulb,
      gradient: "from-green-500 to-green-600"
    },
    {
      text: "Help me plan this week",
      icon: Clock,
      gradient: "from-orange-500 to-orange-600"
    },
    {
      text: "What are my weak areas?",
      icon: Zap,
      gradient: "from-red-500 to-red-600"
    },
    {
      text: "Time management tips for today",
      icon: Star,
      gradient: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="relative">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <div className="flex items-center space-x-3 mt-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">Get personalized recommendations and insights for your preparation</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">AI-Powered</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCopyPrompt}
            className="glass-interactive bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-blue-500/30 text-white font-semibold"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Prompt
          </Button>
          <Button
            onClick={fetchRecommendationHistory}
            className="glass-interactive bg-gradient-to-r from-blue-500/20 to-green-500/20 border-blue-500/30 hover:from-blue-500/30 hover:to-green-500/30 text-white font-semibold"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Chat Interface */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enhanced Quick Actions */}
          <Card className="glass-elevated border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center glow">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Quick Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickPrompts.map((quickPrompt, index) => {
                  const Icon = quickPrompt.icon;
                  return (
                    <Button
                      key={index}
                      onClick={() => setPrompt(quickPrompt.text)}
                      className="glass-interactive text-left justify-start h-auto p-4 border-white/10 hover:border-white/20 relative overflow-hidden group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${quickPrompt.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                      <div className="relative z-10 flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${quickPrompt.gradient} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-left">{quickPrompt.text}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Chat Input */}
          <Card className="glass-elevated border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center glow">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Ask AI Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="glass rounded-2xl p-1">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask me anything about your internship preparation... For example: 'What should I focus on today?' or 'How can I improve my coding skills?'"
                  className="min-h-32 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 resize-none"
                  disabled={loading}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">
                    {prompt.length}/500 characters
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full glow"></div>
                    <span className="text-xs text-green-400 font-medium">AI Ready</span>
                  </div>
                </div>
                <Button
                  onClick={handleGetRecommendations}
                  disabled={loading || !prompt.trim()}
                  className="btn-primary relative overflow-hidden"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      <span>Get Recommendations</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced AI Response */}
          {recommendations && (
            <Card className="ai-response relative overflow-hidden bounce-in">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-green-500/5" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center glow pulse-glow">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">AI Recommendations</span>
                  <Badge className="ml-auto bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 text-green-300 font-bold">
                    Latest
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-100 leading-relaxed font-medium">
                    {recommendations}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-purple-500/20">
                  <Button
                    onClick={() => navigator.clipboard.writeText(recommendations)}
                    className="glass-interactive bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-blue-500/30 text-white font-semibold"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Response
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-8">
          {/* Enhanced Today's Context */}
          {dashboardData && (
            <Card className="glass-elevated border-green-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-3 text-lg font-bold">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center glow">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">Today's Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 glass rounded-2xl">
                    <span className="text-sm text-gray-400 font-medium">Today's Progress</span>
                    <span className="font-bold text-green-400 text-lg">
                      {Math.round(dashboardData.today.completion_percentage)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 glass rounded-2xl">
                    <span className="text-sm text-gray-400 font-medium">Tasks Completed</span>
                    <span className="font-bold text-white text-lg">
                      {dashboardData.today.completed_tasks} / {dashboardData.today.total_tasks}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 glass rounded-2xl">
                    <span className="text-sm text-gray-400 font-medium">Overall Progress</span>
                    <span className="font-bold text-purple-400 text-lg">
                      {Math.round(dashboardData.overview.overall_completion)}%
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-green-500/20">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-green-400" />
                    <p className="text-xs text-gray-400">AI uses this context to provide personalized recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Prompt Template */}
          <Card className="glass-elevated border-gray-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-lg font-bold">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center glow">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">AI Prompt Template</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="glass rounded-2xl p-1">
                <Textarea
                  value={aiPromptTemplate}
                  onChange={(e) => setAiPromptTemplate(e.target.value)}
                  className="min-h-40 text-xs bg-transparent border-none text-gray-300 font-mono resize-none focus:ring-0"
                  placeholder="Edit the AI prompt template..."
                />
              </div>
              <Button
                onClick={handleCopyPrompt}
                className="mt-4 w-full glass-interactive bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30 hover:from-gray-500/30 hover:to-gray-600/30 text-white font-semibold"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Template
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Recent Recommendations */}
          <Card className="glass-elevated border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-lg font-bold">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center glow">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Recent History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-6 glow float">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-300 mb-2">No recommendations yet</p>
                  <p className="text-sm text-gray-500">Ask your first question above</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {history.slice(0, 5).map((item, index) => (
                    <div
                      key={item.id}
                      className="glass-interactive p-4 rounded-2xl cursor-pointer hover:scale-102 transition-all duration-300 relative overflow-hidden group"
                      onClick={() => setRecommendations(item.recommendations[0])}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300 font-bold">
                            {new Date(item.created_at).toLocaleDateString()}
                          </Badge>
                          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                          {item.recommendations[0].substring(0, 120)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;