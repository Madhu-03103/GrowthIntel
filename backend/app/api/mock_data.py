"""Mock data generator for demo purposes"""
import random
from datetime import date, timedelta
from typing import List

# Mock departments
DEPARTMENTS = [
    {"id": 1, "name": "Engineering"},
    {"id": 2, "name": "Product"},
    {"id": 3, "name": "Data Science"},
    {"id": 4, "name": "Sales"},
    {"id": 5, "name": "Marketing"},
]

# Mock roles
ROLES = [
    {"id": 1, "title": "Software Engineer"},
    {"id": 2, "title": "Senior Engineer"},
    {"id": 3, "title": "Product Manager"},
    {"id": 4, "title": "Data Scientist"},
    {"id": 5, "title": "Sales Rep"},
]

FIRST_NAMES = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]

def generate_mock_employees(count: int = 100) -> List[dict]:
    """Generate mock employee data"""
    employees = []
    for i in range(1, count + 1):
        dept = random.choice(DEPARTMENTS)
        role = random.choice(ROLES)
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        
        profile_type = random.choice(["high", "solid", "developing", "risk"])
        
        if profile_type == "high":
            perf, skill, learning, leadership, growth, promo = 90, 85, 85, 80, 88, 85
            growth_level, risk_level = "HIGH_GROWTH", "LOW"
        elif profile_type == "solid":
            perf, skill, learning, leadership, growth, promo = 75, 70, 70, 65, 72, 65
            growth_level, risk_level = "STABLE_GROWTH", "LOW"
        elif profile_type == "developing":
            perf, skill, learning, leadership, growth, promo = 60, 55, 55, 50, 58, 50
            growth_level, risk_level = "SLOW_GROWTH", "MEDIUM"
        else:
            perf, skill, learning, leadership, growth, promo = 45, 40, 40, 35, 42, 30
            growth_level, risk_level = "DECLINING", "HIGH"
        
        employees.append({
            "id": i,
            "employee_id": f"EMP{i:05d}",
            "email": f"{fname.lower()}.{lname.lower()}{i}@company.com",
            "first_name": fname,
            "last_name": lname,
            "full_name": f"{fname} {lname}",
            "department": dept["name"],
            "department_id": dept["id"],
            "role": role["title"],
            "role_id": role["id"],
            "joining_date": str((date.today() - timedelta(days=random.randint(365, 3650)))),
            "years_of_experience": round(random.uniform(1, 15), 1),
            "performance_score": perf,
            "skill_score": skill,
            "learning_score": learning,
            "leadership_score": leadership,
            "growth_score": growth,
            "promotion_readiness": promo,
            "growth_level": growth_level,
            "risk_level": risk_level,
            "is_active": True
        })
    
    return employees

def get_mock_analytics() -> dict:
    """Generate mock analytics overview"""
    return {
        "total_employees": 100,
        "high_performers": 25,
        "at_risk": 15,
        "promotion_ready": 20,
        "avg_growth_score": 72.5,
        "avg_promotion_readiness": 65.0,
        "growth_distribution": {
            "HIGH_GROWTH": 25,
            "STABLE_GROWTH": 40,
            "SLOW_GROWTH": 20,
            "DECLINING": 15
        },
        "risk_distribution": {
            "LOW": 50,
            "MEDIUM": 30,
            "HIGH": 15,
            "CRITICAL": 5
        }
    }

# Cache mock data
MOCK_EMPLOYEES = generate_mock_employees(100)
