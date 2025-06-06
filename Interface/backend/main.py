from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
import bcrypt
from fastapi import Request
import httpx
from typing import Optional
from typing import List
from fastapi import Body
from jose import JWTError, jwt
from fastapi import Depends, Header

# Importar módulos de Semántico Colomo
from Semantico_Colomo.globalTypes import *
from Semantico_Colomo.parser import *
from Semantico_Colomo.semanticaGen import *
from Semantico_Colomo.codeGen import *

# Crear la app
app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin (React default port)
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
    compiled_at: Optional[str] = None

# Modelo para la compilación
class CompileRequest(BaseModel):
    code: str

SECRET_KEY = "k8n2Jw7lQw6v1k9n2Jw7lQw6v1k9n2Jw7lQw6v1k9n2Jw7lQw6v1k9n2Jw7lQw6v1k9"  # Change this to a secure random value!
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta=None):
    from datetime import timedelta
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=8)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no proporcionado")
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    return payload

def compile_code(source_code: str) -> str:
    try:
        progLong = len(source_code)
        source_code += '$'
        posicion = 0

        # Initialize global variables
        globales(source_code, posicion, progLong)

        # Run parser
        AST = parser(True)

        # Run semantic analysis
        semantica(AST, True)

        # Run code generation
        output_code = codeGen(AST)

        return output_code
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint de login
@app.post("/login")
def login(data: LoginRequest):
    user = users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    if not bcrypt.checkpw(data.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    # Crear token JWT
    token = create_access_token({"email": user["email"], "role": user.get("role", "user")})

    return {
        "message": "Login exitoso",
        "email": user["email"],
        "role": user.get("role", "user"),
        "token": token
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
async def save_session(data: SessionData, user=Depends(get_current_user)):
    try:
        # Compilar el código usando Semántico Colomo
        output_asm = compile_code(data.input_code)
        
        session = {
            "email": data.email,
            "start_time": datetime.utcnow(),
            "input_code": data.input_code,
            "output_asm": output_asm,
            "success": True,
            "error_message": "",
            "compiled_at": data.compiled_at or datetime.utcnow().isoformat()
        }
        db.sessions.insert_one(session)
        return {
            "status": "success",
            "message": "Sesión guardada correctamente",
            "output_asm": output_asm
        }
    except Exception as e:
        # Si hay un error en la compilación, guardar la sesión con el error
        session = {
            "email": data.email,
            "start_time": datetime.utcnow(),
            "input_code": data.input_code,
            "output_asm": str(e),
            "success": False,
            "error_message": str(e),
            "compiled_at": data.compiled_at or datetime.utcnow().isoformat()
        }
        db.sessions.insert_one(session)
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@app.post("/compile")
async def compile_code_endpoint(data: CompileRequest, user=Depends(get_current_user)):
    try:
        output = compile_code(data.code)
        return {
            "compiled_code": output,
            "success": True
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

# Endpoint para obtener los detalles de las sesiones de los usuarios
@app.get("/admin/sessions")
def get_all_sessions(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    # Trae todas las sesiones de la colección
    sessions = list(db.sessions.find({}, {"_id": 0}))  # Excluye el campo _id para facilidad
    return {"sessions": sessions}

@app.delete("/admin/users/{email}")
def delete_user(email: str, user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    result = users.delete_one({"email": email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"status": "success", "message": f"Usuario {email} eliminado correctamente"}

@app.get("/admin/users")
def get_all_users(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    users_list = list(users.find({}, {"_id": 0, "email": 1}))
    return {"users": [u["email"] for u in users_list]}