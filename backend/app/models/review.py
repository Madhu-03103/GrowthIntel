from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class ReviewTypeEnum(str, enum.Enum):
    QUARTERLY = "QUARTERLY"
    ANNUAL = "ANNUAL"
    PROMOTION = "PROMOTION"
    PROBATION = "PROBATION"
    MID_YEAR = "MID_YEAR"


class PromotionStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    IN_REVIEW = "IN_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    ON_HOLD = "ON_HOLD"


class PerformanceReview(Base):
    __tablename__ = "performance_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    review_type = Column(Enum(ReviewTypeEnum), nullable=False)
    review_period_start = Column(Date, nullable=False)
    review_period_end = Column(Date, nullable=False)
    review_date = Column(Date, nullable=False)
    
    # Ratings (1-5 scale)
    performance_rating = Column(Float)
    technical_rating = Column(Float)
    leadership_rating = Column(Float)
    communication_rating = Column(Float)
    teamwork_rating = Column(Float)
    overall_rating = Column(Float)
    
    # Feedback
    achievements = Column(Text)
    areas_of_improvement = Column(Text)
    goals_met = Column(Text)
    goals_missed = Column(Text)
    development_needs = Column(Text)
    reviewer_comments = Column(Text)
    employee_comments = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", foreign_keys=[employee_id], back_populates="reviews")
    reviewer = relationship("Employee", foreign_keys=[reviewer_id])


class PromotionReview(Base):
    __tablename__ = "promotion_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    current_role_id = Column(Integer, ForeignKey("roles.id"))
    proposed_role_id = Column(Integer, ForeignKey("roles.id"))
    status = Column(Enum(PromotionStatusEnum), default=PromotionStatusEnum.PENDING)
    
    # Review details
    nominated_by = Column(Integer, ForeignKey("employees.id"))
    nomination_date = Column(Date, nullable=False)
    review_date = Column(Date, nullable=True)
    decision_date = Column(Date, nullable=True)
    effective_date = Column(Date, nullable=True)
    
    # Supporting information
    justification = Column(Text)
    supporting_evidence = Column(Text)
    manager_feedback = Column(Text)
    hr_feedback = Column(Text)
    decision_notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", foreign_keys=[employee_id], back_populates="promotion_reviews")
    nominator = relationship("Employee", foreign_keys=[nominated_by])
