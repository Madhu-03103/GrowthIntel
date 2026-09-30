from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models import Employee, PerformanceReview, PromotionReview
from ..schemas.review import (
    PerformanceReview as ReviewSchema,
    PerformanceReviewCreate,
    PromotionReview as PromotionSchema,
    PromotionReviewCreate,
    PromotionReviewUpdate
)
from .auth import get_current_employee

router = APIRouter()


@router.get("/performance", response_model=List[ReviewSchema])
async def get_performance_reviews(
    employee_id: int = None,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get performance reviews"""
    query = db.query(PerformanceReview)
    
    if employee_id:
        if current_employee.user_role.value == "EMPLOYEE" and current_employee.id != employee_id:
            raise HTTPException(status_code=403, detail="Access denied")
        query = query.filter(PerformanceReview.employee_id == employee_id)
    elif current_employee.user_role.value == "EMPLOYEE":
        query = query.filter(PerformanceReview.employee_id == current_employee.id)
    
    return query.order_by(PerformanceReview.review_date.desc()).all()


@router.post("/performance", response_model=ReviewSchema, status_code=201)
async def create_performance_review(
    review_data: PerformanceReviewCreate,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Create a new performance review"""
    if current_employee.user_role.value not in ["ADMIN", "HR", "MANAGER"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    new_review = PerformanceReview(**review_data.dict())
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    # Create notification
    from .notifications import create_notification
    create_notification(
        db=db,
        employee_id=review_data.employee_id,
        notification_type="PERFORMANCE_REVIEW",
        title="New Performance Review",
        message=f"Your {review_data.review_type} performance review is ready",
        link=f"/employees/{review_data.employee_id}"
    )
    
    return new_review


@router.get("/promotions", response_model=List[PromotionSchema])
async def get_promotion_reviews(
    employee_id: int = None,
    status: str = None,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get promotion reviews"""
    query = db.query(PromotionReview)
    
    if employee_id:
        if current_employee.user_role.value == "EMPLOYEE" and current_employee.id != employee_id:
            raise HTTPException(status_code=403, detail="Access denied")
        query = query.filter(PromotionReview.employee_id == employee_id)
    elif current_employee.user_role.value == "EMPLOYEE":
        query = query.filter(PromotionReview.employee_id == current_employee.id)
    
    if status:
        query = query.filter(PromotionReview.status == status)
    
    return query.order_by(PromotionReview.nomination_date.desc()).all()


@router.post("/promotions", response_model=PromotionSchema, status_code=201)
async def create_promotion_review(
    review_data: PromotionReviewCreate,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Create a new promotion review"""
    if current_employee.user_role.value not in ["ADMIN", "HR", "MANAGER"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    new_review = PromotionReview(
        **review_data.dict(),
        nominated_by=current_employee.id
    )
    
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    # Create notification
    from .notifications import create_notification
    create_notification(
        db=db,
        employee_id=review_data.employee_id,
        notification_type="PERFORMANCE_REVIEW",
        title="Promotion Review Initiated",
        message="You've been nominated for a promotion review",
        link=f"/employees/{review_data.employee_id}"
    )
    
    return new_review


@router.put("/promotions/{review_id}", response_model=PromotionSchema)
async def update_promotion_review(
    review_id: int,
    update_data: PromotionReviewUpdate,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Update promotion review status"""
    if current_employee.user_role.value not in ["ADMIN", "HR"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    review = db.query(PromotionReview).filter(PromotionReview.id == review_id).first()
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Update fields
    update_dict = update_data.dict(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(review, field, value)
    
    db.commit()
    db.refresh(review)
    
    # Create notification on status change
    if "status" in update_dict:
        from .notifications import create_notification
        create_notification(
            db=db,
            employee_id=review.employee_id,
            notification_type="PERFORMANCE_REVIEW",
            title="Promotion Review Update",
            message=f"Your promotion review status: {review.status}",
            link=f"/employees/{review.employee_id}"
        )
    
    return review
