from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Float, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class TrainingStatusEnum(str, enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class TrainingCourse(Base):
    __tablename__ = "training_courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))  # e.g., "Technical", "Leadership", "Soft Skills"
    duration_hours = Column(Float)
    provider = Column(String(255))
    url = Column(String(500))
    skill_ids = Column(Text)  # Comma-separated skill IDs this course addresses
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    enrollments = relationship("EmployeeTraining", back_populates="course")


class EmployeeTraining(Base):
    __tablename__ = "employee_training"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("training_courses.id"), nullable=False)
    status = Column(Enum(TrainingStatusEnum), default=TrainingStatusEnum.NOT_STARTED)
    enrolled_date = Column(Date, nullable=False)
    start_date = Column(Date, nullable=True)
    completion_date = Column(Date, nullable=True)
    due_date = Column(Date, nullable=True)
    progress_percentage = Column(Float, default=0.0)  # 0-100
    score = Column(Float, nullable=True)  # If assessment exists
    feedback = Column(Text)
    assigned_by = Column(Integer, ForeignKey("employees.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", foreign_keys=[employee_id], back_populates="trainings")
    course = relationship("TrainingCourse", back_populates="enrollments")
    assigner = relationship("Employee", foreign_keys=[assigned_by])
