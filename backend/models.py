# backend/models.py
# SQLAlchemy ORM Models for MySQL Building Management System

from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Enum,
    DECIMAL, Date, DateTime, ForeignKey, func
)
from sqlalchemy.orm import relationship
from database import Base
import enum

# ─── ENUMS ────────────────────────────────────────────────────────────────────
class FlatStatus(str, enum.Enum):
    available = "Available"
    booked = "Booked"
    maintenance = "Maintenance"

class DocType(str, enum.Enum):
    nid = "NID"
    photo = "Photo"

# ─── BUILDING MODEL ───────────────────────────────────────────────────────────
class Building(Base):
    __tablename__ = "buildings"

    id                = Column(Integer, primary_key=True, autoincrement=True)
    name              = Column(String(255), nullable=False)
    total_apartments  = Column(Integer, default=0)
    address           = Column(Text)
    security_service  = Column(Boolean, default=False)
    waste_management  = Column(Boolean, default=False)
    elevator          = Column(Boolean, default=False)
    generator         = Column(Boolean, default=False)
    contact           = Column(String(20))
    created_at        = Column(DateTime, server_default=func.now())

    # One building has many flats
    flats = relationship("Flat", back_populates="building", cascade="all, delete")


# ─── FLAT MODEL ───────────────────────────────────────────────────────────────
class Flat(Base):
    __tablename__ = "flats"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    building_id  = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    flat_number  = Column(String(10), nullable=False)
    floor        = Column(Integer, default=1)
    room_type    = Column(String(50), nullable=False)  # e.g. "2-Bedroom"
    rent_amount  = Column(DECIMAL(10, 2), nullable=False)
    status       = Column(String(20), default="Available", nullable=False)
    tenant_id    = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    created_at   = Column(DateTime, server_default=func.now())

    building = relationship("Building", back_populates="flats")
    tenant   = relationship("Tenant", back_populates="flat")


# ─── TENANT MODEL ─────────────────────────────────────────────────────────────
class Tenant(Base):
    __tablename__ = "tenants"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    name             = Column(String(255), nullable=False)
    email            = Column(String(255), unique=True, nullable=False)
    phone            = Column(String(20), nullable=False)
    emergency_name   = Column(String(255))
    emergency_phone  = Column(String(20))
    join_date        = Column(Date, server_default=func.current_date())
    created_at       = Column(DateTime, server_default=func.now())

    # A tenant is linked to one flat
    flat      = relationship("Flat", back_populates="tenant", uselist=False)
    documents = relationship("TenantDocument", back_populates="tenant", cascade="all, delete")


# ─── TENANT DOCUMENT MODEL ────────────────────────────────────────────────────
class TenantDocument(Base):
    __tablename__ = "tenant_documents"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id     = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    doc_type      = Column(String(20), nullable=False) # "NID" or "Photo"
    file_path     = Column(String(500), nullable=False)
    original_name = Column(String(255))
    uploaded_at   = Column(DateTime, server_default=func.now())

    tenant = relationship("Tenant", back_populates="documents")