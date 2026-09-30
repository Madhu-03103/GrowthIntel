from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..models import Employee, Notification
from ..schemas.notification import Notification as NotificationSchema, NotificationCreate, NotificationMarkRead
from .auth import get_current_employee

router = APIRouter()


@router.get("/", response_model=List[NotificationSchema])
async def get_notifications(
    unread_only: bool = False,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get notifications for current user"""
    query = db.query(Notification).filter(Notification.employee_id == current_employee.id)
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    notifications = query.order_by(Notification.created_at.desc()).limit(limit).all()
    return notifications


@router.get("/unread-count")
async def get_unread_count(
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Get count of unread notifications"""
    count = db.query(Notification).filter(
        Notification.employee_id == current_employee.id,
        Notification.is_read == False
    ).count()
    
    return {"unread_count": count}


@router.post("/mark-read")
async def mark_notifications_read(
    data: NotificationMarkRead,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Mark notifications as read"""
    notifications = db.query(Notification).filter(
        Notification.id.in_(data.notification_ids),
        Notification.employee_id == current_employee.id
    ).all()
    
    for notification in notifications:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Marked {len(notifications)} notifications as read"}


@router.post("/mark-all-read")
async def mark_all_read(
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Mark all notifications as read"""
    notifications = db.query(Notification).filter(
        Notification.employee_id == current_employee.id,
        Notification.is_read == False
    ).all()
    
    for notification in notifications:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Marked {len(notifications)} notifications as read"}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_employee)
):
    """Delete a notification"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.employee_id == current_employee.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db.delete(notification)
    db.commit()
    
    return {"message": "Notification deleted"}


def create_notification(
    db: Session,
    employee_id: int,
    notification_type: str,
    title: str,
    message: str,
    link: str = None
):
    """Helper function to create a notification"""
    notification = Notification(
        employee_id=employee_id,
        type=notification_type,
        title=title,
        message=message,
        link=link
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
