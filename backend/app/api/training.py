from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models import Employee, TrainingCourse, EmployeeTraining, TrainingStatusEnum
from ..schemas.training import (
    TrainingCourse as CourseSchema,
    TrainingCourseCreate,
    EmployeeTraining as TrainingSchema,
    EmployeeTrainingCreate,
    EmployeeTrainingUpdate
)
from .auth import get_current_employee

router = APIRouter()


@router.get("/courses", response_model=List[CourseSchema])
async def get_training_courses(
    category: str = None,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get available training courses"""
    query = db.query(TrainingCourse).filter(TrainingCourse.is_active == True)
    
    if category:
        query = query.filter(TrainingCourse.category == category)
    
    return query.all()


@router.post("/courses", response_model=CourseSchema, status_code=201)
async def create_training_course(
    course_data: TrainingCourseCreate,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Create a new training course"""
    if current_employee.user_role.value not in ["ADMIN", "HR"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    new_course = TrainingCourse(**course_data.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    
    return new_course


@router.get("/enrollments", response_model=List[TrainingSchema])
async def get_employee_training(
    employee_id: int = None,
    status: str = None,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get employee training enrollments"""
    query = db.query(EmployeeTraining)
    
    if employee_id:
        if current_employee.user_role.value == "EMPLOYEE" and current_employee.id != employee_id:
            raise HTTPException(status_code=403, detail="Access denied")
        query = query.filter(EmployeeTraining.employee_id == employee_id)
    elif current_employee.user_role.value == "EMPLOYEE":
        query = query.filter(EmployeeTraining.employee_id == current_employee.id)
    
    if status:
        query = query.filter(EmployeeTraining.status == status)
    
    return query.all()


@router.post("/enrollments", response_model=TrainingSchema, status_code=201)
async def enroll_employee_training(
    enrollment_data: EmployeeTrainingCreate,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Enroll employee in training"""
    # Check if course exists
    course = db.query(TrainingCourse).filter(TrainingCourse.id == enrollment_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check authorization
    if current_employee.user_role.value == "EMPLOYEE":
        if enrollment_data.employee_id != current_employee.id:
            raise HTTPException(status_code=403, detail="Cannot enroll other employees")
    
    # Check if already enrolled
    existing = db.query(EmployeeTraining).filter(
        EmployeeTraining.employee_id == enrollment_data.employee_id,
        EmployeeTraining.course_id == enrollment_data.course_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    new_enrollment = EmployeeTraining(
        **enrollment_data.dict(),
        assigned_by=current_employee.id
    )
    
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    
    # Create notification
    from .notifications import create_notification
    create_notification(
        db=db,
        employee_id=enrollment_data.employee_id,
        notification_type="TRAINING_REMINDER",
        title="New Training Assigned",
        message=f"You've been enrolled in: {course.title}",
        link=f"/employees/{enrollment_data.employee_id}"
    )
    
    return new_enrollment


@router.put("/enrollments/{enrollment_id}", response_model=TrainingSchema)
async def update_employee_training(
    enrollment_id: int,
    update_data: EmployeeTrainingUpdate,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Update training enrollment progress"""
    enrollment = db.query(EmployeeTraining).filter(EmployeeTraining.id == enrollment_id).first()
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    # Check authorization
    if current_employee.user_role.value == "EMPLOYEE":
        if enrollment.employee_id != current_employee.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    # Update fields
    update_dict = update_data.dict(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(enrollment, field, value)
    
    # Create notification on completion
    if enrollment.status == TrainingStatusEnum.COMPLETED:
        course = db.query(TrainingCourse).filter(TrainingCourse.id == enrollment.course_id).first()
        from .notifications import create_notification
        create_notification(
            db=db,
            employee_id=enrollment.employee_id,
            notification_type="TRAINING_COMPLETION",
            title="Training Completed!",
            message=f"Congratulations! You've completed: {course.title if course else 'training'}",
            link=f"/employees/{enrollment.employee_id}"
        )
    
    db.commit()
    db.refresh(enrollment)
    
    return enrollment
