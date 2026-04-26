from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal

class BuildingBase(BaseModel):
    name: str
    total_apartments: int = 0
    address: Optional[str] = None
    security_service: bool = False
    waste_management: bool = False
    elevator: bool = False
    generator: bool = False
    contact: Optional[str] = None

class BuildingCreate(BuildingBase):
    pass

class BuildingOut(BuildingBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class FlatCreate(BaseModel):
    building_id: int
    flat_number: str
    floor: int = 1
    room_type: str
    rent_amount: Decimal
    status: str = "Available"

class FlatOut(FlatCreate):
    id: int
    tenant_id: Optional[int] = None
    created_at: datetime
    class Config:
        from_attributes = True

class TenantCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None

class TenantOut(TenantCreate):
    id: int
    join_date: date
    created_at: datetime
    class Config:
        from_attributes = True

class BookingRequest(BaseModel):
    flat_id: int
    tenant_id: int

class BookingOut(BaseModel):
    flat_id: int
    flat_number: str
    tenant_id: int
    tenant_name: str
    status: str
    rent_amount: Decimal