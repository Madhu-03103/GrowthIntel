from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..core.database import get_db
from ..models import Employee, Department, JobRole, GrowthLevelEnum, RiskLevelEnum
from .auth import get_current_employee
from .mock_data import get_mock_analytics

router = APIRouter()


@router.get("/overview")
async def get_analytics_overview(
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get executive dashboard overview metrics"""
    
    # Total employees
    total_employees = db.query(func.count(Employee.id)).filter(Employee.is_active == 1).scalar()
    
    # Average scores
    avg_growth = db.query(func.avg(Employee.growth_score)).filter(Employee.is_active == 1).scalar() or 0
    avg_performance = db.query(func.avg(Employee.performance_score)).filter(Employee.is_active == 1).scalar() or 0
    avg_skill = db.query(func.avg(Employee.skill_score)).filter(Employee.is_active == 1).scalar() or 0
    
    # Promotion ready (readiness >= 75%)
    promotion_ready = db.query(func.count(Employee.id)).filter(
        Employee.is_active == 1,
        Employee.promotion_readiness >= 75
    ).scalar()
    
    # At risk employees
    at_risk = db.query(func.count(Employee.id)).filter(
        Employee.is_active == 1,
        Employee.risk_level.in_([RiskLevelEnum.HIGH, RiskLevelEnum.CRITICAL])
    ).scalar()
    
    # High potential employees (high growth level)
    high_potential = db.query(func.count(Employee.id)).filter(
        Employee.is_active == 1,
        Employee.growth_level == GrowthLevelEnum.HIGH_GROWTH
    ).scalar()
    
    # Growth distribution
    growth_distribution = {}
    for level in GrowthLevelEnum:
        count = db.query(func.count(Employee.id)).filter(
            Employee.is_active == 1,
            Employee.growth_level == level
        ).scalar()
        growth_distribution[level.value] = count
    
    # Department-wise growth
    dept_growth = db.query(
        Department.name,
        func.avg(Employee.growth_score).label("avg_growth"),
        func.count(Employee.id).label("count")
    ).join(Employee).filter(Employee.is_active == 1).group_by(Department.name).all()
    
    department_growth = [
        {"department": dept, "average_growth": round(avg, 1), "employee_count": count}
        for dept, avg, count in dept_growth
    ]
    
    # Role-wise growth
    role_growth = db.query(
        JobRole.title,
        func.avg(Employee.growth_score).label("avg_growth"),
        func.count(Employee.id).label("count")
    ).join(Employee).filter(Employee.is_active == 1).group_by(JobRole.title).all()
    
    role_growth_data = [
        {"role": role, "average_growth": round(avg, 1), "employee_count": count}
        for role, avg, count in role_growth
    ]
    
    # Top growth opportunities (employees with high potential but skill gaps)
    top_opportunities = db.query(Employee).filter(
        Employee.is_active == 1,
        Employee.growth_score >= 60,
        Employee.promotion_readiness < 70
    ).order_by(desc(Employee.growth_score)).limit(10).all()
    
    opportunities = [
        {
            "employee_id": emp.employee_id,
            "name": emp.full_name,
            "growth_score": emp.growth_score,
            "promotion_readiness": emp.promotion_readiness,
            "gap": round(emp.growth_score - emp.promotion_readiness, 1)
        }
        for emp in top_opportunities
    ]
    
    return {
        "summary": {
            "total_employees": total_employees,
            "average_growth_score": round(avg_growth, 1),
            "promotion_ready_count": promotion_ready,
            "at_risk_count": at_risk,
            "high_potential_count": high_potential,
            "average_performance": round(avg_performance, 1),
            "average_skill_score": round(avg_skill, 1)
        },
        "growth_distribution": growth_distribution,
        "department_growth": department_growth,
        "role_growth": role_growth_data,
        "top_opportunities": opportunities
    }


@router.get("/departments")
async def get_department_analytics(
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get department-wise detailed analytics"""
    
    departments = db.query(Department).all()
    
    result = []
    for dept in departments:
        employees = db.query(Employee).filter(
            Employee.department_id == dept.id,
            Employee.is_active == 1
        ).all()
        
        if not employees:
            continue
        
        total = len(employees)
        avg_growth = sum(e.growth_score for e in employees) / total
        avg_performance = sum(e.performance_score for e in employees) / total
        promotion_ready = sum(1 for e in employees if e.promotion_readiness >= 75)
        at_risk = sum(1 for e in employees if e.risk_level in [RiskLevelEnum.HIGH, RiskLevelEnum.CRITICAL])
        
        result.append({
            "department_name": dept.name,
            "total_employees": total,
            "average_growth_score": round(avg_growth, 1),
            "average_performance": round(avg_performance, 1),
            "promotion_ready": promotion_ready,
            "at_risk": at_risk,
            "growth_distribution": {
                "HIGH_GROWTH": sum(1 for e in employees if e.growth_level == GrowthLevelEnum.HIGH_GROWTH),
                "STABLE_GROWTH": sum(1 for e in employees if e.growth_level == GrowthLevelEnum.STABLE_GROWTH),
                "SLOW_GROWTH": sum(1 for e in employees if e.growth_level == GrowthLevelEnum.SLOW_GROWTH),
                "DECLINING": sum(1 for e in employees if e.growth_level == GrowthLevelEnum.DECLINING)
            }
        })
    
    return result


@router.get("/growth-trends")
async def get_growth_trends(
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get growth trends over time"""
    
    # This would typically query historical prediction data
    # For now, return current snapshot
    
    employees = db.query(Employee).filter(Employee.is_active == 1).all()
    
    # Group by growth score ranges
    ranges = {
        "0-25": 0,
        "26-50": 0,
        "51-75": 0,
        "76-100": 0
    }
    
    for emp in employees:
        score = emp.growth_score
        if score <= 25:
            ranges["0-25"] += 1
        elif score <= 50:
            ranges["26-50"] += 1
        elif score <= 75:
            ranges["51-75"] += 1
        else:
            ranges["76-100"] += 1
    
    return {
        "growth_score_distribution": ranges,
        "total_employees": len(employees)
    }



@router.get("/recent-activity")
async def get_recent_activity(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get recent activity feed for dashboard"""
    from ..models import Notification
    from datetime import datetime, timedelta
    
    # Get recent notifications across all employees (for admins/HR)
    if current_employee.user_role.value in ["ADMIN", "HR"]:
        recent_notifications = db.query(Notification).order_by(
            desc(Notification.created_at)
        ).limit(limit).all()
    else:
        # For regular users, only their notifications
        recent_notifications = db.query(Notification).filter(
            Notification.employee_id == current_employee.id
        ).order_by(desc(Notification.created_at)).limit(limit).all()
    
    activities = []
    for notif in recent_notifications:
        employee = db.query(Employee).filter(Employee.id == notif.employee_id).first()
        activities.append({
            "id": notif.id,
            "type": notif.type,
            "title": notif.title,
            "message": notif.message,
            "employee_name": employee.full_name if employee else "Unknown",
            "timestamp": notif.created_at,
            "link": notif.link
        })
    
    return activities


@router.get("/dashboard-refresh")
async def get_dashboard_refresh_data(
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Optimized endpoint for dashboard real-time refresh"""
    from datetime import datetime
    
    # Get critical metrics only
    total_employees = db.query(func.count(Employee.id)).filter(Employee.is_active == 1).scalar()
    
    avg_growth = db.query(func.avg(Employee.growth_score)).filter(Employee.is_active == 1).scalar() or 0
    
    promotion_ready = db.query(func.count(Employee.id)).filter(
        Employee.is_active == 1,
        Employee.promotion_readiness >= 75
    ).scalar()
    
    at_risk = db.query(func.count(Employee.id)).filter(
        Employee.is_active == 1,
        Employee.risk_level.in_([RiskLevelEnum.HIGH, RiskLevelEnum.CRITICAL])
    ).scalar()
    
    # Get unread notification count
    from ..models import Notification
    unread_count = db.query(func.count(Notification.id)).filter(
        Notification.employee_id == current_employee.id,
        Notification.is_read == False
    ).scalar()
    
    return {
        "total_employees": total_employees,
        "average_growth_score": round(avg_growth, 1),
        "promotion_ready_count": promotion_ready,
        "at_risk_count": at_risk,
        "unread_notifications": unread_count,
        "last_updated": datetime.utcnow().isoformat()
    }
