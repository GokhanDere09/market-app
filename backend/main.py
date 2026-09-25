import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from db import SessionLocal, engine, Base
from models import Product
from schemas import ProductCreate
from ai_service import get_nutrition

Base.metadata.create_all(bind=engine) #veritabanında classları oluşturur

app = FastAPI() #fastapi uygulaması oluşturuyoruz
app.add_middleware(
    CORSMiddleware, # frontendin backende erişmesini sağlar
    allow_origins=["*"], 
    allow_credentials=True,# tüm kaynaklara izin verir
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB session
def get_db():
    db = SessionLocal() #db oturumu oluşturur
    try:
        yield db #db kullanılabilir hale gelir
    finally:
        db.close()


# CREATE 
@app.post("/products") #post isteği geldiğinde bu fonksiyon çalışır
def create_product(product: ProductCreate, db: Session = Depends(get_db)): #frontend verisini alır db ye ver 
    # Aynı isimde ve silinmemiş ürün var mı kontrolü
    existing = db.query(Product).filter(
        Product.name == product.name
    ).first()

    if existing:#eğer db de aynı isimde bir ürün varsa
        if existing.is_deleted:#(soft delete)
            existing.is_deleted = False #eğer ürün şartlı silme yapmışsa false true olur ve ürün geri gelir 
            existing.price = product.price
            existing.category = product.category
            db.commit() #değişiklikleri kaydeder
            db.refresh(existing)#db deki mevcut ürünü günceller
            return existing # güncellenmiş ürünü döndürür
        else:
            raise HTTPException(status_code=400, detail="Bu ürün zaten eklenmiş")

    new_product = Product(**product.dict()) #db de yoksa yeni ürün oluşturur
    db.add(new_product)# yeni ürünü db ye ekler
    db.commit()# db ye kalıcı olarak kaydeder
    db.refresh(new_product)
    return new_product
        

# READ ALL
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_deleted == False).all()


# READ ONE
@app.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product: 
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    return product


# UPDATE
@app.put("/products/{product_id}")
def update_product(product_id: int, updated: ProductCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()# güncellenecek ürünü bulur
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı") #yokda hata verir

    product.name = updated.name
    product.price = updated.price
    product.category = updated.category

    nutrition = get_nutrition(updated.name)# güncellenen ürünün besin değerlerini alır

    if isinstance(nutrition, str): # aı dan gelen veri string ise 
        nutrition = json.loads(nutrition.replace("'", '"')) # tek tırnakları çift tırnağa çevirip json a çevirir
    
    product.nutrition = None  # cache temizle
    # format farklılıkları için kontrol
    if "besin_degeri" in nutrition:
        nutrition = nutrition["besin_degeri"]
    elif "besin_degerleri" in nutrition:
        nutrition = nutrition["besin_degerleri"]

    # 6. Sadece başarılı veriyi DB'ye yaz
    product.nutrition = nutrition

    db.commit()# db ye kaydeder
    db.refresh(product) #güncellenmiş ürünü db den alır
    return product #güncellenmiş ürünü döndürür


# DELETE
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

     # silme yok
    product.is_deleted = True

    db.commit()
    return {"message": "Ürün silindi (soft delete)"}


# AI NUTRITION (CACHE VAR)
@app.get("/products/{product_id}/nutrition")
def product_nutrition(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Ürün yok")

    #  Cache varsa direkt DB'den döndür
    if product.nutrition and "error" not in product.nutrition:
        return product.nutrition

    #  Yoksa AI'a sor
    nutrition = get_nutrition(product.name)
    #  Hata kontrolü db ye yazmaz
    if isinstance(nutrition, dict) and "error" in nutrition:
        error_msg = nutrition["error"]
        if "503" in error_msg:
            return {
                "kalori": 0, "protein": 0, "yag": 0, "karbonhidrat": 0,
                "error": "Sunucu dolu, lütfen bekleyin 🙏"
            }
        if "Timeout" in error_msg or "uzun süre" in error_msg:
            return {
                "kalori": 0, "protein": 0, "yag": 0, "karbonhidrat": 0,
                "error": "Bağlantı zaman aşımına uğradı, tekrar dene ⏱️"
            }
        return {
            "kalori": 0, "protein": 0, "yag": 0, "karbonhidrat": 0,
            "error": f"AI hatası: {error_msg[:50]}"
        }

    #  JSON string temizleme
    if isinstance(nutrition, str):
        nutrition = json.loads(nutrition.replace("'", '"'))

    #  Sadece başarılı veriyi DB'ye yaz
    product.nutrition = nutrition
    db.commit()
    db.refresh(product)
    return nutrition