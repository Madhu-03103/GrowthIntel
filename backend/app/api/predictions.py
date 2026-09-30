from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models import Employee, GrowthPrediction, PromotionPrediction, RiskAssessment, Recommendation, DevelopmentPlan
from ..schemas.prediction import (
    GrowthPredictionResponse,
    PromotionPredictionResponse,
    RiskAssessmentResponse,
    WhatIfRequest,
    WhatIfResponse,
    RecommendationResponse,
    DevelopmentPlanResponse
)
from .auth import get_current_employee

router = APIRouter()


@router.get("/growth/{employee_id}", response_model=GrowthPredictionResponse)
async def get_growth_prediction(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get employee growth prediction"""
    
    # Get latest prediction
    prediction = db.query(GrowthPrediction).filter(
        GrowthPrediction.employee_id == employee_id,
        GrowthPrediction.status == "CURRENT"
    ).order_by(GrowthPrediction.prediction_date.desc()).first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="No growth prediction found")
    
    # Generate explanation
    explanation = generate_growth_explanation(prediction)
    
    return {
        "employee_id": prediction.employee_id,
        "growth_score": prediction.growth_score,
        "growth_category": prediction.growth_category,
        "confidence_score": prediction.confidence_score,
        "positive_factors": prediction.positive_factors or [],
        "negative_factors": prediction.negative_factors or [],
        "explanation": explanation,
        "prediction_date": prediction.prediction_date
    }


@router.get("/promotion/{employee_id}", response_model=PromotionPredictionResponse)
async def get_promotion_prediction(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get employee promotion readiness prediction"""
    
    prediction = db.query(PromotionPrediction).filter(
        PromotionPrediction.employee_id == employee_id,
        PromotionPrediction.status == "CURRENT"
    ).order_by(PromotionPrediction.prediction_date.desc()).first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="No promotion prediction found")
    
    explanation = generate_promotion_explanation(prediction)
    
    return {
        "employee_id": prediction.employee_id,
        "promotion_probability": prediction.promotion_probability,
        "readiness_category": prediction.readiness_category,
        "confidence_score": prediction.confidence_score,
        "positive_factors": prediction.positive_factors or [],
        "negative_factors": prediction.negative_factors or [],
        "suggested_role": prediction.suggested_role,
        "estimated_timeline_months": prediction.estimated_timeline_months,
        "explanation": explanation,
        "prediction_date": prediction.prediction_date
    }


@router.get("/risks/{employee_id}", response_model=RiskAssessmentResponse)
async def get_risk_assessment(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get employee risk assessment"""
    
    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.employee_id == employee_id,
        RiskAssessment.status == "CURRENT"
    ).order_by(RiskAssessment.assessment_date.desc()).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="No risk assessment found")
    
    return assessment


@router.get("/recommendations/{employee_id}")
async def get_recommendations(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get personalized recommendations for employee"""
    
    recommendations = db.query(Recommendation).filter(
        Recommendation.employee_id == employee_id,
        Recommendation.status.in_(["PENDING", "IN_PROGRESS"])
    ).order_by(Recommendation.priority.desc()).all()
    
    return recommendations


@router.get("/development-plan/{employee_id}")
async def get_development_plan(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get 90-day development plan"""
    
    plan = db.query(DevelopmentPlan).filter(
        DevelopmentPlan.employee_id == employee_id,
        DevelopmentPlan.status == "ACTIVE"
    ).order_by(DevelopmentPlan.start_date.desc()).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="No active development plan found")
    
    return plan


@router.post("/simulate", response_model=WhatIfResponse)
async def simulate_growth(
    request: WhatIfRequest,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """What-if simulator: predict growth with modified factors"""
    
    employee = db.query(Employee).filter(Employee.id == request.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Current state
    current_growth = employee.growth_score
    current_promotion = employee.promotion_readiness
    
    # Calculate projected scores with modifications
    # This is a simplified calculation - in production, you'd re-run the ML model
    projected_growth = current_growth
    projected_promotion = current_promotion
    
    for factor, new_value in request.modifications.items():
        if factor == "performance_score":
            old_value = employee.performance_score
            projected_growth += (new_value - old_value) * 0.3
            projected_promotion += (new_value - old_value) * 0.25
        elif factor == "learning_score":
            old_value = employee.learning_score
            projected_growth += (new_value - old_value) * 0.25
            projected_promotion += (new_value - old_value) * 0.20
        elif factor == "leadership_score":
            old_value = employee.leadership_score
            projected_growth += (new_value - old_value) * 0.20
            projected_promotion += (new_value - old_value) * 0.30
        elif factor == "skill_score":
            old_value = employee.skill_score
            projected_growth += (new_value - old_value) * 0.25
            projected_promotion += (new_value - old_value) * 0.25
    
    # Cap at 100
    projected_growth = min(100, max(0, projected_growth))
    projected_promotion = min(100, max(0, projected_promotion))
    
    improvement = projected_growth - current_growth
    
    explanation = generate_whatif_explanation(request.modifications, improvement)
    
    return {
        "current_growth_score": round(current_growth, 1),
        "projected_growth_score": round(projected_growth, 1),
        "current_promotion_readiness": round(current_promotion, 1),
        "projected_promotion_readiness": round(projected_promotion, 1),
        "improvement": round(improvement, 1),
        "factors_changed": list(request.modifications.keys()),
        "explanation": explanation
    }


def generate_growth_explanation(prediction: GrowthPrediction) -> str:
    """Generate human-readable explanation for growth prediction"""
    if prediction.positive_factors:
        top_factor = prediction.positive_factors[0]
        factor_name = list(top_factor.keys())[0]
        return f"Strong {factor_name.lower()} is the primary factor supporting this employee's growth trajectory."
    return "Growth prediction based on comprehensive performance analysis."


def generate_promotion_explanation(prediction: PromotionPrediction) -> str:
    """Generate human-readable explanation for promotion prediction"""
    category = prediction.readiness_category
    if category == "READY":
        return "This employee demonstrates strong readiness for promotion across key performance areas."
    elif category == "NEAR_READY":
        return "This employee is approaching promotion readiness with targeted skill development."
    elif category == "DEVELOPING":
        return "This employee is building foundational skills for future promotion opportunities."
    else:
        return "This employee requires significant development before promotion consideration."


def generate_whatif_explanation(modifications: dict, improvement: float) -> str:
    """Generate explanation for what-if simulation"""
    if improvement > 0:
        return f"Improving these factors could increase growth score by approximately {abs(improvement):.1f} points."
    elif improvement < 0:
        return f"These changes may decrease growth score by approximately {abs(improvement):.1f} points."
    else:
        return "These changes would have minimal impact on overall growth score."
