from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import re
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Internship Prep Dashboard API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums for task categories
class TaskCategory(str, Enum):
    DSA = "DSA"
    PROJECT = "PROJECT"
    LEARN = "LEARN"
    OPS = "OPS"
    APPLY = "APPLY"

class TaskStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    IN_PROGRESS = "IN_PROGRESS"

# Models
class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    category: TaskCategory
    description: str
    status: TaskStatus = TaskStatus.PENDING
    week_number: int
    phase: str
    priority: int = 1
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class TaskCreate(BaseModel):
    date: str
    category: TaskCategory
    description: str
    week_number: int
    phase: str
    priority: int = 1

class TaskUpdate(BaseModel):
    status: Optional[TaskStatus] = None
    description: Optional[str] = None
    priority: Optional[int] = None

class WeeklyProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    week_number: int
    phase: str
    start_date: str
    end_date: str
    dsa_completed: int = 0
    projects_completed: int = 0
    applications_sent: int = 0
    certifications_earned: int = 0
    total_tasks: int = 0
    completed_tasks: int = 0
    completion_percentage: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AIRecommendation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    recommendations: List[str]
    focus_areas: List[str]
    priority_tasks: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AIPromptRequest(BaseModel):
    user_prompt: str
    context: Optional[str] = None

# Initialize LLM Chat
llm_chat = LlmChat(
    api_key=os.environ.get('EMERGENT_LLM_KEY'),
    session_id="internship-prep-dashboard",
    system_message="You are an AI assistant helping with internship preparation. You analyze daily tasks, progress, and provide focused recommendations for software engineering roles (frontend/backend/fullstack). Be concise and actionable."
).with_model("openai", "gpt-4o-mini")

# Markdown Schedule Parser
class ScheduleParser:
    @staticmethod
    def parse_schedule_data():
        """Parse the markdown schedule and create tasks"""
        # This represents the parsed schedule data from the markdown file
        # Phase 1: September 2025 - October 2025 (detailed)
        schedule_data = [
            # Week 1: Sep 22 - Sep 28
            {"date": "2025-09-22", "week": 1, "phase": "Launch & Foundation", "category": "DSA", "description": "2 Easy problems (arrays, strings)", "priority": 2},
            {"date": "2025-09-22", "week": 1, "phase": "Launch & Foundation", "category": "PROJECT", "description": "Create portfolio-2026 repo; scaffold Next.js/React app", "priority": 3},
            {"date": "2025-09-22", "week": 1, "phase": "Launch & Foundation", "category": "LEARN", "description": "Oracle portal & voucher claim", "priority": 1},
            {"date": "2025-09-22", "week": 1, "phase": "Launch & Foundation", "category": "OPS", "description": "Install Docker; docker run hello-world", "priority": 2},
            {"date": "2025-09-22", "week": 1, "phase": "Launch & Foundation", "category": "APPLY", "description": "5 apps; 10 LinkedIn messages", "priority": 3},
            
            {"date": "2025-09-23", "week": 1, "phase": "Launch & Foundation", "category": "DSA", "description": "2 Easy problems (hashmap)", "priority": 2},
            {"date": "2025-09-23", "week": 1, "phase": "Launch & Foundation", "category": "PROJECT", "description": "Build homepage + nav; push commit", "priority": 3},
            {"date": "2025-09-23", "week": 1, "phase": "Launch & Foundation", "category": "LEARN", "description": "React hooks (useState, useEffect)", "priority": 2},
            {"date": "2025-09-23", "week": 1, "phase": "Launch & Foundation", "category": "OPS", "description": "Dockerfile: backend skeleton", "priority": 2},
            {"date": "2025-09-23", "week": 1, "phase": "Launch & Foundation", "category": "APPLY", "description": "5 apps/follow-ups", "priority": 3},
            
            {"date": "2025-09-24", "week": 1, "phase": "Launch & Foundation", "category": "DSA", "description": "1 Medium (two-pointer), 1 Easy (string)", "priority": 2},
            {"date": "2025-09-24", "week": 1, "phase": "Launch & Foundation", "category": "PROJECT", "description": "Implement simple TODO UI", "priority": 3},
            {"date": "2025-09-24", "week": 1, "phase": "Launch & Foundation", "category": "LEARN", "description": "JavaScript ES6 features", "priority": 2},
            {"date": "2025-09-24", "week": 1, "phase": "Launch & Foundation", "category": "OPS", "description": "Setup GitHub Actions (CI)", "priority": 2},
            {"date": "2025-09-24", "week": 1, "phase": "Launch & Foundation", "category": "APPLY", "description": "5 LinkedIn / 2 apps", "priority": 3},
            
            # Week 2: Sep 29 - Oct 5
            {"date": "2025-09-29", "week": 2, "phase": "Launch & Foundation", "category": "DSA", "description": "2 Medium problems", "priority": 2},
            {"date": "2025-09-29", "week": 2, "phase": "Launch & Foundation", "category": "PROJECT", "description": "Implement user signup endpoint", "priority": 3},
            {"date": "2025-09-29", "week": 2, "phase": "Launch & Foundation", "category": "LEARN", "description": "OCI Foundations module 1", "priority": 1},
            {"date": "2025-09-29", "week": 2, "phase": "Launch & Foundation", "category": "OPS", "description": "Test DB migrations; seed data", "priority": 2},
            {"date": "2025-09-29", "week": 2, "phase": "Launch & Foundation", "category": "APPLY", "description": "5 applications", "priority": 3},
            
            {"date": "2025-09-30", "week": 2, "phase": "Launch & Foundation", "category": "DSA", "description": "2 Easy + 1 Medium", "priority": 2},
            {"date": "2025-09-30", "week": 2, "phase": "Launch & Foundation", "category": "PROJECT", "description": "Build login flow (JWT)", "priority": 3},
            {"date": "2025-09-30", "week": 2, "phase": "Launch & Foundation", "category": "LEARN", "description": "SQL indexing", "priority": 2},
            {"date": "2025-09-30", "week": 2, "phase": "Launch & Foundation", "category": "OPS", "description": "Configure GitHub Actions secret", "priority": 2},
            {"date": "2025-09-30", "week": 2, "phase": "Launch & Foundation", "category": "APPLY", "description": "5 apps / 5 LinkedIn messages", "priority": 3},
            
            # Additional weeks can be added here...
        ]
        
        return schedule_data

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Internship Prep Dashboard API"}

