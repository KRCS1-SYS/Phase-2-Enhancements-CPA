from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import SessionLocal
from app.auth.dependencies import get_current_user
from app.utils.logger import log_action

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/history/{TagID}")
def get_historical_data(TagID: str, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Execute the stored procedure
        result = db.execute(
            text("EXEC sp_GetHistoricalData @TagId = :TagId"),
            {"TagId": TagID}
        ).fetchall()

        if not result:
            historical_data = []

        # Format the results
        historical_data = [
            {
                "Timestamp": row[1].isoformat(),
                "Value": row[0] if row[0] is not None else None
            }
            for row in result
        ]

        return historical_data

    except Exception as e:
        log_action(db, action="Get Parameters Historical Data", action_data=f"An error occurred while fetching historical data: {str(e)}", username=user['id'], log_type="ERROR")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching historical data: {str(e)}"
        )
