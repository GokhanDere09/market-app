from urllib import response

import requests
import json
import re

# Senin API Anahtarın
GEMINI_API_KEY = "AIzaSyAsq7410QuaYeOWE3kNojLTo3mzoZwcF0I"

def get_nutrition(product_name: str):
    try:
        # 2026'nın en yüksek kotalı ve ücretsiz (billing gerektirmeyen) modeli
        model_name = "gemini-3.1-flash-lite-preview"

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model_name}:generateContent?key={GEMINI_API_KEY}"
        )

        prompt = f"100g '{product_name}' besin değerlerini (calories, protein, fat, carbs) SADECE JSON olarak ver. Açıklama yapma."

        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        # DİKKAT: Timeout süresini 10'dan 60 saniyeye çıkardık.
        # Bu modelin 'düşünmesi' için bu süre şart.
        response = requests.post(url, json=payload, timeout=60)
        print("STATUS:", response.status_code)
        print("RESPONSE:", response.text[:300])
        
        if response.status_code != 200:
            return {"error": f"Google Hatası ({response.status_code}): {response.text[:100]}"}

        data = response.json()
        res_text = data['candidates'][0]['content']['parts'][0]['text'].strip()
        
        # Markdown temizleme
        clean_json = re.sub(r"```json|```", "", res_text).strip()
        
        return json.loads(clean_json)

    except requests.exceptions.Timeout:
        return {"error": "Google çok uzun süre düşündü, lütfen tekrar dene."}
    except Exception as e:
        return {"error": f"Sistem hatası: {str(e)}"}