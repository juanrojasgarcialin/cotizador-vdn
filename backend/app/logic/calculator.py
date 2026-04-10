"""
Motor de cálculo de cotizaciones de cableado estructurado y CCTV.

Reglas de negocio implementadas:
  1. Cable total = (nodos + cámaras_IP) × distancia_prom × (1 + holgura%)
  2. Bobinas necesarias = ceil(metros_totales / metros_por_bobina)
  3. Remates por nodo: 1 Keystone + 1 Faceplate + 1 Patch Cord 1m + 1 Patch Cord 3m
  4. Patch Panels = ceil(nodos_totales / puertos_por_panel)
  5. Switch sugerido: 8/16/24/48 puertos según total de puntos con PoE
"""
import math
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from ..models import Product, AppSettings, Quote, QuoteItem
from ..schemas import QuoteRequest


def _get_settings(db: Session) -> AppSettings:
    settings = db.query(AppSettings).filter(AppSettings.id == 1).first()
    if not settings:
        # Si no existe, crear con valores por defecto
        settings = AppSettings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def _get_product(db: Session, product_id: Optional[int]) -> Optional[Product]:
    if product_id is None:
        return None
    return db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()


def _suggest_switch_ports(total_poe_points: int) -> int:
    """Devuelve el tamaño mínimo de switch que cubre todos los puntos PoE."""
    for size in [8, 16, 24, 48]:
        if total_poe_points <= size:
            return size
    # Si supera 48, usar múltiplos de 48
    return math.ceil(total_poe_points / 48) * 48


