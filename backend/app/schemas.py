"""
Schemas Pydantic — validación de entrada/salida en la API.
Separamos los schemas en: Base (campos comunes), Create (entrada), Read (salida con id).
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, field_validator


# ─── CATEGORY ────────────────────────────────────────────────────────────────

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int
    model_config = {"from_attributes": True}


# ─── PRODUCT ─────────────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    category_id: int
    unit: str = "pieza"
    meters_per_unit: Optional[float] = None
    price: float
    cost: float = 0.0
    labor_cost: float = 0.0
    is_active: bool = True
    notes: Optional[str] = None
    standard: Optional[str] = None   # Cat5e | Cat6 | Cat6a | Fibra | universal
    image_url: Optional[str] = None

    @field_validator("price", "cost", "labor_cost")
    @classmethod
    def must_be_non_negative(cls, v: float) -> float:
        if v < 0:
            raise ValueError("El valor no puede ser negativo")
        return v

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    """Todos los campos opcionales para actualizaciones parciales (PATCH)."""
    name: Optional[str] = None
    brand: Optional[str] = None
    category_id: Optional[int] = None
    unit: Optional[str] = None
    meters_per_unit: Optional[float] = None
    price: Optional[float] = None
    cost: Optional[float] = None
    labor_cost: Optional[float] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None
    standard: Optional[str] = None
    image_url: Optional[str] = None

class ProductRead(ProductBase):
    id: int
    category: CategoryRead
    model_config = {"from_attributes": True}

class BulkPriceUpdate(BaseModel):
    """Actualización masiva: aplica un factor multiplicador a todos los precios."""
    factor: float  # ej. 1.15 = subir 15%, 0.90 = bajar 10%
    category_id: Optional[int] = None  # Si None, aplica a todos

    @field_validator("factor")
    @classmethod
    def factor_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("El factor debe ser mayor a 0")
        return v


# ─── APP SETTINGS ─────────────────────────────────────────────────────────────

class AppSettingsRead(BaseModel):
    id: int
    cable_slack_pct: float
    profit_margin_pct: float
    patch_panel_ports: int
    cable_reel_meters: float
    model_config = {"from_attributes": True}

class AppSettingsUpdate(BaseModel):
    cable_slack_pct: Optional[float] = None
    profit_margin_pct: Optional[float] = None
    patch_panel_ports: Optional[int] = None
    cable_reel_meters: Optional[float] = None

    @field_validator("cable_slack_pct", "profit_margin_pct")
    @classmethod
    def pct_range(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and not (0 <= v <= 1):
            raise ValueError("El porcentaje debe estar entre 0 y 1 (ej. 0.10 para 10%)")
        return v


# ─── COTIZACIÓN — INPUT ───────────────────────────────────────────────────────

class QuoteRequest(BaseModel):
    """Lo que el cliente envía para generar una cotización."""
    client_name: Optional[str] = None
    client_email: Optional[str] = None
    project_name: Optional[str] = None

    # Parámetros del sitio
    num_nodes: int
    num_cameras: int = 0
    avg_distance_m: float          # metros promedio rack → punto
    cable_type: str = "Cat6"       # Cat5e | Cat6 | Cat6a | Fibra

    # Selección de productos (IDs de la BD)
    cable_product_id: Optional[int] = None
    conduit_product_id: Optional[int] = None    # Tubería/canalización
    keystone_product_id: Optional[int] = None
    faceplate_product_id: Optional[int] = None
    patch_panel_product_id: Optional[int] = None
    patch_cord_1m_product_id: Optional[int] = None
    patch_cord_3m_product_id: Optional[int] = None
    switch_product_id: Optional[int] = None

    # Cámaras: lista de (product_id, cantidad)
    camera_items: List[dict] = []  # [{"product_id": 5, "quantity": 4}]

    notes: Optional[str] = None

    @field_validator("num_nodes")
    @classmethod
    def nodes_positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("El número de nodos debe ser mayor a 0")
        return v

    @field_validator("num_cameras")
    @classmethod
    def cameras_non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("El número de cámaras no puede ser negativo")
        return v

    @field_validator("avg_distance_m")
    @classmethod
    def distance_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("La distancia promedio debe ser mayor a 0")
        return v


# ─── COTIZACIÓN — OUTPUT ──────────────────────────────────────────────────────

class QuoteItemRead(BaseModel):
    id: int
    description: str
    quantity: float
    unit: str
    unit_price: float
    unit_labor: float
    subtotal_materials: float
    subtotal_labor: float
    model_config = {"from_attributes": True}

class QuoteRead(BaseModel):
    id: int
    client_name: Optional[str]
    client_email: Optional[str]
    project_name: Optional[str]
    created_at: datetime
    num_nodes: int
    num_cameras: int
    avg_distance_m: float
    cable_type: Optional[str]
    total_materials: float
    total_labor: float
    total_price: float
    notes: Optional[str]
    items: List[QuoteItemRead]
    model_config = {"from_attributes": True}

class QuoteSummary(BaseModel):
    """Lista de cotizaciones sin el detalle de ítems."""
    id: int
    client_name: Optional[str]
    project_name: Optional[str]
    created_at: datetime
    total_price: float
    model_config = {"from_attributes": True}
