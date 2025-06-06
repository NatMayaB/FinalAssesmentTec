# FinalAssesmentTec

Este proyecto incluye una interfaz en React, una API backend en FastAPI
y un compilador escrito en Python. Para ejecutarlo de forma local necesitas
Node.js, Python 3 y una instancia de MongoDB escuchando en
`mongodb://localhost:27017`.

## Pasos rápidos

1. **Compilador**
   ```bash
   cd Semantico_Colomo
   pip install -r ../Interface/backend/requirements.txt  # dependencias básicas
   uvicorn api:app --reload --port 3003
   ```

2. **Backend**
   ```bash
   cd Interface/backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

3. **Frontend**
   ```bash
   cd Interface
   npm install
   npm start
   ```

El frontend estará disponible en `http://localhost:3000` y se conectará a la
API de FastAPI en `http://localhost:8000`. El backend, a su vez, utiliza el
compilador en `http://localhost:3003` y guarda las sesiones en MongoDB.
