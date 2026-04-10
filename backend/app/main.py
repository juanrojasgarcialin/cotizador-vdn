"""
Punto de entrada de la API — FastAPI.

Ejecutar en desarrollo:
    cd backend
    uvicorn app.main:app --reload --port 8000

Docs interactivas:
    http://localhost:8000/docs   (Swagger UI)
    http://localhost:8000/redoc  (ReDoc)
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import categories, products, settings, quotes

STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static")

# Crea todas las tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cotizador — Cableado Estructurado & CCTV",
    description="API para cotizar proyectos de redes y videovigilancia.",
    version="1.0.0",
)

# CORS: orígenes locales + producción via env var ALLOWED_ORIGINS
_default_origins = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
_origins_raw = os.environ.get("ALLOWED_ORIGINS", _default_origins)
ALLOWED_ORIGINS = [o.strip() for o in _origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(settings.router)
app.include_router(quotes.router)

os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Cotizador API corriendo"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
