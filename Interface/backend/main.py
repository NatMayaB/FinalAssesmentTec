from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
import bcrypt

# Crear la app
app = FastAPI()

# Habilitar CORS (ajusta esto si vas a producción)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar a ["http://localhost:3000"] si es necesario
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a MongoDB local
client = MongoClient("mongodb://localhost:27017")
db = client["compilador"]
users = db["users"]

# Modelos para solicitudes
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str

# Endpoint de login
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

# Endpoint de registro
@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest):
    if users.find_one({"email": data.email}):
        raise HTTPException(status_code=409, detail="user_exists")

    hashed_pw = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

    new_user = {
        "email": data.email,
        "password_hash": hashed_pw,
        "role": "user",  # Default
        "created_at": datetime.utcnow(),
        "last_login": None
    }

    users.insert_one(new_user)
    return {"status": "success"}
