from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import crud, schemas
from ..logic.calculator import build_quote

router = APIRouter(prefix="/quotes", tags=["Cotizaciones"])


@router.post("/", response_model=schemas.QuoteRead, status_code=201)
def create_quote(req: schemas.QuoteRequest, db: Session = Depends(get_db)):
    """
    Genera una cotización completa a partir de los parámetros del cliente.
    Ejecuta toda la lógica de negocio (cálculo de cable, remates, panels, switch).
    """
    quote = build_quote(db, req)
    return quote


@router.get("/", response_model=List[schemas.QuoteSummary])
def list_quotes(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    return crud.get_quotes(db, skip=skip, limit=limit)


@router.get("/{quote_id}", response_model=schemas.QuoteRead)
def get_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = crud.get_quote(db, quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    return quote


@router.delete("/{quote_id}", status_code=204)
def delete_quote(quote_id: int, db: Session = Depends(get_db)):
    if not crud.delete_quote(db, quote_id):
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
