import requests
import sys
import json
from datetime import datetime

class FounderFundAPITester:
    def __init__(self, base_url="https://founder-pipeline.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data}"
            self.log_test("API Root", success, details)
            return success
        except Exception as e:
            self.log_test("API Root", False, str(e))
            return False

    def test_waitlist_signup_valid(self):
        """Test valid waitlist signup"""
        try:
            test_email = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com"
            payload = {
                "email": test_email,
                "role": "Founder",
                "founder_stage": "MVP",
                "biggest_pain": "Finding relevant investors or startups",
                "detailed_pain": "It's hard to find investors who are interested in my specific industry and stage."
            }
            
            response = requests.post(f"{self.base_url}/waitlist", json=payload, timeout=10)
            success = response.status_code == 201
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                expected_fields = ["id", "email", "role", "created_at", "mailchimp_synced"]
                has_all_fields = all(field in data for field in expected_fields)
                if has_all_fields:
                    details += f", All required fields present"
                else:
                    success = False
                    details += f", Missing fields in response"
            else:
                details += f", Response: {response.text}"
                
            self.log_test("Waitlist Signup (Valid)", success, details)
            return success, test_email if success else None
            
        except Exception as e:
            self.log_test("Waitlist Signup (Valid)", False, str(e))
            return False, None

    def test_waitlist_signup_duplicate(self, email):
        """Test duplicate email rejection"""
        if not email:
            self.log_test("Waitlist Signup (Duplicate)", False, "No email from previous test")
            return False
            
        try:
            payload = {
                "email": email,
                "role": "Investor",
                "funding_stage": "Seed",
                "biggest_pain": "Managing deal flow efficiently"
            }
            
            response = requests.post(f"{self.base_url}/waitlist", json=payload, timeout=10)
            success = response.status_code == 409
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                if "detail" in data:
                    details += f", Error message: {data['detail']}"
            else:
                details += f", Expected 409, got {response.status_code}"
                
            self.log_test("Waitlist Signup (Duplicate)", success, details)
            return success
            
        except Exception as e:
            self.log_test("Waitlist Signup (Duplicate)", False, str(e))
            return False

    def test_waitlist_signup_invalid(self):
        """Test invalid data handling"""
        try:
            # Missing required fields
            payload = {
                "email": "invalid-email",
                "role": ""
            }
            
            response = requests.post(f"{self.base_url}/waitlist", json=payload, timeout=10)
            success = response.status_code in [400, 422]  # Bad request or validation error
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f", Expected 400/422 for invalid data, got {response.status_code}"
                
            self.log_test("Waitlist Signup (Invalid)", success, details)
            return success
            
        except Exception as e:
            self.log_test("Waitlist Signup (Invalid)", False, str(e))
            return False

    def test_waitlist_stats(self):
        """Test waitlist statistics endpoint"""
        try:
            response = requests.get(f"{self.base_url}/waitlist/stats", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                expected_fields = ["total_signups", "founders", "investors", "funds"]
                has_all_fields = all(field in data for field in expected_fields)
                if has_all_fields:
                    details += f", Stats: {data}"
                else:
                    success = False
                    details += f", Missing fields in stats response"
            else:
                details += f", Response: {response.text}"
                
            self.log_test("Waitlist Stats", success, details)
            return success
            
        except Exception as e:
            self.log_test("Waitlist Stats", False, str(e))
            return False

    def test_status_endpoints(self):
        """Test status check endpoints"""
        try:
            # Test POST status
            payload = {"client_name": "test_client"}
            response = requests.post(f"{self.base_url}/status", json=payload, timeout=10)
            post_success = response.status_code == 200
            
            # Test GET status
            response = requests.get(f"{self.base_url}/status", timeout=10)
            get_success = response.status_code == 200
            
            success = post_success and get_success
            details = f"POST: {post_success}, GET: {get_success}"
            
            self.log_test("Status Endpoints", success, details)
            return success
            
        except Exception as e:
            self.log_test("Status Endpoints", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting FounderFund Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("-" * 50)
        
        # Test API connectivity
        if not self.test_api_root():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Test waitlist functionality
        success, test_email = self.test_waitlist_signup_valid()
        if success:
            self.test_waitlist_signup_duplicate(test_email)
        
        self.test_waitlist_signup_invalid()
        self.test_waitlist_stats()
        self.test_status_endpoints()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check details above.")
            return False

def main():
    tester = FounderFundAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())