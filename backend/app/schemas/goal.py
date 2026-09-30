from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class DevelopmentGoalBase(BaseModel):
    employee_id: int
    title: str
    description: Optional[str] = None
    target_value: Optional[float] = None
    unit: Optional[str] = None
    start_date: date
    target_date: date


class DevelopmentGoalCreate(DevelopmentGoalBase):
    pass


class DevelopmentGoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    current_value: Optional[float] = None
    target_value: Optional[float] = None
    status: Optional[str] = None
    progress_percentage: Optional[float] = None
    notes: Optional[str] = None
    completion_date: Optional[date] = None


class DevelopmentGoal(DevelopmentGoalBase):
    id: int
    current_value: float
    status: str
    progress_percentage: float
    completion_date: Optional[date] = None
    notes: Optional[str] = None
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
