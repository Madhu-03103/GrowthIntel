from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from ..core.database import get_db
from ..models import Employee, Department, JobRole
from ..schemas import Employee as EmployeeSchema, EmployeeSummary
from .auth import get_current_employee
from .mock_data import MOCK_EMPLOYEES

router = APIRouter()


@router.get("/", response_model=List[EmployeeSummary])
async def get_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=500),
    department: Optional[str] = None,
    role: Optional[str] = None,
    growth_level: Optional[str] = None,
    risk_level: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get list of employees with filters"""
    
    # Build query with eager loading using selectinload (doesn't create joins)
    query = db.query(Employee).options(
        selectinload(Employee.department),
        selectinload(Employee.role)
    ).filter(Employee.is_active == 1)
    
    # Apply filters
    if department:
        query = query.join(Department, Employee.department_id == Department.id).filter(Department.name == department)
    
    if role:
        query = query.join(JobRole, Employee.role_id == JobRole.id).filter(JobRole.title == role)
    
    if growth_level:
        query = query.filter(Employee.growth_level == growth_level)
    
    if risk_level:
        query = query.filter(Employee.risk_level == risk_level)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Employee.first_name.ilike(search_filter)) |
            (Employee.last_name.ilike(search_filter)) |
            (Employee.employee_id.ilike(search_filter)) |
            (Employee.email.ilike(search_filter))
        )
    
    # Execute query
    employees = query.offset(skip).limit(limit).all()
    
    # Transform to summary
    result = []
    for emp in employees:
        result.append({
            "id": emp.id,
            "employee_id": emp.employee_id,
            "full_name": emp.full_name,
            "email": emp.email,
            "department_name": emp.department.name if emp.department else None,
            "role_title": emp.role.title if emp.role else None,
            "years_of_experience": emp.years_of_experience,
            "performance_score": emp.performance_score,
            "skill_score": emp.skill_score,
            "growth_score": emp.growth_score,
            "promotion_readiness": emp.promotion_readiness,
            "growth_level": emp.growth_level.value,
            "risk_level": emp.risk_level.value
        })
    
    return result


@router.get("/{employee_id}", response_model=EmployeeSchema)
async def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get detailed employee information"""
    
    # Check authorization
    if current_employee.user_role.value == "EMPLOYEE" and current_employee.id != employee_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return employee


@router.get("/{employee_id}/overview")
async def get_employee_overview(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get employee overview with all key metrics"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {
        "basic_info": {
            "id": employee.id,
            "employee_id": employee.employee_id,
            "full_name": employee.full_name,
            "email": employee.email,
            "department": employee.department.name if employee.department else None,
            "role": employee.role.title if employee.role else None,
            "years_of_experience": employee.years_of_experience,
            "joining_date": employee.joining_date
        },
        "scores": {
            "performance": employee.performance_score,
            "skill": employee.skill_score,
            "learning": employee.learning_score,
            "leadership": employee.leadership_score,
            "growth": employee.growth_score
        },
        "growth_intelligence": {
            "growth_score": employee.growth_score,
            "promotion_readiness": employee.promotion_readiness,
            "growth_level": employee.growth_level.value,
            "risk_level": employee.risk_level.value
        }
    }


