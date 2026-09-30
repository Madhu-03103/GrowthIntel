from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from ..core.database import get_db
from ..models import Employee, DevelopmentGoal, GoalStatusEnum
from ..schemas.goal import DevelopmentGoal as GoalSchema, DevelopmentGoalCreate, DevelopmentGoalUpdate
from .auth import get_current_employee

router = APIRouter()


@router.get("/", response_model=List[GoalSchema])
async def get_goals(
    employee_id: int = None,
    status: str = None,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get development goals"""
    query = db.query(DevelopmentGoal)
    
    # Filter by employee
    if employee_id:
        # Check authorization
        if current_employee.user_role.value == "EMPLOYEE" and current_employee.id != employee_id:
            raise HTTPException(status_code=403, detail="Access denied")
        query = query.filter(DevelopmentGoal.employee_id == employee_id)
    elif current_employee.user_role.value == "EMPLOYEE":
        # Regular employees only see their own goals
        query = query.filter(DevelopmentGoal.employee_id == current_employee.id)
    
    # Filter by status
    if status:
        query = query.filter(DevelopmentGoal.status == status)
    
    goals = query.order_by(DevelopmentGoal.target_date).all()
    
    # Update overdue status
    today = date.today()
    for goal in goals:
        if goal.status not in [GoalStatusEnum.COMPLETED, GoalStatusEnum.CANCELLED]:
            if goal.target_date < today:
                goal.status = GoalStatusEnum.OVERDUE
    
    db.commit()
    
    return goals


@router.post("/", response_model=GoalSchema, status_code=201)
async def create_goal(
    goal_data: DevelopmentGoalCreate,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Create a new development goal"""
    # Check authorization
    if current_employee.user_role.value == "EMPLOYEE":
        if goal_data.employee_id != current_employee.id:
            raise HTTPException(status_code=403, detail="Cannot create goals for other employees")
    
    new_goal = DevelopmentGoal(
        **goal_data.dict(),
        created_by=current_employee.id
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    
    # Create notification
    from .notifications import create_notification
    create_notification(
        db=db,
        employee_id=goal_data.employee_id,
        notification_type="GOAL_UPDATE",
        title="New Development Goal",
        message=f"A new goal has been created: {goal_data.title}",
        link=f"/employees/{goal_data.employee_id}"
    )
    
    return new_goal


@router.put("/{goal_id}", response_model=GoalSchema)
async def update_goal(
    goal_id: int,
    goal_data: DevelopmentGoalUpdate,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Update a development goal"""
    goal = db.query(DevelopmentGoal).filter(DevelopmentGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Check authorization
    if current_employee.user_role.value == "EMPLOYEE":
        if goal.employee_id != current_employee.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    # Update fields
    update_data = goal_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)
    
    # Auto-complete if progress is 100%
    if goal.progress_percentage >= 100 and goal.status != GoalStatusEnum.COMPLETED:
        goal.status = GoalStatusEnum.COMPLETED
        goal.completion_date = date.today()
        
        # Create notification
        from .notifications import create_notification
        create_notification(
            db=db,
            employee_id=goal.employee_id,
            notification_type="GOAL_UPDATE",
            title="Goal Completed!",
            message=f"Congratulations! You've completed: {goal.title}",
            link=f"/employees/{goal.employee_id}"
        )
    
    db.commit()
    db.refresh(goal)
    
    return goal


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Delete a development goal"""
    goal = db.query(DevelopmentGoal).filter(DevelopmentGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Check authorization
    if current_employee.user_role.value not in ["ADMIN", "HR"]:
        if goal.employee_id != current_employee.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    db.delete(goal)
    db.commit()
    
    return {"message": "Goal deleted successfully"}
