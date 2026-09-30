from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, Text, JSON, Enum, String
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class PredictionStatusEnum(str, enum.Enum):
    CURRENT = "CURRENT"
    HISTORICAL = "HISTORICAL"
    SIMULATED = "SIMULATED"


class GrowthPrediction(Base):
    __tablename__ = "growth_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    
    growth_score = Column(Float, nullable=False)  # 0-100
    growth_category = Column(String(50), nullable=False)
    confidence_score = Column(Float, default=0.0)
    
    # Feature Contributions (SHAP values)
    feature_contributions = Column(JSON)  # {"performance": 18.5, "learning": 12.3, ...}
    
    # Top positive and negative factors
    positive_factors = Column(JSON)  # [{"name": "Performance", "impact": 18.5}, ...]
    negative_factors = Column(JSON)
    
    model_version = Column(String(50))
    prediction_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(PredictionStatusEnum), default=PredictionStatusEnum.CURRENT)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="growth_predictions")


class PromotionPrediction(Base):
    __tablename__ = "promotion_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    
    promotion_probability = Column(Float, nullable=False)  # 0-100
    readiness_category = Column(String(50), nullable=False)
    confidence_score = Column(Float, default=0.0)
    
    # Feature Contributions
    feature_contributions = Column(JSON)
    positive_factors = Column(JSON)
    negative_factors = Column(JSON)
    
    # Target role suggestion
    suggested_role = Column(String(100))
    estimated_timeline_months = Column(Integer)
    
    model_version = Column(String(50))
    prediction_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(PredictionStatusEnum), default=PredictionStatusEnum.CURRENT)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="promotion_predictions")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    
    risk_level = Column(String(50), nullable=False)
    risk_score = Column(Float, default=0.0)  # 0-100
    
    # Risk Factors
    risk_factors = Column(JSON)  # [{"factor": "Low learning", "severity": "HIGH", ...}, ...]
    
    # Recommendations
    mitigation_actions = Column(JSON)
    
    assessment_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(PredictionStatusEnum), default=PredictionStatusEnum.CURRENT)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="risk_assessments")


class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100))  # SKILL, LEARNING, LEADERSHIP, PERFORMANCE, etc.
    priority = Column(String(20), default="MEDIUM")  # LOW, MEDIUM, HIGH
    
    expected_impact = Column(Float)  # Expected growth score improvement
    estimated_duration = Column(String(100))  # "30 days", "2 months", etc.
    
    status = Column(String(50), default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED, DISMISSED
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="recommendations")


class DevelopmentPlan(Base):
    __tablename__ = "development_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    
    plan_name = Column(String(200), nullable=False)
    duration_days = Column(Integer, default=90)
    
    # Structured plan data
    plan_data = Column(JSON)  # Detailed month-by-month or week-by-week plan
    
    target_growth_score = Column(Float)
    target_skills = Column(JSON)  # List of skills to develop
    
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime)
    
    status = Column(String(50), default="ACTIVE")  # ACTIVE, COMPLETED, CANCELLED
    progress_percentage = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="development_plans")
