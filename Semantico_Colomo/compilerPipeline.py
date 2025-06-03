# compiler_pipeline.py
from globalTypes import *
from parser import *
from semanticaGen import *
from codeGen import *

def compile_code(source_code: str) -> str:
    progLong = len(source_code)
    source_code += '$'
    posicion = 0

    # Initialize global variables (probably sets some state)
    globales(source_code, posicion, progLong)

    # Run parser (False = no debug print)
    AST = parser(True)

    # Run semantic analysis
    semantica(AST, True)

    # Run code generation to string (modify codeGen to return string instead of writing to file)
    output_code = codeGen(AST)

    return output_code
