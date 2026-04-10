"""
Modelos ORM — representan las tablas de la base de datos.

Tablas:
  categories  → Categorías de productos (Cable, Cámara, Switch, etc.)
  products    → Catálogo de productos con precio y mano de obra
  app_settings → Configuración global (márgenes, holgura)
  quotes      → Cabecera de cada cotización generada
  quote_items → Líneas de detalle de cada cotización
"""
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    ForeignKey, DateTime, Text
)
from sqlalchemy.orm import relationship
from .database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    # Slug interno para la lógica de negocio (cable, camara, rack, etc.)
    slug = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=True)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    brand = Column(String(100), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    # Unidad: "caja_305m", "pieza", "metro", "rollo"
    unit = Column(String(50), nullable=False, default="pieza")

    # Para cable: cuántos metros contiene una unidad (ej. 305 para caja de 305m)
    meters_per_unit = Column(Float, nullable=True)

    price = Column(Float, nullable=False, default=0.0)       # Precio de venta unitario (MXN)
    cost = Column(Float, nullable=False, default=0.0)        # Costo de compra (interno)
    labor_cost = Column(Float, nullable=False, default=0.0)  # Mano de obra por unidad instalada

    is_active = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)

    # Estándar de compatibilidad: "Cat5e", "Cat6", "Cat6a", "Fibra", "universal"
    # universal = compatible con cualquier tipo de cable
    standard = Column(String(20), nullable=True)

    # Ruta relativa a la imagen del producto (ej. /static/images/prod_1.jpg)
    image_url = Column(String(500), nullable=True)

    category = relationship("Category", back_populates="products")
    quote_items = relationship("QuoteItem", back_populates="product")


class AppSettings(Base):
    """
    Configuración global del sistema.
    Solo existe UN registro (id=1). Se actualiza via API.
    """
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, default=1)

    # % de holgura de cable por desperdicio/curvas (0.10 = 10%)
    cable_slack_pct = Column(Float, nullable=False, default=0.10)

    # % de margen de ganancia sobre costo (0.30 = 30%)
    profit_margin_pct = Column(Float, nullable=False, default=0.30)

    # Puertos por defecto de Patch Panel
    patch_panel_ports = Column(Integer, nullable=False, default=24)

    # Longitud estándar de la bobina/caja de cable en metros
    cable_reel_meters = Column(Float, nullable=False, default=305.0)


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(200), nullable=True)
    client_email = Column(String(200), nullable=True)
    project_name = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Parámetros del sitio
    num_nodes = Column(Integer, nullable=False)          # Nodos de red
    num_cameras = Column(Integer, nullable=False, default=0)
    avg_distance_m = Column(Float, nullable=False)       # Metros prom. rack→punto
    cable_type = Column(String(50), nullable=True)       # Cat5e, Cat6, Cat6a, Fibra

    # Totales calculados
    total_materials = Column(Float, nullable=False, default=0.0)
    total_labor = Column(Float, nullable=False, default=0.0)
    total_price = Column(Float, nullable=False, default=0.0)

    notes = Column(Text, nullable=True)

    items = relationship("QuoteItem", back_populates="quote", cascade="all, delete-orphan")


class QuoteItem(Base):
    __tablename__ = "quote_items"

    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey("quotes.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)

    description = Column(String(300), nullable=False)  # Nombre legible del ítem
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False)
    unit_price = Column(Float, nullable=False)
    unit_labor = Column(Float, nullable=False, default=0.0)
    subtotal_materials = Column(Float, nullable=False)
    subtotal_labor = Column(Float, nullable=False, default=0.0)

    quote = relationship("Quote", back_populates="items")
    product = relationship("Product", back_populates="quote_items")
