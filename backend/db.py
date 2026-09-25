from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./market.db" 

engine = create_engine( #veritabanı bağlantı motoru
    DATABASE_URL,
    connect_args={"check_same_thread": False} 
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False) 

Base = declarative_base()
