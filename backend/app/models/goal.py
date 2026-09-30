from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class GoalStatusEnum(str, enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"


class DevelopmentGoal(Base):
    __tablename__ = "development_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    target_value = Column(Float, nullable=True)  # For measurable goals
    current_value = Column(Float, default=0.0)
    unit = Column(String(50), nullable=True)  # e.g., "hours", "courses", "%"
    status = Column(Enum(GoalStatusEnum), default=GoalStatusEnum.NOT_STARTED)
    start_date = Column(Date, nullable=False)
    target_date = Column(Date, nullable=False)
    completion_date = Column(Date, nullable=True)
    progress_percentage = Column(Float, default=0.0)  # 0-100
    notes = Column(Text)
    created_by = Column(Integer, ForeignKey("employees.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", foreign_keys=[employee_id], back_populates="goals")
    creator = relationship("Employee", foreign_keys=[created_by])
