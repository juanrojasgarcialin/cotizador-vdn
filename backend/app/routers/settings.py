from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/settings", tags=["Configuración"])


@router.get("/", response_model=schemas.AppSettingsRead)
def get_settings(db: Session = Depends(get_db)):
    return crud.get_settings(db)


@router.patch("/", response_model=schemas.AppSettingsRead)
def update_settings(data: schemas.AppSettingsUpdate, db: Session = Depends(get_db)):
    return crud.update_settings(db, data)
