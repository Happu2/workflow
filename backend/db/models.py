from sqlalchemy import Column, Integer, Text, JSON, DateTime, ForeignKey, String, Boolean
from sqlalchemy.sql import func
from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Stack(Base):
    __tablename__ = "stacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    stack_id = Column(
        Integer,
        ForeignKey("stacks.id", ondelete="CASCADE"),
        nullable=False
    )
    nodes = Column(JSON, nullable=False)
    edges = Column(JSON, nullable=False)


class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    stack_id = Column(Integer, nullable=False)
    user_query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ExecutionLog(Base):
    __tablename__ = "execution_logs"

    id = Column(Integer, primary_key=True, index=True)
    stack_id = Column(Integer, ForeignKey("stacks.id"), nullable=False)
    user_query = Column(Text, nullable=False)
    component = Column(String(50), nullable=False)  # e.g., "knowledgeBase", "llm", "webSearch"
    status = Column(String(20), nullable=False)  # "success", "error", "info"
    message = Column(Text, nullable=False)
    execution_time = Column(DateTime(timezone=True), server_default=func.now())
