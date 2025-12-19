from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.chat import router as chat_router
from api.pdf import router as pdf_router
from api.workflow import router as workflow_router
from api.logs import router as logs_router
from api.auth import router as auth_router
from db.database import engine
from db import models


# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="GenAI Workflow Builder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(chat_router, prefix="/chat")
app.include_router(pdf_router, prefix="/pdf")
app.include_router(workflow_router, prefix="/workflow")
app.include_router(logs_router, prefix="/logs")


@app.get("/health")
def health():
    return {"status": "ok"}
