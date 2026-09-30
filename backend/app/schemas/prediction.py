from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime


class FeatureContribution(BaseModel):
    name: str
    value: float
    impact: float


class GrowthPredictionResponse(BaseModel):
    employee_id: int
    growth_score: float
    growth_category: str
    confidence_score: float
    positive_factors: List[Dict[str, float]]
    negative_factors: List[Dict[str, float]]
    explanation: str
    prediction_date: datetime
    
    class Config:
        from_attributes = True


class PromotionPredictionResponse(BaseModel):
    employee_id: int
    promotion_probability: float
    readiness_category: str
    confidence_score: float
    positive_factors: List[Dict[str, float]]
    negative_factors: List[Dict[str, float]]
    suggested_role: Optional[str] = None
    estimated_timeline_months: Optional[int] = None
    explanation: str
    prediction_date: datetime
    
    class Config:
        from_attributes = True


class RiskAssessmentResponse(BaseModel):
    employee_id: int
    risk_level: str
    risk_score: float
    risk_factors: List[Dict]
    mitigation_actions: List[Dict]
    assessment_date: datetime
    
    class Config:
        from_attributes = True


class WhatIfRequest(BaseModel):
    employee_id: int
    modifications: Dict[str, float]  # {"performance_score": 85, "learning_score": 80}


class WhatIfResponse(BaseModel):
    current_growth_score: float
    projected_growth_score: float
    current_promotion_readiness: float
    projected_promotion_readiness: float
    improvement: float
    factors_changed: List[str]
    explanation: str


class RecommendationResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    priority: str
    expected_impact: Optional[float] = None
    estimated_duration: Optional[str] = None
    status: str
    
    class Config:
        from_attributes = True


class DevelopmentPlanResponse(BaseModel):
    id: int
    employee_id: int
    plan_name: str
    duration_days: int
    plan_data: Dict
    target_growth_score: Optional[float] = None
    target_skills: Optional[List[str]] = None
    status: str
    progress_percentage: float
    start_date: datetime
    
    class Config:
        from_attributes = True
