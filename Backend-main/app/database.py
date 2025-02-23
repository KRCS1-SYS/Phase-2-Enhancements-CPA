from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

SQLALCHEMY_DATABASE_URL = (
    f"mssql+pyodbc://{settings.DB_USERNAME}:{settings.DB_PASSWORD}"
    f"@{settings.DB_HOST}/{settings.DB_NAME}?driver=ODBC+Driver+17+for+SQL+Server"
)

# SQLALCHEMY_DATABASE_URL = (
#     "mssql+pyodbc://sa:admin%40123@localhost\\SQLEXPRESS/GSMA_SIT?driver=ODBC+Driver+17+for+SQL+Server"
# )

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
