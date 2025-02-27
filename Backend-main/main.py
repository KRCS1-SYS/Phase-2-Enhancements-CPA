from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.auth.routes import auth_router
from app.users.routes import router as users_router
from app.sugar.routes import router as sugar_router
from app.power.routes import router as power_router
from app.opc.routes import router as opc_router
from app.config import settings

app = FastAPI()

Base.metadata.create_all(bind=engine)

allowed_origins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://115.243.35.122:8080",
    "https://specp.zuarione.com"
]

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Include the users router
app.include_router(users_router, prefix="/users", tags=["Users Management"])

# Include Sugar Plant routes
app.include_router(sugar_router, prefix="/sugar", tags=["Sugar Plant"])

# Include Power Plant routes
app.include_router(power_router, prefix="/power", tags=["Power Plant"])

# Include OPC routes
app.include_router(opc_router, prefix="/opc", tags=["OPC Data"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)
