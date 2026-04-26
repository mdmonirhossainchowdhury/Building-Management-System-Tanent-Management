from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil, os, uuid
from database import get_db
from models import Building, Flat, Tenant, TenantDocument
from schemas import (
    BuildingCreate, BuildingOut,
    FlatCreate, FlatOut,
    TenantCreate, TenantOut,
    BookingRequest, BookingOut,
)

app = FastAPI(title="Building Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.post("/buildings", response_model=BuildingOut, tags=["Buildings"])
def create_building(data: BuildingCreate, db: Session = Depends(get_db)):
    building = Building(**data.model_dump())
    db.add(building)
    db.commit()
    db.refresh(building)
    return building

@app.get("/buildings", response_model=List[BuildingOut], tags=["Buildings"])
def list_buildings(db: Session = Depends(get_db)):
    return db.query(Building).all()

@app.post("/flats", response_model=FlatOut, tags=["Flats"])
def create_flat(data: FlatCreate, db: Session = Depends(get_db)):
    flat = Flat(**data.model_dump())
    db.add(flat)
    db.commit()
    db.refresh(flat)
    return flat

@app.get("/flats", response_model=List[FlatOut], tags=["Flats"])
def list_flats(db: Session = Depends(get_db)):
    return db.query(Flat).all()

@app.post("/book", response_model=BookingOut, tags=["Booking"])
def book_flat(data: BookingRequest, db: Session = Depends(get_db)):
    flat = db.query(Flat).filter(Flat.id == data.flat_id).first()
    tenant = db.query(Tenant).filter(Tenant.id == data.tenant_id).first()
    
    if not flat or not tenant:
        raise HTTPException(status_code=404, detail="Flat or Tenant not found")
    
    flat.status = "Booked"
    flat.tenant_id = data.tenant_id
    db.commit()
    db.refresh(flat)

    return BookingOut(
        flat_id=flat.id,
        flat_number=flat.flat_number,
        tenant_id=tenant.id,
        tenant_name=tenant.name,
        status=flat.status,
        rent_amount=flat.rent_amount
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)