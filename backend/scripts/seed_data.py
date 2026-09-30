"""
Seed database with demo data for Employee Growth Intelligence System
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta, date
import random
from app.core.database import SessionLocal, init_db
from app.core.security import get_password_hash
from app.models import (
    Employee, Department, JobRole, Skill, EmployeeSkill,
    PerformanceRecord, LearningRecord, Project,
    GrowthPrediction, PromotionPrediction, RiskAssessment,
    Recommendation, DevelopmentPlan,
    RoleEnum, GrowthLevelEnum, RiskLevelEnum, ReadinessEnum,
    SkillCategoryEnum, ProficiencyEnum, PredictionStatusEnum
)

def seed_departments(db):
    """Create departments"""
    departments_data = [
        {"name": "Engineering", "description": "Software development and engineering"},
        {"name": "Product", "description": "Product management and design"},
        {"name": "Data Science", "description": "Data analytics and ML"},
        {"name": "Sales", "description": "Sales and business development"},
        {"name": "Marketing", "description": "Marketing and communications"},
        {"name": "HR", "description": "Human resources"},
        {"name": "Finance", "description": "Finance and accounting"},
        {"name": "Operations", "description": "Operations and support"}
    ]
    
    departments = []
    for dept_data in departments_data:
        dept = Department(**dept_data)
        db.add(dept)
        departments.append(dept)
    
    db.commit()
    print(f"Created {len(departments)} departments")
    return departments


def seed_roles(db, departments):
    """Create job roles"""
    roles_data = [
        # Engineering
        {"title": "Junior Developer", "level": 1, "department_id": 1},
        {"title": "Software Engineer", "level": 2, "department_id": 1},
        {"title": "Senior Software Engineer", "level": 3, "department_id": 1},
        {"title": "Lead Engineer", "level": 4, "department_id": 1},
        {"title": "Engineering Manager", "level": 5, "department_id": 1},
        
        # Data Science
        {"title": "Data Analyst", "level": 2, "department_id": 3},
        {"title": "Senior Data Analyst", "level": 3, "department_id": 3},
        {"title": "Data Scientist", "level": 3, "department_id": 3},
        {"title": "Senior Data Scientist", "level": 4, "department_id": 3},
        {"title": "ML Engineer", "level": 3, "department_id": 3},
        
        # Product
        {"title": "Associate Product Manager", "level": 2, "department_id": 2},
        {"title": "Product Manager", "level": 3, "department_id": 2},
        {"title": "Senior Product Manager", "level": 4, "department_id": 2},
        {"title": "Product Lead", "level": 5, "department_id": 2},
        
        # Other roles
        {"title": "Sales Representative", "level": 2, "department_id": 4},
        {"title": "Senior Sales Rep", "level": 3, "department_id": 4},
        {"title": "Marketing Specialist", "level": 2, "department_id": 5},
        {"title": "HR Specialist", "level": 2, "department_id": 6},
        {"title": "Financial Analyst", "level": 2, "department_id": 7},
        {"title": "Operations Coordinator", "level": 2, "department_id": 8}
    ]
    
    roles = []
    for role_data in roles_data:
        role = JobRole(**role_data)
        db.add(role)
        roles.append(role)
    
    db.commit()
    print(f"Created {len(roles)} job roles")
    return roles


def seed_skills(db):
    """Create skill catalog"""
    skills_data = [
        # Technical
        {"name": "Python", "category": SkillCategoryEnum.TECHNICAL},
        {"name": "JavaScript", "category": SkillCategoryEnum.TECHNICAL},
        {"name": "Java", "category": SkillCategoryEnum.TECHNICAL},
        {"name": "SQL", "category": SkillCategoryEnum.TECHNICAL},
        {"name": "React", "category": SkillCategoryEnum.TECHNICAL},
        {"name": "Node.js", "category": SkillCategoryEnum.TECHNICAL},
        {"name": "Machine Learning", "category": SkillCategoryEnum.TECHNICAL},
        {"name": "Data Visualization", "category": SkillCategoryEnum.TECHNICAL},
        {"name": "Cloud (AWS/Azure)", "category": SkillCategoryEnum.TECHNICAL},
        {"name": "Docker", "category": SkillCategoryEnum.TECHNICAL},
        
        # Soft Skills
        {"name": "Communication", "category": SkillCategoryEnum.SOFT_SKILL},
        {"name": "Problem Solving", "category": SkillCategoryEnum.SOFT_SKILL},
        {"name": "Collaboration", "category": SkillCategoryEnum.SOFT_SKILL},
        {"name": "Time Management", "category": SkillCategoryEnum.SOFT_SKILL},
        {"name": "Critical Thinking", "category": SkillCategoryEnum.SOFT_SKILL},
        
        # Leadership
        {"name": "Team Leadership", "category": SkillCategoryEnum.LEADERSHIP},
        {"name": "Mentoring", "category": SkillCategoryEnum.LEADERSHIP},
        {"name": "Strategic Planning", "category": SkillCategoryEnum.LEADERSHIP},
        {"name": "Conflict Resolution", "category": SkillCategoryEnum.LEADERSHIP},
        
        # Domain
        {"name": "Agile Methodologies", "category": SkillCategoryEnum.DOMAIN},
        {"name": "Product Strategy", "category": SkillCategoryEnum.DOMAIN},
        {"name": "Data Analysis", "category": SkillCategoryEnum.DOMAIN},
        {"name": "Statistics", "category": SkillCategoryEnum.DOMAIN}
    ]
    
    skills = []
    for skill_data in skills_data:
        skill = Skill(**skill_data)
        db.add(skill)
        skills.append(skill)
    
    db.commit()
    print(f"Created {len(skills)} skills")
    return skills


def seed_employees(db, departments, roles):
    """Create employees with varied profiles"""
    first_names = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", 
                   "James", "Maria", "William", "Jennifer", "Richard", "Linda", "Thomas",
                   "Patricia", "Charles", "Elizabeth", "Daniel", "Barbara", "Matthew", "Susan"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", 
                  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson",
                  "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson"]
    
    employees = []
    
    # Create admin user
    admin = Employee(
        employee_id="EMP00001",
        email="admin@company.com",
        hashed_password=get_password_hash("admin123"),
        first_name="Admin",
        last_name="User",
        department_id=6,
        role_id=18,
        joining_date=date(2020, 1, 1),
        years_of_experience=8.0,
        performance_score=95.0,
        skill_score=90.0,
        learning_score=85.0,
        leadership_score=92.0,
        growth_score=90.5,
        promotion_readiness=88.0,
        growth_level=GrowthLevelEnum.HIGH_GROWTH,
        risk_level=RiskLevelEnum.LOW,
        user_role=RoleEnum.ADMIN
    )
    db.add(admin)
    employees.append(admin)
    
    # Create diverse employee profiles
    for i in range(2, 502):
        emp_id = f"EMP{i:05d}"
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        email = f"{fname.lower()}.{lname.lower()}{i}@company.com"
        
        dept = random.choice(departments)
        dept_roles = [r for r in roles if r.department_id == dept.id]
        role = random.choice(dept_roles) if dept_roles else random.choice(roles)
        
        years_exp = random.uniform(0.5, 15.0)
        joining_date = datetime.now().date() - timedelta(days=int(years_exp * 365))
        
        # Create varied performance profiles
        profile_type = random.choice(["high_performer", "solid_performer", "developing", "at_risk"])
        
        if profile_type == "high_performer":
            perf = random.uniform(85, 98)
            skill = random.uniform(80, 95)
            learning = random.uniform(75, 95)
            leadership = random.uniform(70, 90)
            growth = random.uniform(80, 95)
            promotion = random.uniform(75, 95)
            growth_level = GrowthLevelEnum.HIGH_GROWTH
            risk_level = RiskLevelEnum.LOW
        elif profile_type == "solid_performer":
            perf = random.uniform(70, 84)
            skill = random.uniform(65, 79)
            learning = random.uniform(60, 80)
            leadership = random.uniform(55, 75)
            growth = random.uniform(65, 79)
            promotion = random.uniform(55, 74)
            growth_level = GrowthLevelEnum.STABLE_GROWTH
            risk_level = RiskLevelEnum.LOW
        elif profile_type == "developing":
            perf = random.uniform(55, 69)
            skill = random.uniform(50, 64)
            learning = random.uniform(45, 65)
            leadership = random.uniform(40, 60)
            growth = random.uniform(50, 64)
            promotion = random.uniform(35, 54)
            growth_level = GrowthLevelEnum.SLOW_GROWTH
            risk_level = RiskLevelEnum.MEDIUM
        else:  # at_risk
            perf = random.uniform(35, 54)
            skill = random.uniform(35, 49)
            learning = random.uniform(25, 45)
            leadership = random.uniform(25, 45)
            growth = random.uniform(30, 49)
            promotion = random.uniform(20, 34)
            growth_level = GrowthLevelEnum.DECLINING
            risk_level = random.choice([RiskLevelEnum.HIGH, RiskLevelEnum.CRITICAL])
        
        user_role = RoleEnum.HR if i % 50 == 0 else RoleEnum.MANAGER if i % 20 == 0 else RoleEnum.EMPLOYEE
        
        employee = Employee(
            employee_id=emp_id,
            email=email,
            hashed_password=get_password_hash("password123"),
            first_name=fname,
            last_name=lname,
            department_id=dept.id,
            role_id=role.id,
            joining_date=joining_date,
            years_of_experience=round(years_exp, 1),
            performance_score=round(perf, 1),
            skill_score=round(skill, 1),
            learning_score=round(learning, 1),
            leadership_score=round(leadership, 1),
            growth_score=round(growth, 1),
            promotion_readiness=round(promotion, 1),
            growth_level=growth_level,
            risk_level=risk_level,
            user_role=user_role
        )
        db.add(employee)
        employees.append(employee)
        
        if i % 100 == 0:
            db.commit()
            print(f"  Created {i} employees...")
    
    db.commit()
    print(f"Created {len(employees)} employees")
    return employees


def seed_predictions(db, employees):
    """Create predictions for employees"""
    count = 0
    for emp in employees[:200]:  # Add predictions for subset
        # Growth prediction
        growth_pred = GrowthPrediction(
            employee_id=emp.id,
            growth_score=emp.growth_score,
            growth_category=emp.growth_level.value,
            confidence_score=random.uniform(75, 95),
            feature_contributions={"performance": 0.3, "skills": 0.25, "learning": 0.25, "leadership": 0.2},
            positive_factors=[
                {"Performance": round(emp.performance_score * 0.3, 1)},
                {"Skills": round(emp.skill_score * 0.25, 1)}
            ],
            negative_factors=[
                {"Experience Gap": -5.2}
            ] if emp.years_of_experience < 3 else [],
            model_version="v1.0",
            status=PredictionStatusEnum.CURRENT
        )
        db.add(growth_pred)
        
        # Promotion prediction
        readiness_cat = "READY" if emp.promotion_readiness >= 75 else "NEAR_READY" if emp.promotion_readiness >= 60 else "DEVELOPING" if emp.promotion_readiness >= 40 else "HIGH_RISK"
        
        promo_pred = PromotionPrediction(
            employee_id=emp.id,
            promotion_probability=emp.promotion_readiness,
            readiness_category=readiness_cat,
            confidence_score=random.uniform(70, 90),
            feature_contributions={"performance": 0.25, "skills": 0.25, "learning": 0.2, "leadership": 0.3},
            positive_factors=[
                {"Performance": round(emp.performance_score * 0.25, 1)},
                {"Leadership": round(emp.leadership_score * 0.3, 1)}
            ],
            negative_factors=[],
            estimated_timeline_months=random.randint(6, 24) if emp.promotion_readiness > 50 else None,
            model_version="v1.0",
            status=PredictionStatusEnum.CURRENT
        )
        db.add(promo_pred)
        
        count += 2
        
        if count % 100 == 0:
            db.commit()
    
    db.commit()
    print(f"Created predictions for {len(employees[:200])} employees")


def main():
    """Main seeding function"""
    print("Starting database seed...")
    print("=" * 60)
    
    # Initialize database
    init_db()
    db = SessionLocal()
    
    try:
        # Seed data
        departments = seed_departments(db)
        roles = seed_roles(db, departments)
        skills = seed_skills(db)
        employees = seed_employees(db, departments, roles)
        seed_predictions(db, employees)
        
        print("=" * 60)
        print("Database seeding completed successfully!")
        print(f"\nSummary:")
        print(f"   Departments: {len(departments)}")
        print(f"   Roles: {len(roles)}")
        print(f"   Skills: {len(skills)}")
        print(f"   Employees: {len(employees)}")
        print(f"\nDemo Credentials:")
        print(f"   Admin: admin@company.com / admin123")
        print(f"   Employee: Any generated email / password123")
        
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
