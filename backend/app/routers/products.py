import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/products", tags=["Productos"])

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "static", "images")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.get("/", response_model=List[schemas.ProductRead])
def list_products(
    category_id: Optional[int] = Query(None, description="Filtrar por categoría"),
    active_only: bool = Query(True),
    standard: Optional[str] = Query(None, description="Filtrar por estándar: Cat6, Cat6a, etc."),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    products = crud.get_products(db, category_id=category_id, active_only=active_only, skip=skip, limit=limit)
    if standard:
        products = [
            p for p in products
            if p.standard is None or p.standard == "universal" or p.standard == standard
        ]
    return products


@router.get("/{product_id}", response_model=schemas.ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)):
    prod = crud.get_product(db, product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return prod


@router.post("/", response_model=schemas.ProductRead, status_code=201)
def create_product(data: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, data)


@router.patch("/{product_id}", response_model=schemas.ProductRead)
def update_product(product_id: int, data: schemas.ProductUpdate, db: Session = Depends(get_db)):
    prod = crud.update_product(db, product_id, data)
    if not prod:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return prod


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    if not crud.delete_product(db, product_id):
        raise HTTPException(status_code=404, detail="Producto no encontrado")


@router.post("/bulk-price-update", response_model=dict)
def bulk_price_update(data: schemas.BulkPriceUpdate, db: Session = Depends(get_db)):
    """Actualiza precios de todos los productos (o los de una categoría) por un factor."""
    count = crud.bulk_update_prices(db, data)
    return {"updated": count, "factor_applied": data.factor}


@router.post("/{product_id}/image", response_model=schemas.ProductRead)
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Sube una imagen para el producto. Acepta JPG, PNG o WEBP."""
    prod = crud.get_product(db, product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Formato no permitido. Usa: {', '.join(ALLOWED_EXTENSIONS)}")

    # Borrar imagen previa si existe
    if prod.image_url:
        old_path = os.path.join(os.path.dirname(__file__), "..", "..", prod.image_url.lstrip("/"))
        if os.path.exists(old_path):
            os.remove(old_path)

    filename = f"prod_{product_id}_{uuid.uuid4().hex[:8]}{ext}"
    save_path = os.path.join(IMAGES_DIR, filename)
    os.makedirs(IMAGES_DIR, exist_ok=True)

    content = await file.read()
    with open(save_path, "wb") as f:
        f.write(content)

    image_url = f"/static/images/{filename}"
    prod = crud.update_product(db, product_id, schemas.ProductUpdate(image_url=image_url))
    return prod


@router.delete("/{product_id}/image", response_model=schemas.ProductRead)
def delete_product_image(product_id: int, db: Session = Depends(get_db)):
    """Elimina la imagen del producto."""
    prod = crud.get_product(db, product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if prod.image_url:
        path = os.path.join(os.path.dirname(__file__), "..", "..", prod.image_url.lstrip("/"))
        if os.path.exists(path):
            os.remove(path)
    return crud.update_product(db, product_id, schemas.ProductUpdate(image_url=None))
