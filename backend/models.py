from sqlalchemy import Column, Integer, String, Float, Boolean, JSON
from db import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Float)
    category = Column(String)

    nutrition = Column(JSON, nullable=True)

    
    is_deleted = Column(Boolean, default=False)