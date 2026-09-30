from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class TrainingCourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    duration_hours: Optional[float] = None
    provider: Optional[str] = None
    url: Optional[str] = None


class TrainingCourseCreate(TrainingCourseBase):
    skill_ids: Optional[str] = None


class TrainingCourse(TrainingCourseBase):
    id: int
    skill_ids: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class EmployeeTrainingBase(BaseModel):
    employee_id: int
    course_id: int
    enrolled_date: date
    due_date: Optional[date] = None


class EmployeeTrainingCreate(EmployeeTrainingBase):
    assigned_by: Optional[int] = None


class EmployeeTrainingUpdate(BaseModel):
    status: Optional[str] = None
    start_date: Optional[date] = None
    completion_date: Optional[date] = None
    progress_percentage: Optional[float] = None
    score: Optional[float] = None
    feedback: Optional[str] = None


class EmployeeTraining(EmployeeTrainingBase):
    id: int
    status: str
    start_date: Optional[date] = None
    completion_date: Optional[date] = None
    progress_percentage: float
    score: Optional[float] = None
    feedback: Optional[str] = None
    assigned_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