def build_quote(db: Session, req: QuoteRequest) -> Quote:
    """
    Construye y persiste una cotización completa a partir de los parámetros
    enviados por el cliente.

    Retorna el objeto Quote ya guardado en BD con todos sus QuoteItems.
    """
    settings = _get_settings(db)
    items: List[Dict[str, Any]] = []

    total_materials = 0.0
    total_labor = 0.0

    # ── 1. CABLE ──────────────────────────────────────────────────────────────
    cable_product = _get_product(db, req.cable_product_id)
    total_points = req.num_nodes + req.num_cameras  # cámaras IP también usan cable UTP
    cable_meters_needed = total_points * req.avg_distance_m * (1 + settings.cable_slack_pct)

    if cable_product:
        meters_per_unit = cable_product.meters_per_unit or settings.cable_reel_meters
        units_needed = math.ceil(cable_meters_needed / meters_per_unit)
        subtotal_mat = units_needed * cable_product.price
        subtotal_lab = units_needed * cable_product.labor_cost
        items.append({
            "product_id": cable_product.id,
            "description": f"Cable {cable_product.name} ({cable_product.brand or ''})",
            "quantity": units_needed,
            "unit": cable_product.unit,
            "unit_price": cable_product.price,
            "unit_labor": cable_product.labor_cost,
            "subtotal_materials": subtotal_mat,
            "subtotal_labor": subtotal_lab,
        })
        total_materials += subtotal_mat
        total_labor += subtotal_lab
    else:
        # Ítem informativo sin precio cuando no se seleccionó producto
        items.append({
            "product_id": None,
            "description": f"Cable {req.cable_type} — {cable_meters_needed:.1f} m requeridos "
                           f"(holgura {settings.cable_slack_pct*100:.0f}% incluida)",
            "quantity": cable_meters_needed,
            "unit": "metro",
            "unit_price": 0.0,
            "unit_labor": 0.0,
            "subtotal_materials": 0.0,
            "subtotal_labor": 0.0,
        })

    # ── 2. TUBERÍA / CANALIZACIÓN ─────────────────────────────────────────────
    conduit_product = _get_product(db, req.conduit_product_id)
    if conduit_product:
        # Se asume 1 unidad de tubería por cada tramo (misma cantidad de cable)
        meters_per_unit = conduit_product.meters_per_unit or 1.0
        units_needed = math.ceil(cable_meters_needed / meters_per_unit)
        subtotal_mat = units_needed * conduit_product.price
        subtotal_lab = units_needed * conduit_product.labor_cost
        items.append({
            "product_id": conduit_product.id,
            "description": f"Tubería {conduit_product.name} ({conduit_product.brand or ''})",
            "quantity": units_needed,
            "unit": conduit_product.unit,
            "unit_price": conduit_product.price,
            "unit_labor": conduit_product.labor_cost,
            "subtotal_materials": subtotal_mat,
            "subtotal_labor": subtotal_lab,
        })
        total_materials += subtotal_mat
        total_labor += subtotal_lab

    # ── 3. REMATES (Keystones, Faceplates, Patch Cords) ───────────────────────
    # Un set de remates por cada NODO de red (las cámaras no llevan faceplate)
    remate_products = [
        (req.keystone_product_id,    req.num_nodes, "Keystone"),
        (req.faceplate_product_id,   req.num_nodes, "Faceplate"),
        (req.patch_cord_1m_product_id, req.num_nodes, "Patch Cord 1m (rack)"),
        (req.patch_cord_3m_product_id, req.num_nodes, "Patch Cord 3m (área trabajo)"),
    ]
    for pid, qty, label in remate_products:
        prod = _get_product(db, pid)
        if prod:
            subtotal_mat = qty * prod.price
            subtotal_lab = qty * prod.labor_cost
            items.append({
                "product_id": prod.id,
                "description": f"{label} — {prod.name} ({prod.brand or ''})",
                "quantity": qty,
                "unit": prod.unit,
                "unit_price": prod.price,
                "unit_labor": prod.labor_cost,
                "subtotal_materials": subtotal_mat,
                "subtotal_labor": subtotal_lab,
            })
            total_materials += subtotal_mat
            total_labor += subtotal_lab

    # ── 4. PATCH PANELS ───────────────────────────────────────────────────────
    patch_panel_product = _get_product(db, req.patch_panel_product_id)
    if patch_panel_product:
        # Puertos disponibles por panel (24 o 48 según producto)
        panel_ports = settings.patch_panel_ports
        panels_needed = math.ceil(req.num_nodes / panel_ports)
        subtotal_mat = panels_needed * patch_panel_product.price
        subtotal_lab = panels_needed * patch_panel_product.labor_cost
        items.append({
            "product_id": patch_panel_product.id,
            "description": f"Patch Panel {panel_ports}p — {patch_panel_product.name}",
            "quantity": panels_needed,
            "unit": "pieza",
            "unit_price": patch_panel_product.price,
            "unit_labor": patch_panel_product.labor_cost,
            "subtotal_materials": subtotal_mat,
            "subtotal_labor": subtotal_lab,
        })
        total_materials += subtotal_mat
        total_labor += subtotal_lab
    else:
        # Sugerencia sin precio
        panel_ports = settings.patch_panel_ports
        panels_needed = math.ceil(req.num_nodes / panel_ports)
        items.append({
            "product_id": None,
            "description": f"Patch Panel {panel_ports} puertos — {panels_needed} pza(s) sugeridas",
            "quantity": panels_needed,
            "unit": "pieza",
            "unit_price": 0.0,
            "unit_labor": 0.0,
            "subtotal_materials": 0.0,
            "subtotal_labor": 0.0,
        })

    # ── 5. SWITCH PoE ─────────────────────────────────────────────────────────
    switch_product = _get_product(db, req.switch_product_id)
    suggested_ports = _suggest_switch_ports(total_points)

    if switch_product:
        subtotal_mat = switch_product.price
        subtotal_lab = switch_product.labor_cost
        items.append({
            "product_id": switch_product.id,
            "description": f"Switch PoE {switch_product.name} (sugerido: {suggested_ports}p)",
            "quantity": 1,
            "unit": "pieza",
            "unit_price": switch_product.price,
            "unit_labor": switch_product.labor_cost,
            "subtotal_materials": subtotal_mat,
            "subtotal_labor": subtotal_lab,
        })
        total_materials += subtotal_mat
        total_labor += subtotal_lab
    else:
        items.append({
            "product_id": None,
            "description": f"Switch PoE sugerido: {suggested_ports} puertos "
                           f"({req.num_nodes} nodos + {req.num_cameras} cámaras)",
            "quantity": 1,
            "unit": "pieza",
            "unit_price": 0.0,
            "unit_labor": 0.0,
            "subtotal_materials": 0.0,
            "subtotal_labor": 0.0,
        })

    # ── 6. CÁMARAS ────────────────────────────────────────────────────────────
    for cam_item in req.camera_items:
        cam_product = _get_product(db, cam_item.get("product_id"))
        qty = int(cam_item.get("quantity", 1))
        if cam_product and qty > 0:
            subtotal_mat = qty * cam_product.price
            subtotal_lab = qty * cam_product.labor_cost
            items.append({
                "product_id": cam_product.id,
                "description": f"Cámara {cam_product.name} ({cam_product.brand or ''})",
                "quantity": qty,
                "unit": cam_product.unit,
                "unit_price": cam_product.price,
                "unit_labor": cam_product.labor_cost,
                "subtotal_materials": subtotal_mat,
                "subtotal_labor": subtotal_lab,
            })
            total_materials += subtotal_mat
            total_labor += subtotal_lab

    # ── 7. PERSISTIR COTIZACIÓN ───────────────────────────────────────────────
    quote = Quote(
        client_name=req.client_name,
        client_email=req.client_email,
        project_name=req.project_name,
        num_nodes=req.num_nodes,
        num_cameras=req.num_cameras,
        avg_distance_m=req.avg_distance_m,
        cable_type=req.cable_type,
        total_materials=round(total_materials, 2),
        total_labor=round(total_labor, 2),
        total_price=round(total_materials + total_labor, 2),
        notes=req.notes,
    )
    db.add(quote)
    db.flush()  # Obtener el ID sin hacer commit aún

    for item_data in items:
        db.add(QuoteItem(
            quote_id=quote.id,
            **item_data,
        ))

    db.commit()
    db.refresh(quote)
    return quote
