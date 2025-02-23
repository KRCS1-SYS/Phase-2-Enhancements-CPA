from pydantic import BaseModel, EmailStr

class UserResponse(BaseModel):
    UserId: int
    Name: str
    Email: EmailStr
    Role: str

class AddUserRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class AddUserResponse(BaseModel):
    status: str
    message: str
    UserId: int

class CurrentUserResponse(BaseModel):
    Name: str
    Email: str
    Role: str
