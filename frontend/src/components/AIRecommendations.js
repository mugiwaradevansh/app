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
  CheckCircle
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
      toast.success("AI recommendations generated!");
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      toast.error("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPromptTemplate);
    toast.success("Prompt template copied to clipboard!");
  };

  const quickPrompts = [
    "What should I focus on today?",
    "How can I improve my DSA skills?",
    "Give me project recommendations",
    "Help me plan this week",
    "What are my weak areas?",
    "Time management tips for today"
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-gray-400 mt-1">
            Get personalized recommendations and insights for your preparation
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCopyPrompt}
            variant="outline"
            className="border-purple-500/30 hover:bg-purple-500/10"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Prompt
          </Button>
          <Button
            onClick={fetchRecommendationHistory}
            variant="outline"
            className="border-blue-500/30 hover:bg-blue-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chat Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="glass border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Quick Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickPrompts.map((quickPrompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto p-3 border-gray-700 hover:bg-purple-500/10 hover:border-purple-500/30"
                    onClick={() => setPrompt(quickPrompt)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{quickPrompt}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Input */}
          <Card className="glass border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span>Ask AI Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me anything about your internship preparation... For example: 'What should I focus on today?' or 'How can I improve my coding skills?'"
                className="min-h-24 bg-gray-800 border-gray-700 focus:border-blue-500"
                disabled={loading}
              />
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {prompt.length}/500 characters
                </div>
                <Button
                  onClick={handleGetRecommendations}
                  disabled={loading || !prompt.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Response */}
          {recommendations && (
            <Card className="ai-response">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <span>AI Recommendations</span>
                  <Badge variant="secondary" className="ml-auto bg-purple-500/20 text-purple-300">
                    Latest
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                    {recommendations}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(recommendations)}
                    className="border-purple-500/30 hover:bg-purple-500/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Response
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Context */}
          {dashboardData && (
            <Card className="glass border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Target className="w-5 h-5 text-green-400" />
                  <span>Today's Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Today's Progress</span>
                    <span className="font-semibold text-green-400">
                      {Math.round(dashboardData.today.completion_percentage)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Tasks Completed</span>
                    <span className="font-semibold text-white">
                      {dashboardData.today.completed_tasks} / {dashboardData.today.total_tasks}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Overall Progress</span>
                    <span className="font-semibold text-purple-400">
                      {Math.round(dashboardData.overview.overall_completion)}%
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-green-500/20">
                  <p className="text-xs text-gray-400 mb-2">AI uses this context to provide personalized recommendations</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prompt Template */}
          <Card className="glass border-gray-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Brain className="w-5 h-5 text-gray-400" />
                <span>AI Prompt Template</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={aiPromptTemplate}
                onChange={(e) => setAiPromptTemplate(e.target.value)}
                className="min-h-32 text-xs bg-gray-800 border-gray-700 font-mono"
                placeholder="Edit the AI prompt template..."
              />
              <Button
                onClick={handleCopyPrompt}
                variant="outline"
                size="sm"
                className="mt-3 w-full border-gray-700 hover:bg-gray-800"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Template
              </Button>
            </CardContent>
          </Card>

          {/* Recent Recommendations */}
          <Card className="glass border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Recent History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">No recommendations yet</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Ask your first question above
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {history.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer"
                      onClick={() => setRecommendations(item.recommendations[0])}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {new Date(item.created_at).toLocaleDateString()}
                        </Badge>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-3">
                        {item.recommendations[0].substring(0, 100)}...
                      </p>
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