from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Stack, Workflow, User
from api.auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/save")
def save(payload: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stack = Stack(
        name=payload["name"],
        description=payload.get("description"),
        user_id=current_user.id
    )
    db.add(stack)
    db.commit()
    db.refresh(stack)

    workflow = Workflow(
        stack_id=stack.id,
        nodes=payload["nodes"],
        edges=payload["edges"]
    )
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return {"stack_id": stack.id}


@router.get("/stacks")
def get_stacks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stacks = db.query(Stack).filter(Stack.user_id == current_user.id).all()
    return [{"id": s.id, "name": s.name, "description": s.description, "created_at": s.created_at} for s in stacks]


@router.get("/stack/{stack_id}")
def get_stack(stack_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stack = db.query(Stack).filter(Stack.id == stack_id, Stack.user_id == current_user.id).first()
    if not stack:
        raise HTTPException(status_code=404, detail="Stack not found")

    workflow = db.query(Workflow).filter(Workflow.stack_id == stack_id).first()
    return {
        "id": stack.id,
        "name": stack.name,
        "description": stack.description,
        "nodes": workflow.nodes if workflow else [],
        "edges": workflow.edges if workflow else []
    }
