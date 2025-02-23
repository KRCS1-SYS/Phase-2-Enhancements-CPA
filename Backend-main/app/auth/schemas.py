from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    status: str
    message: str
    token: str

class LogoutResponse(BaseModel):
    status: str
    message: str
