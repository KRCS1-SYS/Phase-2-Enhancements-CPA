from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, CheckConstraint, func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    role = Column(String(50), CheckConstraint("role IN ('ADMIN', 'VIEWER')"), default="VIEWER")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationship with Session table
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")


class Session(Base):
    __tablename__ = "Session"

    SessionId = Column(Integer, primary_key=True, index=True)
    UserId = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    Token = Column(String, nullable=False)
    ExpirationTime = Column(DateTime, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())
    UpdatedAt = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationship with User table
    user = relationship("User", back_populates="sessions")

class SugarPlantTags(Base):
    __tablename__ = "SugarPlantTags"

    TagId = Column(String(100), primary_key=True)
    TagName = Column(String(100), nullable=False)
    Area = Column(String(100))
    IOType = Column(String(50))
    Unit = Column(String(50))
    ApplicationName = Column(String(100))
    InstrumentDescription = Column(String(255))
    MinimumRange = Column(Float)
    MaximumRange = Column(Float)
    Low = Column(Float)
    High = Column(Float)
    CreatedAt = Column(DateTime, default=func.now())
    UpdatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
    IsActive = Column(Boolean, default=True)

class PowerPlantTags(Base):
    __tablename__ = "PowerPlantTags"

    TagId = Column(String(100), primary_key=True)
    TagName = Column(String(100), nullable=False)
    AssociatedEquipment = Column(String(100))
    Section = Column(String(100))
    SignalType = Column(String(50))
    ParameterName = Column(String(100))
    ParameterType = Column(String(50))
    MeasurementUnit = Column(String(50))
    MinimumRange = Column(Float)
    MaximumRange = Column(Float)
    Low = Column(Float)
    High = Column(Float)
    CreatedAt = Column(DateTime, default=func.now())
    UpdatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
    IsActive = Column(Boolean, default=True)

class Logs(Base):
    __tablename__ = "Logs"

    LogId = Column(Integer, primary_key=True, index=True)
    Action = Column(String(255), nullable=False)
    Username = Column(String(100), nullable=True)
    ActionData = Column(Text, nullable=True)
    Type = Column(String(50), nullable=False)
    CreatedAt = Column(DateTime, default=func.now())
    UpdatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
