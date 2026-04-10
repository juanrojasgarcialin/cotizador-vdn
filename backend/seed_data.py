"""
Poblar la base de datos con categorías y productos de ejemplo.

Ejecutar una sola vez:
    cd backend
    python seed_data.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def seed():
    # Evitar duplicados
    if db.query(models.Category).count() > 0:
        print("La base de datos ya tiene datos. Limpia cotizador.db antes de re-sembrar.")
        return

    # ── CATEGORÍAS ────────────────────────────────────────────────────────────
    cats = {
        "cable":      models.Category(name="Cable UTP/FTP",       slug="cable",      description="Cableado horizontal Cat5e/Cat6/Cat6a y Fibra"),
        "tuberia":    models.Category(name="Tubería y Canalización", slug="tuberia",  description="PVC, EMT, charola portacable"),
        "camara":     models.Category(name="Cámaras IP / Análogas", slug="camara",   description="Domo, bala, PTZ, fisheye"),
        "rack":       models.Category(name="Racks y Gabinetes",    slug="rack",       description="Rack de piso y pared, gabinetes"),
        "remate":     models.Category(name="Remates y Conectores", slug="remate",     description="Keystones, faceplates, patch cords, plugs"),
        "patch_panel":models.Category(name="Patch Panels",         slug="patch_panel",description="Paneles de 24 y 48 puertos"),
        "activo":     models.Category(name="Equipos Activos",      slug="activo",     description="Switches PoE, NVR, DVR"),
    }
    for cat in cats.values():
        db.add(cat)
    db.flush()

    # ── PRODUCTOS ─────────────────────────────────────────────────────────────
    products = [
        # CABLES
        # CABLES — standard indica con qué categoría son compatibles
        models.Product(name="Cable Cat6 UTP 4 Pares",      brand="Belden",   category_id=cats["cable"].id,
                       unit="caja_305m", meters_per_unit=305, price=1850.00, cost=1400.00, labor_cost=120.00,
                       standard="Cat6", notes="Caja 305m, CM/CMR, color azul"),
        models.Product(name="Cable Cat6 UTP 4 Pares",      brand="Panduit",  category_id=cats["cable"].id,
                       unit="caja_305m", meters_per_unit=305, price=2100.00, cost=1600.00, labor_cost=120.00,
                       standard="Cat6"),
        models.Product(name="Cable Cat6a UTP 4 Pares",     brand="Belden",   category_id=cats["cable"].id,
                       unit="caja_305m", meters_per_unit=305, price=3200.00, cost=2500.00, labor_cost=150.00,
                       standard="Cat6a"),
        models.Product(name="Cable Cat5e UTP 4 Pares",     brand="Vexcom",   category_id=cats["cable"].id,
                       unit="caja_305m", meters_per_unit=305, price=1100.00, cost=850.00,  labor_cost=100.00,
                       standard="Cat5e"),
        models.Product(name="Fibra Optica Monomodo 6 Hilos", brand="Corning", category_id=cats["cable"].id,
                       unit="metro",    meters_per_unit=1,   price=28.00,   cost=18.00,   labor_cost=15.00,
                       standard="Fibra"),

        # TUBERÍA — universal: sirve para cualquier cable
        models.Product(name="Tuberia PVC 3/4\" Pared Delgada", brand="Amanco", category_id=cats["tuberia"].id,
                       unit="tramo_3m", meters_per_unit=3, price=35.00, cost=22.00, labor_cost=18.00,
                       standard="universal"),
        models.Product(name="Tuberia EMT 3/4\"",               brand="Conduit", category_id=cats["tuberia"].id,
                       unit="tramo_3m", meters_per_unit=3, price=85.00, cost=60.00, labor_cost=25.00,
                       standard="universal"),
        models.Product(name="Charola Portacable 4\" Lisa",      brand="Charofil",category_id=cats["tuberia"].id,
                       unit="tramo_3m", meters_per_unit=3, price=180.00, cost=130.00, labor_cost=40.00,
                       standard="universal"),

        # CÁMARAS — universal: no dependen del cable
        models.Product(name="Camara IP Domo 4MP H.265",        brand="Hikvision", category_id=cats["camara"].id,
                       unit="pieza", price=1200.00, cost=900.00, labor_cost=350.00,
                       standard="universal", notes="DS-2CD2143G2-I, IR 40m, IP67"),
        models.Product(name="Camara IP Bala 4MP H.265",        brand="Hikvision", category_id=cats["camara"].id,
                       unit="pieza", price=1350.00, cost=1000.00, labor_cost=350.00,
                       standard="universal"),
        models.Product(name="Camara IP PTZ 2MP 20x Zoom",      brand="Dahua",     category_id=cats["camara"].id,
                       unit="pieza", price=5800.00, cost=4500.00, labor_cost=600.00,
                       standard="universal"),
        models.Product(name="Camara Analogica Domo 1080p TVI", brand="Hikvision", category_id=cats["camara"].id,
                       unit="pieza", price=650.00,  cost=480.00,  labor_cost=280.00,
                       standard="universal"),
        models.Product(name="Camara Analogica Bala 2MP AHD",   brand="Dahua",     category_id=cats["camara"].id,
                       unit="pieza", price=580.00,  cost=420.00,  labor_cost=280.00,
                       standard="universal"),

        # RACKS — universal
        models.Product(name="Rack de Piso 19\" 12U Open",      brand="Linkedpro", category_id=cats["rack"].id,
                       unit="pieza", price=2400.00, cost=1800.00, labor_cost=500.00,
                       standard="universal"),
        models.Product(name="Rack de Pared 19\" 9U",           brand="Linkedpro", category_id=cats["rack"].id,
                       unit="pieza", price=1600.00, cost=1200.00, labor_cost=350.00,
                       standard="universal"),

        # REMATES — estándar por tipo de cable
        models.Product(name="Keystone Cat6 Tool-Less",         brand="Panduit",   category_id=cats["remate"].id,
                       unit="pieza", price=55.00, cost=38.00, labor_cost=20.00, standard="Cat6"),
        models.Product(name="Keystone Cat6 Tool-Less",         brand="Linkedpro", category_id=cats["remate"].id,
                       unit="pieza", price=35.00, cost=22.00, labor_cost=20.00, standard="Cat6"),
        models.Product(name="Keystone Cat6a Tool-Less",        brand="Panduit",   category_id=cats["remate"].id,
                       unit="pieza", price=80.00, cost=55.00, labor_cost=20.00, standard="Cat6a"),
        models.Product(name="Keystone Cat5e Tool-Less",        brand="Linkedpro", category_id=cats["remate"].id,
                       unit="pieza", price=28.00, cost=18.00, labor_cost=20.00, standard="Cat5e"),
        models.Product(name="Faceplate 2 Puertos",             brand="Panduit",   category_id=cats["remate"].id,
                       unit="pieza", price=45.00, cost=28.00, labor_cost=10.00, standard="universal"),
        models.Product(name="Patch Cord Cat6 1m",              brand="Linkedpro", category_id=cats["remate"].id,
                       unit="pieza", price=65.00, cost=40.00, labor_cost=0.0,   standard="Cat6"),
        models.Product(name="Patch Cord Cat6 3m",              brand="Linkedpro", category_id=cats["remate"].id,
                       unit="pieza", price=85.00, cost=55.00, labor_cost=0.0,   standard="Cat6"),
        models.Product(name="Patch Cord Cat6a 1m",             brand="Panduit",   category_id=cats["remate"].id,
                       unit="pieza", price=95.00, cost=65.00, labor_cost=0.0,   standard="Cat6a"),
        models.Product(name="Patch Cord Cat6a 3m",             brand="Panduit",   category_id=cats["remate"].id,
                       unit="pieza", price=125.00, cost=85.00, labor_cost=0.0,  standard="Cat6a"),
        models.Product(name="Patch Cord Cat5e 1m",             brand="Linkedpro", category_id=cats["remate"].id,
                       unit="pieza", price=45.00, cost=28.00, labor_cost=0.0,   standard="Cat5e"),
        models.Product(name="Patch Cord Cat5e 3m",             brand="Linkedpro", category_id=cats["remate"].id,
                       unit="pieza", price=60.00, cost=38.00, labor_cost=0.0,   standard="Cat5e"),

        # PATCH PANELS — estándar por tipo de cable
        models.Product(name="Patch Panel Cat6 24 puertos",     brand="Panduit",   category_id=cats["patch_panel"].id,
                       unit="pieza", price=1800.00, cost=1350.00, labor_cost=200.00, standard="Cat6"),
        models.Product(name="Patch Panel Cat6 48 puertos",     brand="Panduit",   category_id=cats["patch_panel"].id,
                       unit="pieza", price=3200.00, cost=2400.00, labor_cost=300.00, standard="Cat6"),
        models.Product(name="Patch Panel Cat6a 24 puertos",    brand="Panduit",   category_id=cats["patch_panel"].id,
                       unit="pieza", price=2800.00, cost=2000.00, labor_cost=200.00, standard="Cat6a"),
        models.Product(name="Patch Panel Cat5e 24 puertos",    brand="Linkedpro", category_id=cats["patch_panel"].id,
                       unit="pieza", price=1100.00, cost=800.00,  labor_cost=200.00, standard="Cat5e"),

        # EQUIPOS ACTIVOS — universal
        models.Product(name="Switch PoE 8 puertos Gigabit",    brand="TP-Link",   category_id=cats["activo"].id,
                       unit="pieza", price=1400.00, cost=950.00,  labor_cost=150.00,
                       standard="universal", notes="TL-SG1008P, 64W PoE"),
        models.Product(name="Switch PoE 16 puertos Gigabit",   brand="TP-Link",   category_id=cats["activo"].id,
                       unit="pieza", price=2800.00, cost=2000.00, labor_cost=150.00,
                       standard="universal", notes="TL-SG1016PE, 150W PoE"),
        models.Product(name="Switch PoE 24 puertos Gigabit",   brand="TP-Link",   category_id=cats["activo"].id,
                       unit="pieza", price=4200.00, cost=3100.00, labor_cost=200.00,
                       standard="universal"),
        models.Product(name="Switch PoE 48 puertos Gigabit",   brand="TP-Link",   category_id=cats["activo"].id,
                       unit="pieza", price=7800.00, cost=5800.00, labor_cost=250.00,
                       standard="universal"),
        models.Product(name="NVR 8 canales 4K",                brand="Hikvision", category_id=cats["activo"].id,
                       unit="pieza", price=3500.00, cost=2600.00, labor_cost=400.00,
                       standard="universal", notes="DS-7608NXI-I2/S, 2 HDD"),
        models.Product(name="NVR 16 canales 4K",               brand="Hikvision", category_id=cats["activo"].id,
                       unit="pieza", price=5800.00, cost=4300.00, labor_cost=400.00,
                       standard="universal"),
        models.Product(name="DVR 8 canales 1080p TVI",         brand="Hikvision", category_id=cats["activo"].id,
                       unit="pieza", price=2800.00, cost=2000.00, labor_cost=350.00,
                       standard="universal"),
    ]

    for p in products:
        db.add(p)

    # ── CONFIGURACIÓN POR DEFECTO ─────────────────────────────────────────────
    if not db.query(models.AppSettings).filter(models.AppSettings.id == 1).first():
        db.add(models.AppSettings(
            id=1,
            cable_slack_pct=0.10,
            profit_margin_pct=0.30,
            patch_panel_ports=24,
            cable_reel_meters=305.0,
        ))

    db.commit()
    print(f"OK: {len(cats)} categorias y {len(products)} productos creados correctamente.")


if __name__ == "__main__":
    seed()
    db.close()
