from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import SessionLocal
from app.sugar.schemas import AreaResponse, ParameterResponse, SugarPlantTagUpdate
from app.auth.dependencies import get_current_user, get_current_admin_user
from app.models import SugarPlantTags
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

@router.get("/area", response_model=AreaResponse)
def get_areas(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Query distinct areas from the database
    areasDetails = db.query(SugarPlantTags.Area).distinct().all()
    if not areasDetails:
        log_action(db, action="Get Areas", action_data="No areas found", username=user['id'], log_type="ERROR")
        raise HTTPException(status_code=404, detail="No areas found")
    areas = [area[0] for area in areasDetails]
    return {"areas": areas}

@router.websocket("/realtime")
async def get_real_time_value(websocket: WebSocket, db: Session = Depends(get_db)):
    await websocket.accept()
    try:
        while True:
            # Execute the stored procedure to fetch all tag values for the specified Area
            results = db.execute(
                text("EXEC sp_GetSugarRealTimeValues")
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
        print(f"WebSocket disconnected for Sugar realtime")
    except Exception as e:
        log_action(db, action="Get Real Time Value of Parameters", action_data=f"Error in WebSocket Sugar realtime: {e}", log_type="ERROR")

@router.websocket("/state/{state}")
async def get_sugar_tags_by_state(websocket: WebSocket, state: str, db: Session = Depends(get_db)):
    await websocket.accept()
    state_to_procedure = {
        "Critical": "sp_GetSugarCriticalTags",
        "Caution": "sp_GetSugarCautionTags",
        "Ideal": "sp_GetSugarIdealTags"
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
                    "InstrumentDescription": row[3],
                    "IOType": row[4],
                    "MinimumRange": row[5],
                    "MaximumRange": row[6],
                    "Low": row[7] if row[7] is not None else None,  # Handle NULL values
                    "High": row[8] if row[8] is not None else None,  # Handle NULL values
                    "ApplicationName": row[9],
                    "Area": row[10],
                    "Value": row[11]
                })

            # Send the response as JSON over WebSocket
            await websocket.send_json(response)

            # Sleep for a while before querying again
            await asyncio.sleep(4)

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for state: {state}")
    except Exception as e:
        log_action(db, action="Get Sugar tags by state", action_data=f"Error in WebSocket for Sugar state {state}: {e}", log_type="ERROR")

@router.get("/all/tags", response_model=list[ParameterResponse])
def get_all_parameters(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Query all tags
    parameters = db.query(
        SugarPlantTags.TagId,
        SugarPlantTags.TagName,
        SugarPlantTags.Area,
        SugarPlantTags.Unit,
        SugarPlantTags.InstrumentDescription,
        SugarPlantTags.IOType,
        SugarPlantTags.MinimumRange,
        SugarPlantTags.MaximumRange,
        SugarPlantTags.Low,
        SugarPlantTags.High,
        SugarPlantTags.IsActive,
        SugarPlantTags.ApplicationName
    ).all()
    if not parameters:
        log_action(db, action="Get All Sugar Parameters", action_data="No sugar parameters found!", username=user['id'], log_type="ERROR")
        raise HTTPException(status_code=404, detail="No sugar parameters found!")
    return [
    {
        "TagId": param[0],
        "TagName": param[1],
        "Area": param[2],
        "Unit": param[3],
        "InstrumentDescription": param[4],
        "IOType": param[5],
        "MinimumRange": param[6],
        "MaximumRange": param[7],
        "Low": param[8] if param[8] is not None else None,  # Handle NULL values
        "High": param[9] if param[9] is not None else None,   # Handle NULL values
        "IsActive": param[10],
        "ApplicationName": param[11]
    }
    for param in parameters
]

@router.put("/tags/{tag_id}", response_model=ParameterResponse)
def update_sugar_plant_tag(
    tag_id: str,
    tag_update: SugarPlantTagUpdate,
    user: dict = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update a SugarPlantTag's TagName, Unit, InstrumentDescription, Low, High, and IsActive fields.
    """
    # Fetch the tag by ID
    tag = db.query(SugarPlantTags).filter(SugarPlantTags.TagId == tag_id).first()
    if not tag:
        log_action(
            db,
            action="Update SugarPlantTag",
            action_data=f"Tag with ID {tag_id} not found",
            username=user['id'],
            log_type="ERROR"
        )
        raise HTTPException(status_code=404, detail="SugarPlantTag not found")

    # Update only the allowed fields
    update_data = tag_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tag, key, value)

    try:
        db.commit()
        db.refresh(tag)
        log_action(
            db,
            action="Update SugarPlantTag",
            action_data=f"Updated Tag ID {tag_id}",
            username=user['id'],
            log_type="INFO"
        )
    except Exception as e:
        db.rollback()
        log_action(
            db,
            action="Update SugarPlantTag",
            action_data=f"Error updating Tag ID {tag_id}: {e}",
            username=user['id'],
            log_type="ERROR"
        )
        raise HTTPException(status_code=500, detail="Internal Server Error")

    return {
        "TagId": tag.TagId,
        "TagName": tag.TagName,
        "Area": tag.Area,
        "Unit": tag.Unit,
        "InstrumentDescription": tag.InstrumentDescription,
        "IOType": tag.IOType,
        "MinimumRange": tag.MinimumRange,
        "MaximumRange": tag.MaximumRange,
        "Low": tag.Low,
        "High": tag.High,
        "IsActive": tag.IsActive,
        "ApplicationName": tag.ApplicationName
    }