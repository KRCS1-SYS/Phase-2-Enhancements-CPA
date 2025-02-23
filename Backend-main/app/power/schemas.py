from typing import Optional
from pydantic import BaseModel, Field

class EquipmentResponse(BaseModel):
    Section: str
    AssociatedEquipment: str

class ParameterResponse(BaseModel):
    TagId: str
    TagName: str
    AssociatedEquipment: str
    Unit: str
    ParameterName: str
    SignalType: str
    MinimumRange: float
    MaximumRange: float
    Low: Optional[float] = None
    High: Optional[float] = None
    IsActive: bool
    Section: str
    
class PowerPlantTagUpdate(BaseModel):
    TagName: Optional[str] = Field(None, description="Name of the Tag")
    MeasurementUnit: Optional[str] = Field(None, description="Unit of Measurement")
    ParameterName: Optional[str] = Field(None, description="Name of the Parameter")
    Low: Optional[float] = Field(None, description="Low threshold value")
    High: Optional[float] = Field(None, description="High threshold value")
    IsActive: Optional[bool] = Field(None, description="Activation status of the Tag")

    class Config:
        orm_mode = True