from pydantic import BaseModel
# ürün oluşturmak için kullanılacak şema
class ProductCreate(BaseModel):
    name: str
    price: float
    category: str