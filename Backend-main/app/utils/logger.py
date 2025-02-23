from sqlalchemy.orm import Session
from app.models import Logs

def log_action(db: Session, action: str, username: str = None, action_data: str = None, log_type: str = "INFO"):
    """
    Utility to log actions or errors in the Logs table.

    Parameters:
        db (Session): Database session
        action (str): Description of the action performed
        username (str, optional): Username of the user performing the action
        action_data (str, optional): Additional data related to the action
        log_type (str): Type of log (e.g., "INFO", "ERROR", "WARNING")

    Returns:
        None
    """
    try:
        # Create a new log entry
        log_entry = Logs(
            Action=action,
            Username=username,
            ActionData=action_data,
            Type=log_type
        )
        db.add(log_entry)  # Add the log entry to the session
        db.commit()        # Commit the transaction
    except Exception as e:
        print(f"Failed to log action: {e}")
