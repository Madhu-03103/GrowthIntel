from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class PerformanceRecord(Base):
    __tablename__ = "performance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    
    review_period = Column(String(20), nullable=False)  # e.g., "Q1 2024", "2023"
    review_date = Column(Date, nullable=False)
    
    performance_score = Column(Float, nullable=False)  # 0-100
    quality_of_work = Column(Float, default=0.0)
    productivity = Column(Float, default=0.0)
    initiative = Column(Float, default=0.0)
    collaboration = Column(Float, default=0.0)
    communication = Column(Float, default=0.0)
    
    achievements = Column(Text)
    areas_for_improvement = Column(Text)
    manager_comments = Column(Text)
    
    # reviewed_by = Column(Integer, ForeignKey("employees.id"))  # Commented out to avoid relationship ambiguity
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="performance_records", foreign_keys=[employee_id])


class LearningRecord(Base):
    __tablename__ = "learning_records"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    
    course_name = Column(String(200), nullable=False)
    category = Column(String(100))
    provider = Column(String(100))
    
    completion_date = Column(Date)
    duration_hours = Column(Float, default=0.0)
    certification = Column(String(200))
    
    skills_gained = Column(Text)
    score = Column(Float)  # If applicable
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="learning_records")


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    
    project_name = Column(String(200), nullable=False)
    description = Column(Text)
    role = Column(String(100))  # Role in project
    
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    status = Column(String(50), default="IN_PROGRESS")
    
    contribution_score = Column(Float, default=0.0)  # 0-100
    impact_score = Column(Float, default=0.0)  # 0-100
    leadership_role = Column(Integer, default=0)  # 0 or 1
    
    skills_used = Column(Text)
    achievements = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="projects")
