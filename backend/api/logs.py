from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import ExecutionLog

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/execution-logs/{stack_id}")
def get_execution_logs(stack_id: int, db: Session = Depends(get_db)):
    """Get execution logs for a specific stack"""
    logs = db.query(ExecutionLog).filter(ExecutionLog.stack_id == stack_id).order_by(ExecutionLog.execution_time.desc()).all()
    return [{
        "id": log.id,
        "component": log.component,
        "status": log.status,
        "message": log.message,
        "execution_time": log.execution_time,
        "user_query": log.user_query
    } for log in logs]


@router.get("/execution-logs")
def get_all_execution_logs(limit: int = 100, db: Session = Depends(get_db)):
    """Get recent execution logs across all stacks"""
    logs = db.query(ExecutionLog).order_by(ExecutionLog.execution_time.desc()).limit(limit).all()
    return [{
        "id": log.id,
        "stack_id": log.stack_id,
        "component": log.component,
        "status": log.status,
        "message": log.message,
        "execution_time": log.execution_time,
        "user_query": log.user_query
    } for log in logs]