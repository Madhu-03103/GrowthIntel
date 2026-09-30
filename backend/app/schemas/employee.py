from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class Department(DepartmentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class JobRoleBase(BaseModel):
    title: str
    level: int
    description: Optional[str] = None
    department_id: Optional[int] = None


class JobRoleCreate(JobRoleBase):
    pass


class JobRole(JobRoleBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class EmployeeBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    department_id: Optional[int] = None
    role_id: Optional[int] = None
    joining_date: date
    years_of_experience: float = 0.0


class EmployeeCreate(EmployeeBase):
    employee_id: str
    password: str
    user_role: str = "EMPLOYEE"


class EmployeeUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    department_id: Optional[int] = None
    role_id: Optional[int] = None
    performance_score: Optional[float] = None
    skill_score: Optional[float] = None
    learning_score: Optional[float] = None
    leadership_score: Optional[float] = None


class Employee(EmployeeBase):
    id: int
    employee_id: str
    performance_score: float
    skill_score: float
    learning_score: float
    leadership_score: float
    growth_score: float
    promotion_readiness: float
    growth_level: str
    risk_level: str
    user_role: str
    is_active: int
    created_at: datetime
    updated_at: datetime
    
    department: Optional[Department] = None
    role: Optional[JobRole] = None
    
    class Config:
        from_attributes = True


class EmployeeSummary(BaseModel):
    """Lightweight employee summary for lists"""
    id: int
    employee_id: str
    full_name: str
    email: EmailStr
    department_name: Optional[str] = None
    role_title: Optional[str] = None
    years_of_experience: float
    performance_score: float
    skill_score: float
    growth_score: float
    promotion_readiness: float
    growth_level: str
    risk_level: str
    
    class Config:
        from_attributes = True
