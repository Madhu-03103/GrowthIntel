from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from ..core.database import Base


class RoleEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    HR = "HR"
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"


class GrowthLevelEnum(str, enum.Enum):
    HIGH_GROWTH = "HIGH_GROWTH"
    STABLE_GROWTH = "STABLE_GROWTH"
    SLOW_GROWTH = "SLOW_GROWTH"
    DECLINING = "DECLINING"


class RiskLevelEnum(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ReadinessEnum(str, enum.Enum):
    READY = "READY"
    NEAR_READY = "NEAR_READY"
    DEVELOPING = "DEVELOPING"
    HIGH_RISK = "HIGH_RISK"


class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Only define the main relationship
    employees = relationship("Employee", back_populates="department", foreign_keys="Employee.department_id")


class JobRole(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), unique=True, nullable=False, index=True)
    level = Column(Integer, nullable=False)  # 1=Entry, 2=Mid, 3=Senior, 4=Lead, 5=Manager
    description = Column(Text)
    department_id = Column(Integer, ForeignKey("departments.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employees = relationship("Employee", back_populates="role")


class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    department_id = Column(Integer, ForeignKey("departments.id"))
    role_id = Column(Integer, ForeignKey("roles.id"))
    
    joining_date = Column(Date, nullable=False)
    years_of_experience = Column(Float, default=0.0)
    
    # Scores and Metrics
    performance_score = Column(Float, default=0.0)  # 0-100
    skill_score = Column(Float, default=0.0)  # 0-100
    learning_score = Column(Float, default=0.0)  # 0-100
    leadership_score = Column(Float, default=0.0)  # 0-100
    growth_score = Column(Float, default=0.0)  # 0-100
    
    # Growth Intelligence
    promotion_readiness = Column(Float, default=0.0)  # 0-100
    growth_level = Column(Enum(GrowthLevelEnum), default=GrowthLevelEnum.STABLE_GROWTH)
    risk_level = Column(Enum(RiskLevelEnum), default=RiskLevelEnum.LOW)
    
    # System
    user_role = Column(Enum(RoleEnum), default=RoleEnum.EMPLOYEE)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    department = relationship("Department", back_populates="employees", foreign_keys=[department_id])
    role = relationship("JobRole", back_populates="employees")
    skills = relationship("EmployeeSkill", back_populates="employee")
    performance_records = relationship("PerformanceRecord", back_populates="employee")
    learning_records = relationship("LearningRecord", back_populates="employee")
    projects = relationship("Project", back_populates="employee")
    growth_predictions = relationship("GrowthPrediction", back_populates="employee")
    promotion_predictions = relationship("PromotionPrediction", back_populates="employee")
    risk_assessments = relationship("RiskAssessment", back_populates="employee")
    recommendations = relationship("Recommendation", back_populates="employee")
    development_plans = relationship("DevelopmentPlan", back_populates="employee")
    
    # New relationships for real-time features
    notifications = relationship("Notification", back_populates="employee")
    goals = relationship("DevelopmentGoal", foreign_keys="DevelopmentGoal.employee_id", back_populates="employee")
    trainings = relationship("EmployeeTraining", foreign_keys="EmployeeTraining.employee_id", back_populates="employee")
    reviews = relationship("PerformanceReview", foreign_keys="PerformanceReview.employee_id", back_populates="employee")
    promotion_reviews = relationship("PromotionReview", foreign_keys="PromotionReview.employee_id", back_populates="employee")
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
