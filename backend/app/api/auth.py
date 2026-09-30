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
    
    # DEMO MODE: Create a mock employee object for any user
    class MockEmployee:
        def __init__(self, email, employee_id):
            self.id = hash(email) % 10000
            self.email = email
            self.employee_id = employee_id
            email_name = email.split('@')[0].replace('.', ' ').replace('_', ' ').title()
            self.first_name = email_name.split()[0] if email_name else "User"
            self.last_name = email_name.split()[-1] if len(email_name.split()) > 1 else "Account"
            self.full_name = email_name if email_name else "User Account"
            self.is_active = True
            self.user_role = type('obj', (object,), {'value': 'ADMIN'})
            self.department = type('obj', (object,), {'name': 'General'})
            self.role = type('obj', (object,), {'title': 'User'})
            self.growth_score = 75.0
            self.promotion_readiness = 70.0
    
    return MockEmployee(email, payload.get("employee_id", f"EMP{hash(email) % 10000:04d}"))


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate employee and return JWT token - DEMO MODE: Accepts any email/password"""
    
    # DEMO MODE: Accept any email and password combination
    # Generate a mock user based on the email provided
    
    # Extract name from email (before @)
    email_name = login_data.email.split('@')[0].replace('.', ' ').replace('_', ' ').title()
    
    # Create access token for any user
    access_token = create_access_token(
        data={
            "sub": login_data.email,
            "employee_id": f"EMP{hash(login_data.email) % 10000:04d}",
            "role": "ADMIN"
        }
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "employee": {
            "id": hash(login_data.email) % 10000,
            "employee_id": f"EMP{hash(login_data.email) % 10000:04d}",
            "email": login_data.email,
            "full_name": email_name,
            "role": "ADMIN",
            "department": "General",
            "job_role": "User"
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
