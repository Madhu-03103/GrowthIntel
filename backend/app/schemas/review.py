from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class PerformanceReviewBase(BaseModel):
    employee_id: int
    reviewer_id: int
    review_type: str
    review_period_start: date
    review_period_end: date
    review_date: date


class PerformanceReviewCreate(PerformanceReviewBase):
    performance_rating: Optional[float] = None
    technical_rating: Optional[float] = None
    leadership_rating: Optional[float] = None
    communication_rating: Optional[float] = None
    teamwork_rating: Optional[float] = None
    overall_rating: Optional[float] = None
    achievements: Optional[str] = None
    areas_of_improvement: Optional[str] = None
    goals_met: Optional[str] = None
    goals_missed: Optional[str] = None
    development_needs: Optional[str] = None
    reviewer_comments: Optional[str] = None


class PerformanceReview(PerformanceReviewBase):
    id: int
    performance_rating: Optional[float] = None
    technical_rating: Optional[float] = None
    leadership_rating: Optional[float] = None
    communication_rating: Optional[float] = None
    teamwork_rating: Optional[float] = None
    overall_rating: Optional[float] = None
    achievements: Optional[str] = None
    areas_of_improvement: Optional[str] = None
    goals_met: Optional[str] = None
    goals_missed: Optional[str] = None
    development_needs: Optional[str] = None
    reviewer_comments: Optional[str] = None
    employee_comments: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PromotionReviewBase(BaseModel):
    employee_id: int
    current_role_id: Optional[int] = None
    proposed_role_id: Optional[int] = None
    nomination_date: date


class PromotionReviewCreate(PromotionReviewBase):
    nominated_by: Optional[int] = None
    justification: Optional[str] = None
    supporting_evidence: Optional[str] = None


class PromotionReviewUpdate(BaseModel):
    status: Optional[str] = None
    review_date: Optional[date] = None
    decision_date: Optional[date] = None
    effective_date: Optional[date] = None
    manager_feedback: Optional[str] = None
    hr_feedback: Optional[str] = None
    decision_notes: Optional[str] = None


class PromotionReview(PromotionReviewBase):
    id: int
    status: str
    nominated_by: Optional[int] = None
    review_date: Optional[date] = None
    decision_date: Optional[date] = None
    effective_date: Optional[date] = None
    justification: Optional[str] = None
    supporting_evidence: Optional[str] = None
    manager_feedback: Optional[str] = None
    hr_feedback: Optional[str] = None
    decision_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
