from typing import Optional
from pydantic import BaseModel, Field

class AreaResponse(BaseModel):
    areas: list[str]

class ParameterResponse(BaseModel):
    TagId: str
    TagName: str
    Area: str
    Unit: str
    InstrumentDescription: str
    IOType: str
    MinimumRange: float
    MaximumRange: float
    Low: Optional[float] = None
    High: Optional[float] = None
    IsActive: bool
    ApplicationName: str
    
class SugarPlantTagUpdate(BaseModel):
    TagName: Optional[str] = Field(None, description="Name of the Tag")
    Unit: Optional[str] = Field(None, description="Unit of Measurement")
    InstrumentDescription: Optional[str] = Field(None, description="Description of the Instrument")
    Low: Optional[float] = Field(None, description="Low threshold value")
    High: Optional[float] = Field(None, description="High threshold value")
    IsActive: Optional[bool] = Field(None, description="Activation status of the Tag")

    class Config:
        orm_mode = True