@api_router.post("/tasks/initialize")
async def initialize_schedule():
    """Initialize the schedule from markdown data"""
    try:
        # Clear existing tasks
        await db.tasks.delete_many({})
        
        # Parse and insert schedule data
        schedule_data = ScheduleParser.parse_schedule_data()
        tasks = []
        
        for item in schedule_data:
            task = Task(
                date=item["date"],
                category=TaskCategory(item["category"]),
                description=item["description"],
                week_number=item["week"],
                phase=item["phase"],
                priority=item["priority"]
            )
            tasks.append(task.dict())
        
        if tasks:
            await db.tasks.insert_many(tasks)
        
        return {"message": f"Initialized {len(tasks)} tasks", "count": len(tasks)}
    except Exception as e:
        logging.error(f"Error initializing schedule: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/tasks", response_model=List[Task])
async def get_tasks(
    category: Optional[TaskCategory] = None,
    status: Optional[TaskStatus] = None,
    week: Optional[int] = None,
    date: Optional[str] = None
):
    """Get tasks with optional filters"""
    try:
        query = {}
        if category:
            query["category"] = category
        if status:
            query["status"] = status
        if week:
            query["week_number"] = week
        if date:
            query["date"] = date
            
        tasks = await db.tasks.find(query).sort("date", 1).to_list(1000)
        return [Task(**task) for task in tasks]
    except Exception as e:
        logging.error(f"Error fetching tasks: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task_update: TaskUpdate):
    """Update a task"""
    try:
        update_data = {k: v for k, v in task_update.dict().items() if v is not None}
        
        if task_update.status == TaskStatus.COMPLETED:
            update_data["completed_at"] = datetime.now(timezone.utc)
        elif task_update.status in [TaskStatus.PENDING, TaskStatus.IN_PROGRESS]:
            update_data["completed_at"] = None
            
        result = await db.tasks.update_one(
            {"id": task_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
            
        updated_task = await db.tasks.find_one({"id": task_id})
        return Task(**updated_task)
    except Exception as e:
        logging.error(f"Error updating task: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/progress/weekly")
async def get_weekly_progress():
    """Get weekly progress statistics"""
    try:
        # Aggregate progress data by week
        pipeline = [
            {
                "$group": {
                    "_id": {"week": "$week_number", "phase": "$phase"},
                    "total_tasks": {"$sum": 1},
                    "completed_tasks": {"$sum": {"$cond": [{"$eq": ["$status", "COMPLETED"]}, 1, 0]}},
                    "dsa_completed": {"$sum": {"$cond": [{"$and": [{"$eq": ["$category", "DSA"]}, {"$eq": ["$status", "COMPLETED"]}]}, 1, 0]}},
                    "projects_completed": {"$sum": {"$cond": [{"$and": [{"$eq": ["$category", "PROJECT"]}, {"$eq": ["$status", "COMPLETED"]}]}, 1, 0]}},
                    "applications_sent": {"$sum": {"$cond": [{"$and": [{"$eq": ["$category", "APPLY"]}, {"$eq": ["$status", "COMPLETED"]}]}, 1, 0]}},
                }
            },
            {
                "$project": {
                    "week_number": "$_id.week",
                    "phase": "$_id.phase",
                    "total_tasks": 1,
                    "completed_tasks": 1,
                    "dsa_completed": 1,
                    "projects_completed": 1,
                    "applications_sent": 1,
                    "completion_percentage": {"$multiply": [{"$divide": ["$completed_tasks", "$total_tasks"]}, 100]},
                    "_id": 0
                }
            },
            {"$sort": {"week_number": 1}}
        ]
        
        progress_data = await db.tasks.aggregate(pipeline).to_list(100)
        return progress_data
    except Exception as e:
        logging.error(f"Error fetching weekly progress: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/progress/daily")
async def get_daily_progress(date: Optional[str] = None):
    """Get daily progress for a specific date or today"""
    try:
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
            
        # Get tasks for the date
        tasks = await db.tasks.find({"date": date}).to_list(100)
        
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t["status"] == "COMPLETED"])
        
        category_stats = {}
        for task in tasks:
            category = task["category"]
            if category not in category_stats:
                category_stats[category] = {"total": 0, "completed": 0}
            category_stats[category]["total"] += 1
            if task["status"] == "COMPLETED":
                category_stats[category]["completed"] += 1
        
        return {
            "date": date,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_percentage": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
            "category_stats": category_stats,
            "tasks": [Task(**task) for task in tasks]
        }
    except Exception as e:
        logging.error(f"Error fetching daily progress: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/recommendations")
async def get_ai_recommendations(request: AIPromptRequest):
    """Get AI-powered daily focus recommendations"""
    try:
        # Get today's tasks for context
        today = datetime.now().strftime("%Y-%m-%d")
        tasks = await db.tasks.find({"date": today}).to_list(100)
        
        # Build context
        context = f"Today's tasks ({today}):\n"
        for task in tasks:
            status_emoji = "✅" if task["status"] == "COMPLETED" else "⏳" if task["status"] == "IN_PROGRESS" else "❌"
            context += f"{status_emoji} {task['category']}: {task['description']}\n"
        
        # Create user message
        prompt = f"""Based on my internship preparation progress, provide focused recommendations for today.

Context: {context}

User question/request: {request.user_prompt}

Please provide:
1. Top 3 priority tasks for today
2. Focus areas that need attention
3. Specific actionable recommendations
4. Time management tips

Keep it concise and actionable."""

        user_message = UserMessage(text=prompt)
        response = await llm_chat.send_message(user_message)
        
        # Parse response into structured format
        recommendations_text = response.strip()
        
        # Save AI recommendation
        ai_rec = AIRecommendation(
            date=today,
            recommendations=[recommendations_text],
            focus_areas=["DSA", "Projects", "Applications"],  # Could be parsed from response
            priority_tasks=["Complete daily DSA", "Work on portfolio", "Send applications"]  # Could be parsed
        )
        
        await db.ai_recommendations.insert_one(ai_rec.dict())
        
        return {
            "date": today,
            "recommendations": recommendations_text,
            "context_used": context
        }
    except Exception as e:
        logging.error(f"Error generating AI recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/ai/recommendations/history")
async def get_ai_recommendations_history(limit: int = 10):
    """Get historical AI recommendations"""
    try:
        recommendations = await db.ai_recommendations.find().sort("created_at", -1).limit(limit).to_list(limit)
        return [AIRecommendation(**rec) for rec in recommendations]
    except Exception as e:
        logging.error(f"Error fetching AI recommendations history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/dashboard/overview")
async def get_dashboard_overview():
    """Get comprehensive dashboard overview"""
    try:
        # Get overall stats
        total_tasks = await db.tasks.count_documents({})
        completed_tasks = await db.tasks.count_documents({"status": "COMPLETED"})
        
        # Get today's progress
        today = datetime.now().strftime("%Y-%m-%d")
        today_tasks = await db.tasks.find({"date": today}).to_list(100)
        today_completed = len([t for t in today_tasks if t["status"] == "COMPLETED"])
        
        # Get weekly progress
        current_week = 1  # Could be calculated based on current date
        week_tasks = await db.tasks.find({"week_number": current_week}).to_list(100)
        week_completed = len([t for t in week_tasks if t["status"] == "COMPLETED"])
        
        # Get category distribution
        category_pipeline = [
            {"$group": {
                "_id": "$category",
                "total": {"$sum": 1},
                "completed": {"$sum": {"$cond": [{"$eq": ["$status", "COMPLETED"]}, 1, 0]}}
            }}
        ]
        category_stats = await db.tasks.aggregate(category_pipeline).to_list(10)
        
        return {
            "overview": {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "overall_completion": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
            },
            "today": {
                "date": today,
                "total_tasks": len(today_tasks),
                "completed_tasks": today_completed,
                "completion_percentage": (today_completed / len(today_tasks) * 100) if today_tasks else 0,
                "tasks": [Task(**task) for task in today_tasks]
            },
            "current_week": {
                "week_number": current_week,
                "total_tasks": len(week_tasks),
                "completed_tasks": week_completed,
                "completion_percentage": (week_completed / len(week_tasks) * 100) if week_tasks else 0
            },
            "category_distribution": category_stats
        }
    except Exception as e:
        logging.error(f"Error fetching dashboard overview: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()