# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from compilerPipeline import compile_code

app = FastAPI()

class SourceCodeInput(BaseModel):
    code: str

@app.post("/compile")
async def compile_endpoint(input_data: SourceCodeInput):
    try:
        output = compile_code(input_data.code)
        return {"compiled_code": output}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
