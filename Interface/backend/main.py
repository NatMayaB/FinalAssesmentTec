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
def save_session(data: SessionData, request: Request):
    session = {
        "email": data.email,
        "start_time": datetime.utcnow(),
        "input_code": data.input_code,
        "output_asm": data.output_asm,
        "success": data.success,
        "error_message": data.error_message,
        "compiled_at": data.compiled_at or datetime.utcnow().isoformat()
    }
    db.sessions.insert_one(session)
    return {
        "status": "success",
        "message": "Sesión guardada correctamente"
    }

@app.post("/compile")
async def compile_code(data: CompileRequest, user=Depends(get_current_user)):
    try:
        # Limpiar el código: quitar espacios al inicio/fin y poner todo en una sola línea
        clean_code = data.code.strip().replace('\n', ' ').replace('\r', ' ')
        print(f"Intentando compilar código: {clean_code[:100]}...")  # Solo mostramos los primeros 100 caracteres
        async with httpx.AsyncClient(verify=False) as client:
            try:
                response = await client.post(
                    "http://localhost:3003/compile",
                    json={"code": clean_code},
                    timeout=30.0
                )
                print(f"Respuesta de la API externa - Status: {response.status_code}")
                print(f"Respuesta de la API externa - Contenido: {response.text[:200]}...")
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"Error en la API externa: {response.text}"
                    )
                return response.json()
            except httpx.RequestError as e:
                print(f"Error en la petición HTTP: {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Error al conectar con la API externa: {str(e)}"
                )
            except httpx.TimeoutException as e:
                print(f"Timeout en la petición: {str(e)}")
                raise HTTPException(
                    status_code=504,
                    detail="La API externa tardó demasiado en responder"
                )
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
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