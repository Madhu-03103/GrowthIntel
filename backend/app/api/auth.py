from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from ..core.database import get_db
from ..core.security import verify_password, create_access_token, decode_access_token
from ..models import Employee
from ..schemas.auth import LoginRequest, LoginResponse, Token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def get_current_employee(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Employee:
    """Get current authenticated employee"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    # DEMO MODE: Allow demo user to bypass database check
    if email == "demo@demo.com":
        # Create a mock employee object for demo user
        class MockEmployee:
            id = 1
            email = "demo@demo.com"
            first_name = "Demo"
            last_name = "User"
            full_name = "Demo User"
            is_active = True
            user_role = type('obj', (object,), {'value': 'ADMIN'})
        return MockEmployee()
    
    employee = db.query(Employee).filter(Employee.email == email).first()
    if employee is None:
        raise credentials_exception
    
    if not employee.is_active:
        raise HTTPException(status_code=400, detail="Inactive employee")
    
    return employee


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate employee and return JWT token"""
    
    # DEMO MODE: Allow demo@demo.com with any password for testing
    if login_data.email == "demo@demo.com":
        access_token = create_access_token(
            data={
                "sub": "demo@demo.com",
                "employee_id": "DEMO001",
                "role": "ADMIN"
            }
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "employee": {
                "id": 1,
                "employee_id": "DEMO001",
                "email": "demo@demo.com",
                "full_name": "Demo User",
                "role": "ADMIN",
                "department": "Demo Department",
                "job_role": "Demo Role"
            }
        }
    
    employee = db.query(Employee).filter(Employee.email == login_data.email).first()
    
    if not employee or not verify_password(login_data.password, employee.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not employee.is_active:
        raise HTTPException(status_code=400, detail="Inactive employee account")
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": employee.email,
            "employee_id": employee.employee_id,
            "role": employee.user_role.value
        }
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "employee": {
            "id": employee.id,
            "employee_id": employee.employee_id,
            "email": employee.email,
            "full_name": employee.full_name,
            "role": employee.user_role.value,
            "department": employee.department.name if employee.department else None,
            "job_role": employee.role.title if employee.role else None
        }
    }


@router.get("/me")
async def get_current_user(current_employee: Employee = Depends(get_current_employee)):
    """Get current authenticated employee details"""
    return {
        "id": current_employee.id,
        "employee_id": current_employee.employee_id,
        "email": current_employee.email,
        "full_name": current_employee.full_name,
        "role": current_employee.user_role.value,
        "department": current_employee.department.name if current_employee.department else None,
        "job_role": current_employee.role.title if current_employee.role else None,
        "growth_score": current_employee.growth_score,
        "promotion_readiness": current_employee.promotion_readiness
    }