@router.post("/", status_code=201)
async def create_employee(
    employee_data: dict,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Create a new employee"""
    # Check authorization - only ADMIN and HR can create employees
    if current_employee.user_role.value not in ["ADMIN", "HR"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Check if employee ID or email already exists
    existing = db.query(Employee).filter(
        (Employee.employee_id == employee_data.get("employee_id")) |
        (Employee.email == employee_data.get("email"))
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Employee ID or email already exists")
    
    # Hash password
    from ..core.security import get_password_hash
    hashed_password = get_password_hash(employee_data.get("password", "default123"))
    
    # Create employee
    new_employee = Employee(
        employee_id=employee_data["employee_id"],
        email=employee_data["email"],
        hashed_password=hashed_password,
        first_name=employee_data["first_name"],
        last_name=employee_data["last_name"],
        department_id=employee_data.get("department_id"),
        role_id=employee_data.get("role_id"),
        joining_date=employee_data.get("joining_date"),
        years_of_experience=employee_data.get("years_of_experience", 0.0),
        user_role=employee_data.get("user_role", "EMPLOYEE")
    )
    
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    # Create notification for new employee
    from .notifications import create_notification
    create_notification(
        db=db,
        employee_id=new_employee.id,
        notification_type="DATA_ALERT",
        title="Welcome to Growth Intel",
        message=f"Welcome {new_employee.full_name}! Your account has been created.",
        link=f"/employees/{new_employee.id}"
    )
    
    return {"message": "Employee created successfully", "id": new_employee.id}


@router.put("/{employee_id}")
async def update_employee(
    employee_id: int,
    employee_data: dict,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Update employee information"""
    # Check authorization
    if current_employee.user_role.value == "EMPLOYEE" and current_employee.id != employee_id:
        if current_employee.user_role.value not in ["ADMIN", "HR", "MANAGER"]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Track changes for notifications
    old_growth_score = employee.growth_score
    old_growth_level = employee.growth_level.value
    
    # Update allowed fields
    updatable_fields = [
        "first_name", "last_name", "department_id", "role_id",
        "years_of_experience", "performance_score", "skill_score",
        "learning_score", "leadership_score", "growth_score",
        "promotion_readiness", "growth_level", "risk_level"
    ]
    
    for field in updatable_fields:
        if field in employee_data:
            setattr(employee, field, employee_data[field])
    
    db.commit()
    db.refresh(employee)
    
    # Create notifications if growth metrics changed significantly
    from .notifications import create_notification
    
    if abs(employee.growth_score - old_growth_score) >= 5:
        direction = "increased" if employee.growth_score > old_growth_score else "decreased"
        create_notification(
            db=db,
            employee_id=employee_id,
            notification_type="GROWTH_SCORE_CHANGE",
            title="Growth Score Update",
            message=f"Your growth score has {direction} from {old_growth_score:.1f} to {employee.growth_score:.1f}",
            link=f"/employees/{employee_id}"
        )
    
    if employee.growth_level.value != old_growth_level:
        create_notification(
            db=db,
            employee_id=employee_id,
            notification_type="CATEGORY_CHANGE",
            title="Growth Category Changed",
            message=f"Your growth category changed from {old_growth_level} to {employee.growth_level.value}",
            link=f"/employees/{employee_id}"
        )
    
    return {"message": "Employee updated successfully"}


@router.delete("/{employee_id}")
async def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Soft delete an employee"""
    # Check authorization - only ADMIN can delete
    if current_employee.user_role.value != "ADMIN":
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Prevent self-deletion
    if employee.id == current_employee.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    # Soft delete
    employee.is_active = 0
    db.commit()
    
    return {"message": "Employee deactivated successfully"}


@router.get("/export/csv")
async def export_employees_csv(
    department: Optional[str] = None,
    role: Optional[str] = None,
    growth_level: Optional[str] = None,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Export employees to CSV"""
    # Check authorization
    if current_employee.user_role.value not in ["ADMIN", "HR", "MANAGER"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    from fastapi.responses import StreamingResponse
    import io
    import csv
    
    # Build query
    query = db.query(Employee).options(
        selectinload(Employee.department),
        selectinload(Employee.role)
    ).filter(Employee.is_active == 1)
    
    if department:
        query = query.join(Department, Employee.department_id == Department.id).filter(Department.name == department)
    
    if role:
        query = query.join(JobRole, Employee.role_id == JobRole.id).filter(JobRole.title == role)
    
    if growth_level:
        query = query.filter(Employee.growth_level == growth_level)
    
    employees = query.all()
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Employee ID", "Name", "Email", "Department", "Role",
        "Years Experience", "Performance Score", "Skill Score",
        "Growth Score", "Promotion Readiness", "Growth Level", "Risk Level"
    ])
    
    # Write data
    for emp in employees:
        writer.writerow([
            emp.employee_id,
            emp.full_name,
            emp.email,
            emp.department.name if emp.department else "",
            emp.role.title if emp.role else "",
            emp.years_of_experience,
            emp.performance_score,
            emp.skill_score,
            emp.growth_score,
            emp.promotion_readiness,
            emp.growth_level.value,
            emp.risk_level.value
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=employees.csv"}
    )
