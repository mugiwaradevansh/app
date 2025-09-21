import requests
import sys
import json
from datetime import datetime

class InternshipDashboardAPITester:
    def __init__(self, base_url="https://career-tracker-30.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.task_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_initialize_schedule(self):
        """Test schedule initialization"""
        success, response = self.run_test("Initialize Schedule", "POST", "tasks/initialize", 200)
        if success and 'count' in response:
            print(f"   Initialized {response['count']} tasks")
        return success

    def test_get_all_tasks(self):
        """Test getting all tasks"""
        success, response = self.run_test("Get All Tasks", "GET", "tasks", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} tasks")
            if len(response) > 0:
                # Store first task ID for update test
                self.task_id = response[0].get('id')
                print(f"   Sample task: {response[0].get('description', 'N/A')}")
        return success

    def test_get_tasks_with_filters(self):
        """Test getting tasks with various filters"""
        filters = [
            {"category": "DSA"},
            {"status": "PENDING"},
            {"date": "2025-09-22"},
            {"week": 1}
        ]
        
        all_passed = True
        for filter_params in filters:
            filter_name = ", ".join([f"{k}={v}" for k, v in filter_params.items()])
            success, response = self.run_test(f"Get Tasks with Filter ({filter_name})", "GET", "tasks", 200, params=filter_params)
            if success and isinstance(response, list):
                print(f"   Found {len(response)} tasks with filter")
            all_passed = all_passed and success
        
        return all_passed

    def test_update_task_status(self):
        """Test updating task status"""
        if not self.task_id:
            print("❌ No task ID available for update test")
            return False
            
        # Test updating to IN_PROGRESS
        success1, _ = self.run_test("Update Task to IN_PROGRESS", "PUT", f"tasks/{self.task_id}", 200, 
                                   data={"status": "IN_PROGRESS"})
        
        # Test updating to COMPLETED
        success2, _ = self.run_test("Update Task to COMPLETED", "PUT", f"tasks/{self.task_id}", 200, 
                                   data={"status": "COMPLETED"})
        
        return success1 and success2

    def test_dashboard_overview(self):
        """Test dashboard overview endpoint"""
        success, response = self.run_test("Dashboard Overview", "GET", "dashboard/overview", 200)
        if success and isinstance(response, dict):
            overview = response.get('overview', {})
            today = response.get('today', {})
            print(f"   Total tasks: {overview.get('total_tasks', 0)}")
            print(f"   Completed tasks: {overview.get('completed_tasks', 0)}")
            print(f"   Today's tasks: {today.get('total_tasks', 0)}")
        return success

    def test_weekly_progress(self):
        """Test weekly progress endpoint"""
        success, response = self.run_test("Weekly Progress", "GET", "progress/weekly", 200)
        if success and isinstance(response, list):
            print(f"   Found progress data for {len(response)} weeks")
        return success

    def test_daily_progress(self):
        """Test daily progress endpoint"""
        # Test without date (should use today)
        success1, _ = self.run_test("Daily Progress (Today)", "GET", "progress/daily", 200)
        
        # Test with specific date
        success2, response = self.run_test("Daily Progress (Specific Date)", "GET", "progress/daily", 200, 
                                          params={"date": "2025-09-22"})
        if success2 and isinstance(response, dict):
            print(f"   Date: {response.get('date')}")
            print(f"   Tasks: {response.get('total_tasks', 0)}")
            print(f"   Completed: {response.get('completed_tasks', 0)}")
        
        return success1 and success2

    def test_ai_recommendations(self):
        """Test AI recommendations endpoint"""
        success, response = self.run_test("AI Recommendations", "POST", "ai/recommendations", 200,
                                         data={"user_prompt": "What should I focus on today?", "context": "Testing AI integration"})
        if success and isinstance(response, dict):
            recommendations = response.get('recommendations', '')
            print(f"   AI Response length: {len(recommendations)} characters")
            if len(recommendations) > 0:
                print(f"   AI Response preview: {recommendations[:100]}...")
        return success

    def test_ai_recommendations_history(self):
        """Test AI recommendations history endpoint"""
        return self.run_test("AI Recommendations History", "GET", "ai/recommendations/history", 200)

def main():
    print("🚀 Starting Internship Preparation Dashboard API Tests")
    print("=" * 60)
    
    tester = InternshipDashboardAPITester()
    
    # Run all tests in sequence
    test_results = []
    
    # Basic connectivity
    test_results.append(("Root Endpoint", tester.test_root_endpoint()))
    
    # Schedule and tasks
    test_results.append(("Initialize Schedule", tester.test_initialize_schedule()))
    test_results.append(("Get All Tasks", tester.test_get_all_tasks()))
    test_results.append(("Get Tasks with Filters", tester.test_get_tasks_with_filters()))
    test_results.append(("Update Task Status", tester.test_update_task_status()))
    
    # Dashboard and progress
    test_results.append(("Dashboard Overview", tester.test_dashboard_overview()))
    test_results.append(("Weekly Progress", tester.test_weekly_progress()))
    test_results.append(("Daily Progress", tester.test_daily_progress()))
    
    # AI features
    test_results.append(("AI Recommendations", tester.test_ai_recommendations()))
    test_results.append(("AI History", tester.test_ai_recommendations_history()))
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    failed_tests = []
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status} - {test_name}")
        if not passed:
            failed_tests.append(test_name)
    
    print(f"\nTotal Tests: {tester.tests_run}")
    print(f"Passed: {tester.tests_passed}")
    print(f"Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed Tests: {', '.join(failed_tests)}")
        return 1
    else:
        print("\n🎉 All tests passed!")
        return 0

if __name__ == "__main__":
    sys.exit(main())