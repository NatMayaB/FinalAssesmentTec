from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import bcrypt

# Crear la app
app = FastAPI()

# Habilitar CORS (puedes ajustar el dominio luego)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto a ["http://localhost:3000"] en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a MongoDB local
client = MongoClient("mongodb://localhost:27017")
db = client["compilador"]
users = db["users"]

# Modelo para el body del request
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(data: LoginRequest):
    user = users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    if not bcrypt.checkpw(data.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {
    "message": "Login exitoso",
    "email": user["email"],
    "role": user.get("role", "user") 
    }

