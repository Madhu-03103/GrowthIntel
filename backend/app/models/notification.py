from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class NotificationTypeEnum(str, enum.Enum):
    GROWTH_SCORE_CHANGE = "GROWTH_SCORE_CHANGE"
    CATEGORY_CHANGE = "CATEGORY_CHANGE"
    PERFORMANCE_REVIEW = "PERFORMANCE_REVIEW"
    TRAINING_COMPLETION = "TRAINING_COMPLETION"
    TRAINING_REMINDER = "TRAINING_REMINDER"
    DEVELOPMENT_REVIEW = "DEVELOPMENT_REVIEW"
    DATA_ALERT = "DATA_ALERT"
    PREDICTION_ERROR = "PREDICTION_ERROR"
    GOAL_UPDATE = "GOAL_UPDATE"


class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    type = Column(Enum(NotificationTypeEnum), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(500), nullable=True)  # URL to navigate to
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)
    
    # Relationship
    employee = relationship("Employee", back_populates="notifications")
