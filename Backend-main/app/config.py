from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_NAME: str
    SECRET_KEY: str
    APP_URL: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60*24

    class Config:
        env_file = ".env"

settings = Settings()
