from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./market.db" #SQLite veritabanı 

engine = create_engine( #veritabanı bağlantı motoru
    DATABASE_URL,
    connect_args={"check_same_thread": False} #SQLite'ın aynı anda birden fazla bağlantıya izin vermemesini engeller
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False) #veritabanı oturumları oluşturmak için kullanılan bir sınıf

Base = declarative_base()