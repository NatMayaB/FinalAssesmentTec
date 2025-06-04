from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
import bcrypt
from fastapi import Request

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

# Modelo para sesión de compilación
class SessionData(BaseModel):
    email: str
    input_code: str
    output_asm: str
    success: bool = True
    error_message: str = ""

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

@app.post("/save_session")
def save_session(data: SessionData, request: Request):
    # Output estático para pruebas
    static_output = """
    ; Código ensamblador de ejemplo
    section .data
        msg db 'Hello, World!', 0xa
        len equ $ - msg

    section .text
        global _start

    _start:
        mov edx, len
        mov ecx, msg
        mov ebx, 1
        mov eax, 4
        int 0x80

        mov eax, 1
        int 0x80
    """

    session = {
        "email": data.email,
        "start_time": datetime.utcnow(),
        "input_code": data.input_code,
        "output_asm": static_output,  # Usamos el output estático
        "success": True,
        "error_message": "",
        "compiled_at": datetime.utcnow()
    }
    db.sessions.insert_one(session)
    return {
        "status": "success",
        "output": static_output,
        "message": "Sesión guardada correctamente"
    }
