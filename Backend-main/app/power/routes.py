from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import SessionLocal
from app.models import PowerPlantTags
from app.power.schemas import EquipmentResponse, ParameterResponse, PowerPlantTagUpdate
from app.auth.dependencies import get_current_user, get_current_admin_user
from app.utils.logger import log_action
import asyncio

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/equipments", response_model=list[EquipmentResponse])
def get_associated_equipments(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Query distinct sections and associated equipment
    results = db.query(PowerPlantTags.Section, PowerPlantTags.AssociatedEquipment)\
                .distinct().all()

    if not results:
        log_action(db, action="Get Equipments", action_data="No equipment found", username=user['id'], log_type="ERROR")
        raise HTTPException(status_code=404, detail="No equipment found")

    return [{"Section": row[0], "AssociatedEquipment": row[1]} for row in results]

@router.websocket("/realtime")
async def get_real_time_value_by_equipment(websocket: WebSocket,  db: Session = Depends(get_db)):
    await websocket.accept()
    try:
        while True:
            # Execute the stored procedure to fetch all tag values for the specified associated equipment
            results = db.execute(
                text("EXEC sp_GetPowerRealTimeValues")
            ).fetchall()

            # Prepare the response data
            response = []
            for row in results:
                response.append({
                    "TagID": row[0],  
                    "Value": row[1],  
                    "State": row[2]   
                })

            # Send the response as JSON over WebSocket
            await websocket.send_json(response)

            # Sleep for a while before querying again (adjust interval as needed)
            await asyncio.sleep(4)

    except WebSocketDisconnect:
        print(f"WebSocket disconnected Power Realtime")
    except Exception as e:
        log_action(db, action="Get Real Time Value of Parameters", action_data=f"Error in WebSocket Power realtime: {e}", log_type="ERROR")

@router.websocket("/state/{state}")
async def get_power_tags_by_state(websocket: WebSocket, state: str, db: Session = Depends(get_db)):
    await websocket.accept()
    state_to_procedure = {
        "Critical": "sp_GetPowerCriticalTags",
        "Caution": "sp_GetPowerCautionTags",
        "Ideal": "sp_GetPowerIdealTags"
    }
    # Get the stored procedure name based on the state
    procedure_name = state_to_procedure.get(state)
    if not procedure_name:
        raise HTTPException(status_code=404, detail="Invalid state provided. Valid states are: Critical, Caution, Ideal")
    try:
        while True:
            # Execute the corresponding stored procedure dynamically
            results = db.execute(
                text(f"EXEC {procedure_name}"),
            ).fetchall()

            # Prepare the response data
            response = []
            for row in results:
                response.append({
                    "TagId": row[0], 
                    "TagName": row[1], 
                    "Unit": row[2], 
                    "ParameterName": row[3],
                    "SignalType": row[4],
                    "MinimumRange": row[5],
                    "MaximumRange": row[6],
                    "Low": row[7] if row[7] is not None else None,  # Handle NULL values
                    "High": row[8] if row[8] is not None else None,   # Handle NULL values,
                    "Section": row[9],
                    "AssociatedEquipment": row[10],
                    "Value": row[11]
                })

            # Send the response as JSON over WebSocket
            await websocket.send_json(response)

            # Sleep for a while before querying again
            await asyncio.sleep(4)

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for state: {state}")
    except Exception as e:
        log_action(db, action="Get Power tags by state", action_data=f"Error in WebSocket for Power state {state}: {e}", log_type="ERROR")

@router.get("/all/tags", response_model=list[ParameterResponse])
def get_all_parameters(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Query the database for parameters
    parameters = db.query(
        PowerPlantTags.TagId, 
        PowerPlantTags.TagName, 
        PowerPlantTags.AssociatedEquipment,
        PowerPlantTags.MeasurementUnit,
        PowerPlantTags.ParameterName, 
        PowerPlantTags.SignalType, 
        PowerPlantTags.MinimumRange,
        PowerPlantTags.MaximumRange, 
        PowerPlantTags.Low, 
        PowerPlantTags.High,
        PowerPlantTags.IsActive,
        PowerPlantTags.Section
    ).all()

    if not parameters:
        log_action(db, action="Get Power all Parameters", action_data="No power parameters found!", username=user['id'], log_type="ERROR")
        raise HTTPException(
            status_code=404, 
            detail="No power parameters found!"
        )

    return [
    {
        "TagId": param[0],
        "TagName": param[1],
        "AssociatedEquipment": param[2],
        "Unit": param[3],
        "ParameterName": param[4],
        "SignalType": param[5],
        "MinimumRange": param[6],
        "MaximumRange": param[7],
        "Low": param[8] if param[8] is not None else None,  # Handle NULL values
        "High": param[9] if param[9] is not None else None,   # Handle NULL values
        "IsActive": param[10],
        "Section": param[11]
    }
    for param in parameters
]

@router.put("/tags/{tag_id}", response_model=ParameterResponse)
def update_power_plant_tag(
    tag_id: str,
    tag_update: PowerPlantTagUpdate,
    user: dict = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update a PowerPlantTag's TagName, MeasurementUnit, ParameterName, Low, High, and IsActive fields.
    """
    # Fetch the tag by ID
    tag = db.query(PowerPlantTags).filter(PowerPlantTags.TagId == tag_id).first()
    if not tag:
        log_action(
            db,
            action="Update PowerPlantTag",
            action_data=f"Tag with ID {tag_id} not found",
            username=user['id'],
            log_type="ERROR"
        )
        raise HTTPException(status_code=404, detail="PowerPlantTag not found")

    # Update only the allowed fields
    update_data = tag_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tag, key, value)

    try:
        db.commit()
        db.refresh(tag)
        log_action(
            db,
            action="Update PowerPlantTag",
            action_data=f"Updated Tag ID {tag_id}",
            username=user['id'],
            log_type="INFO"
        )
    except Exception as e:
        db.rollback()
        log_action(
            db,
            action="Update PowerPlantTag",
            action_data=f"Error updating Tag ID {tag_id}: {e}",
            username=user['id'],
            log_type="ERROR"
        )
        raise HTTPException(status_code=500, detail="Internal Server Error")

    return {
        "TagId": tag.TagId,
        "TagName": tag.TagName,
        "AssociatedEquipment": tag.AssociatedEquipment,
        "Unit": tag.MeasurementUnit,
        "ParameterName": tag.ParameterName,
        "Low": tag.Low,
        "High": tag.High,
        "IsActive": tag.IsActive,
        "Section": tag.Section,
        "SignalType": tag.SignalType,
        "MinimumRange": tag.MinimumRange,
        "MaximumRange": tag.MaximumRange,
    }