import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: linear-gradient(160deg, #fbe0df 0%, #fffaea 40%, #d6ecf8 100%);
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
  }

  .app {
    min-height: 100vh;
    background: transparent;
    padding-bottom: 60px;
  }

  .hero {
    background: linear-gradient(135deg, #1a4a2e 0%, #2d6e47 60%, #4a9e68 100%);
    padding: 40px 32px 50px;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  .hero::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 40px;
    width: 140px; height: 140px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }

  .hero-emoji {
    font-size: 48px;
    margin-bottom: 8px;
    display: block;
  }

  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 900;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .hero p {
    color: rgba(255,255,255,0.65);
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .container {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .form-card {
    background: #fff;
    border-radius: 20px;
    padding: 28px;
    margin-top: -24px;
    margin-bottom: 28px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
    position: relative;
    z-index: 2;
  }

  .form-card h2 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    color: #1a4a2e;
    margin-bottom: 18px;
    font-weight: 700;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  .form-grid .full {
    grid-column: 1 / -1;
  }

  .input-wrap {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .input-wrap label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #888;
  }

  .input-wrap input {
    background: #f7f3ee;
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    color: #222;
    outline: none;
    transition: border-color 0.2s;
  }

  .input-wrap input:focus {
    border-color: #2d6e47;
  }

  .btn-primary {
    width: 100%;
    background: linear-gradient(135deg, #1a4a2e, #2d6e47);
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 15px;
    font-size: 15px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    margin-top: 6px;
    letter-spacing: 0.3px;
  }

  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:active { transform: scale(0.98); }

  .btn-primary.edit-mode {
    background: linear-gradient(135deg, #b85c00, #e07800);
  }

  .error-toast {
    background: linear-gradient(135deg, #c0392b, #e74c3c);
    color: white;
    padding: 14px 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 20px rgba(231,76,60,0.3);
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #1a4a2e;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .products-grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .product-card {
    background: #fff;
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    transition: box-shadow 0.2s, transform 0.2s;
    border: 2px solid transparent;
  }

  .product-card:hover {
    box-shadow: 0 6px 28px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }

  .product-card.expanded {
    border-color: #2d6e47;
  }

  .product-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .product-emoji {
    font-size: 32px;
    margin-right: 14px;
  }

  .product-info { flex: 1; }

  .product-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 2px;
  }

  .product-meta {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .product-price {
    font-size: 16px;
    font-weight: 600;
    color: #2d6e47;
  }

  .product-category {
    font-size: 12px;
    background: #d4ede0;
    color: #2a5c42;
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 500;
    border: 1px solid 
  }

  .product-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn-action {
    border: none;
    border-radius: 10px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .btn-action:active { transform: scale(0.96); }
  .btn-action:hover { opacity: 0.85; }

  .btn-edit { background: #fff4e6; color: #b85c00; }
  .btn-detail { background: #e8f4fd; color: #1a6fa8; }
  .btn-delete { background: #fdecea; color: #c0392b; }

  .nutrition-panel {
    margin-top: 16px;
    padding: 18px;
    background: linear-gradient(135deg, #f0f9f3, #e8f5ec);
    border-radius: 14px;
    border: 1px solid #c8e6d0;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .nutrition-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #2d6e47;
    margin-bottom: 12px;
  }

  .nutrition-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .nutrition-item {
    background: #fff;
    border-radius: 12px;
    padding: 12px 8px;
    text-align: center;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }

  .nutrition-icon { font-size: 20px; margin-bottom: 4px; }

  .nutrition-value {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1;
    margin-bottom: 2px;
  }

  .nutrition-label {
    font-size: 10px;
    color: #888;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .loading-spinner {
    text-align: center;
    padding: 16px;
    color: #2d6e47;
    font-size: 14px;
    font-weight: 500;
  }

  .note-warn {
    margin-top: 10px;
    font-size: 12px;
    color: #b85c00;
    background: #fff4e6;
    border-radius: 8px;
    padding: 8px 12px;
    font-weight: 500;
  }

  .filter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;

    
  }

  .filter-select {
    background: #fff;
    border: 2px solid #c8e6d0;
    border-radius: 12px;
    padding: 10px 36px 10px 16px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    color: #1a4a2e;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232d6e47' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    background-color: #fff;
  }

  .filter-select:focus { border-color: #2d6e47; }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #aaa;
  }

  .empty-state .empty-emoji { font-size: 56px; margin-bottom: 12px; display: block; }
  .empty-state p { font-size: 15px; }
`;

const categoryEmoji = (cat) => {
  const map = {
    meyve: "🍎", sebze: "🥦", et: "🥩", süt: "🥛",
    ekmek: "🍞", içecek: "🧃", atıştırmalık: "🍪",
    çikolata: "🍫", dondurma: "🍦", makarna: "🍝",
    tahıl: "🌾", bakliyat: "🫘", yağ: "🫙",çorba: "🍲",döner:"🌯",yumurta: "🥚",
    peynir: "🧀",zeytin: "🫒",bal: "🍯",reçel: "🍓",muz: "🍌"
    ,portakal: "🍊",domates: "🍅",patates: "🥔",havuç: "🥕",kahve: "☕",çay: "🍵",gazlı_içecek: "🥤",su: "💧",pizza: "🍕",hamburger: "🍔",patates_kızartması: "🍟",sandviç: "🥪"
    ,kek: "🧁",pasta: "🍰",şekerleme: "🍬",cips: "🍿"

  };
  if (!cat) return "🛒";
  const lower = cat.toLowerCase();
  for (const key in map) {
    if (lower.includes(key)) return map[key];
  }
  return "🛒";
};

function ProductList() {
  const [products, setProducts] = useState([]); //ürün listesi
  const [editId, setEditId] = useState(null); // ürün id si
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [nutritionMap, setNutritionMap] = useState({});// beslenme verisi
  const [loadingId, setLoadingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü"); //filtreleme

  // ürünleri backendden çekme
  const fetchProducts = () => {
    fetch("http://localhost:8000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => { fetchProducts(); }, []);

  const saveProduct = () => {
    const url = editId
      ? `http://localhost:8000/products/${editId}`
      : "http://localhost:8000/products";
    const method = editId ? "PUT" : "POST"; // varsa güncelle yoksa yeni ürün ekle

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), category })
    })
      .then(async (res) => {
        if (!res.ok) {
          setError("⚠️ Bu ürün zaten listelenmiş!");
          setTimeout(() => setError(""), 3000);
          return;
        }
        return res.json();
      })
      .then((data) => {
  if (!data) return;
  const currentEditId = editId;
  fetchProducts(); // listeyi güncelle
  setName(""); setPrice(""); setCategory(""); setEditId(null); // formu temizle
  
  if (currentEditId) {
    setNutritionMap(prev => {
      const updated = { ...prev };
      delete updated[currentEditId];
      return updated;
    });
    setExpandedId(null);
  }
});
  };
  // veri silme
  const deleteProduct = (id) => {
    fetch(`http://localhost:8000/products/${id}`, { method: "DELETE" })
      .then(() => {
        fetchProducts();
        if (expandedId === id) setExpandedId(null); // silinen ürünün kartını kapatır
      });
  };

  const getNutrition = (id) => {
  if (nutritionMap[id] && expandedId === id) { //besin penceresi açıksa kapatır
    setExpandedId(null);
    return;
  }
  if (nutritionMap[id]) {
    setExpandedId(id); //cachede var ama kapalıysa açar
    return;
  }
  setLoadingId(id);
  setExpandedId(id);
  fetch(`http://localhost:8000/products/${id}/nutrition`)//cache de yoksa api çağrısı yapar
    .then(res => res.json())
    .then(data => {
      // besin değerlerini farklı isimlendirmeyi engeller
      const clean = 
        data.nutrition?.besin_degerleri ||
        data.besin_degerleri ||
        data.besin_degeri ||        
        data.nutrition?.besin_degeri ||  
        data.nutrition ||
        (typeof data === "string" ? JSON.parse(data) : data);
      setNutritionMap(prev => ({ ...prev, [id]: clean }));
    })
    .finally(() => setLoadingId(null));
};

  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Tümü", ...new Set(products.map(p => p.category?.toLowerCase().trim()).filter(Boolean))];
  const filteredProducts = products
    .filter(p => selectedCategory === "Tümü" || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));


  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="hero">
          <span className="hero-emoji">🌿</span>
          <h1>Akıllı Market</h1>
          <p>Besin değerleri ile akıllı alışveriş</p>
        </div>

        <div className="container">
          <div className="form-card">
            <h2>{editId ? "✏️ Ürünü Düzenle" : "➕ Yeni Ürün Ekle"}</h2>

            {error && <div className="error-toast">❌ {error}</div>}

            <div className="form-grid">
              <div className="input-wrap full">
                <label>Ürün Adı</label>
                <input
                  placeholder="Örn: Elma, Süt, Ekmek..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="input-wrap">
                <label>Fiyat (TL)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
              <div className="input-wrap">
                <label>Kategori</label>
                <input
                  placeholder="Meyve, Sebze..."
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                />
              </div>
            </div>

            <button
              className={`btn-primary ${editId ? "edit-mode" : ""}`}
              onClick={saveProduct}
            >
              {editId ? "💾 Güncelle" : "✅ Ürün Ekle"}
            </button>
          </div>
          <div className="input-wrap" style={{marginBottom: "12px"}}>
  <input
    placeholder="🔍 Ürün ara..."
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
    style={{background: "#fff"}}
  />
</div>

<div className="filter-row"></div>

          <div className="filter-row">
  <p className="section-title" style={{marginBottom: 0}}>🛒 Ürün Listesi ({filteredProducts.length})</p>
  <select
    className="filter-select"
    value={selectedCategory}
    onChange={e => setSelectedCategory(e.target.value)}
  > 
    {categories.map(cat => (
      <option key={cat} value={cat}>{categoryEmoji(cat === "Tümü" ? null : cat)} {cat}</option>
    ))}
  </select>
  <div style={{
    background: "#fff",
    border: "2px solid #c8e6d0",
    borderRadius: "12px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a4a2e",
    whiteSpace: "nowrap"
  }}>
    💰 {filteredProducts.reduce((acc, p) => acc + p.price, 0)} ₺
  </div>
</div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-emoji">🧺</span>
              <p>Henüz ürün eklenmedi.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  className={`product-card ${expandedId === p.id ? "expanded" : ""}`}
                >
                  <div className="product-header">
                    <span className="product-emoji">{categoryEmoji(p.category)}</span>
                    <div className="product-info">
                      <div className="product-name">{p.name}</div>
                      <div className="product-meta">
                        <span className="product-price">{p.price} ₺</span>
                        {p.category && <span className="product-category">{p.category}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => {
                      if (editId === p.id) {
                      setEditId(null);
                      setName(""); setPrice(""); setCategory("");
                    } else {
                      setEditId(p.id);
                      setName(p.name);
                      setPrice(p.price);
                      setCategory(p.category);
                      window.scrollTo({ top: 0, behavior: "smooth" });
  }
}}
                    >
                      ✏️ Düzelt
                    </button>
                    <button
                      className="btn-action btn-detail"
                      onClick={() => getNutrition(p.id)}
                    >
                      {loadingId === p.id ? "⏳" : "🔬"} Besin Değerleri
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => deleteProduct(p.id)}
                    >
                      🗑️ Sil
                    </button>
                  </div>

                  {expandedId === p.id && (
                    loadingId === p.id ? (
                      <div className="loading-spinner">⏳ Besin değerleri yükleniyor...</div>
                    ) : nutritionMap[p.id] ? (
                      <div className="nutrition-panel">
                        <div className="nutrition-title">📊 100g için besin değerleri</div>
                        <div className="nutrition-grid">
                          <div className="nutrition-item">
                            <div className="nutrition-icon">🔥</div>
                            <div className="nutrition-value">{nutritionMap[p.id].kalori}</div>
                            <div className="nutrition-label">Kalori</div>
                          </div>
                          <div className="nutrition-item">
                            <div className="nutrition-icon">💪</div>
                            <div className="nutrition-value">{nutritionMap[p.id].protein}g</div>
                            <div className="nutrition-label">Protein</div>
                          </div>
                          <div className="nutrition-item">
                            <div className="nutrition-icon">🫒</div>
                            <div className="nutrition-value">{nutritionMap[p.id].yag}g</div>
                            <div className="nutrition-label">Yağ</div>
                          </div>
                          <div className="nutrition-item">
                            <div className="nutrition-icon">🌾</div>
                            <div className="nutrition-value">{nutritionMap[p.id].karbonhidrat}g</div>
                            <div className="nutrition-label">Karb.</div>
                          </div>
                        </div>
                        {nutritionMap[p.id].error && (
                        <div className="note-warn">⚠️ {nutritionMap[p.id].error}</div>
                          )}
                        {nutritionMap[p.id].not && (
                         <div className="note-warn">⚠️ {nutritionMap[p.id].not}</div>
)}
                      </div>
                    ) : null
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductList;
