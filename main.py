import os
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, storage
from dotenv import load_dotenv
import fitz  # PyMuPDF

load_dotenv()

app = FastAPI()

# Permetem que la teva web es connecti sense bloquejos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. CONFIGURACIÓ FIREBASE (CORREGIDA)
if not firebase_admin._apps:
    try:
        # Intentem carregar la clau; si no existeix, Firebase farà servir les de l'entorn de Render
        if os.path.exists("serviceAccountKey.json"):
            cred = credentials.Certificate("serviceAccountKey.json")
            firebase_admin.initialize_app(cred, {
                'storageBucket': 'x-policial.firebasestorage.app'
            })
        else:
            # Això és per quan està a Render
            firebase_admin.initialize_app(options={
                'storageBucket': 'x-policial.firebasestorage.app'
            })
    except Exception as e:
        print(f"Error Firebase: {e}")

# 2. CONFIGURACIÓ GEMINI
api_key = os.getenv("GEMINI_KEY_1")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')

def extract_text_from_pdf(blob):
    try:
        temp_pdf = "temp.pdf"
        blob.download_to_filename(temp_pdf)
        doc = fitz.open(temp_pdf)
        text = "".join([page.get_text() for page in doc])
        doc.close()
        os.remove(temp_pdf)
        return text
    except:
        return ""

# --- RUTES ---

@app.get("/")
def health():
    return {"status": "ACTIU", "bucket": "x-policial.firebasestorage.app"}

@app.get("/folders")
async def get_folders():
    try:
        bucket = storage.bucket()
        blobs = bucket.list_blobs(delimiter='/')
        next(blobs, None) 
        folder_names = [prefix.strip('/') for prefix in blobs.prefixes]
        
        if not folder_names:
            return [{"id": "general", "name": "GENERAL"}]
            
        return [{"id": f, "name": f.upper()} for f in folder_names]
    except Exception as e:
        return [{"id": "error", "name": str(e)}]

@app.post("/ask")
async def ask_gemini(data: dict = Body(...)):
    prompt = data.get("prompt")
    folder_id = data.get("folder_id", "")
    
    try:
        bucket = storage.bucket()
        prefix = f"{folder_id}/" if folder_id else ""
        blobs = bucket.list_blobs(prefix=prefix)
        
        context_text = ""
        for blob in blobs:
            if blob.name.lower().endswith(".pdf"):
                context_text += f"\n--- DOC: {blob.name} ---\n"
                context_text += extract_text_from_pdf(blob)

        instruccions = f"Ets l'IA de X-POLICIAL. Respon en català usant aquest context:\n{context_text}"
        response = model.generate_content(f"{instruccions}\n\nPregunta: {prompt}")
        return {"answer": response.text}
    except Exception as e:
        return {"answer": f"Error: {str(e)}"}
