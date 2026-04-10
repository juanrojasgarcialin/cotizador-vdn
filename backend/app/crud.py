"""
Operaciones CRUD reutilizables para Categorías, Productos y Configuración.
Los routers llaman estas funciones en lugar de hacer queries directamente.
"""
import math
from typing import List, Optional
from sqlalchemy.orm import Session
from . import models, schemas


# ─── CATEGORIES ───────────────────────────────────────────────────────────────

def get_categories(db: Session) -> List[models.Category]:
    return db.query(models.Category).order_by(models.Category.name).all()

def get_category(db: Session, category_id: int) -> Optional[models.Category]:
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def create_category(db: Session, data: schemas.CategoryCreate) -> models.Category:
    cat = models.Category(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

def delete_category(db: Session, category_id: int) -> bool:
    cat = get_category(db, category_id)
    if not cat:
        return False
    db.delete(cat)
    db.commit()
    return True


# ─── PRODUCTS ─────────────────────────────────────────────────────────────────

def get_products(
    db: Session,
    category_id: Optional[int] = None,
    active_only: bool = True,
    skip: int = 0,
    limit: int = 100,
) -> List[models.Product]:
    q = db.query(models.Product)
    if category_id:
        q = q.filter(models.Product.category_id == category_id)
    if active_only:
        q = q.filter(models.Product.is_active == True)
    return q.order_by(models.Product.name).offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int) -> Optional[models.Product]:
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_product(db: Session, data: schemas.ProductCreate) -> models.Product:
    prod = models.Product(**data.model_dump())
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod

def update_product(
    db: Session, product_id: int, data: schemas.ProductUpdate
) -> Optional[models.Product]:
    prod = get_product(db, product_id)
    if not prod:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(prod, field, value)
    db.commit()
    db.refresh(prod)
    return prod

def delete_product(db: Session, product_id: int) -> bool:
    prod = get_product(db, product_id)
    if not prod:
        return False
    db.delete(prod)
    db.commit()
    return True

def bulk_update_prices(db: Session, data: schemas.BulkPriceUpdate) -> int:
    """
    Multiplica los precios por el factor dado.
    Retorna la cantidad de productos actualizados.
    """
    q = db.query(models.Product).filter(models.Product.is_active == True)
    if data.category_id:
        q = q.filter(models.Product.category_id == data.category_id)
    products = q.all()
    for prod in products:
        prod.price = round(prod.price * data.factor, 2)
    db.commit()
    return len(products)


# ─── APP SETTINGS ─────────────────────────────────────────────────────────────

def get_settings(db: Session) -> models.AppSettings:
    settings = db.query(models.AppSettings).filter(models.AppSettings.id == 1).first()
    if not settings:
        settings = models.AppSettings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_settings(db: Session, data: schemas.AppSettingsUpdate) -> models.AppSettings:
    settings = get_settings(db)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    db.refresh(settings)
    return settings


# ─── QUOTES ───────────────────────────────────────────────────────────────────

def get_quotes(db: Session, skip: int = 0, limit: int = 50) -> List[models.Quote]:
    return (
        db.query(models.Quote)
        .order_by(models.Quote.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_quote(db: Session, quote_id: int) -> Optional[models.Quote]:
    return db.query(models.Quote).filter(models.Quote.id == quote_id).first()

def delete_quote(db: Session, quote_id: int) -> bool:
    quote = get_quote(db, quote_id)
    if not quote:
        return False
    db.delete(quote)
    db.commit()
    return True
