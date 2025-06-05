import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../scss/UserDashboard.scss';
import AppHeader from '../../components/AppHeader';

const UserDashboard = () => {
  const { t, i18n } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);
  
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleLanguageChange = () => {
      setOutputCode('');
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    setCopied(false);
  }, [outputCode]);

  const handleSend = async () => {
    setLoading(true);
    setOutputCode('');
  
    try {
      // 1. Llamada a nuestra API que actúa como proxy
      console.log("Enviando código para compilar...");
      const compileResponse = await fetch("http://localhost:8000/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: inputCode })
      });

      const responseData = await compileResponse.json().catch(() => ({}));
      
      if (!compileResponse.ok) {
        throw new Error(responseData.detail || `Error en la compilación: ${compileResponse.status}`);
      }

      console.log("Respuesta de la compilación:", responseData);
      
      // Detectar y mostrar el output correcto
      const output =
        Array.isArray(responseData.compiled_code)
          ? responseData.compiled_code.join('\n')
          : responseData.output || "No output";
      setOutputCode(output);

      // 2. Guardar en nuestra base de datos
      console.log("Guardando sesión en la base de datos...");
      const compiledAt = new Date().toISOString();
      const saveResponse = await fetch("http://localhost:8000/save_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          input_code: inputCode,
          output_asm: output,
          success: true,
          error_message: "",
          compiled_at: compiledAt
        })
      });

      if (!saveResponse.ok) {
        throw new Error(`Error al guardar la sesión: ${saveResponse.status}`);
      }

      const saveData = await saveResponse.json();
      console.log("Sesión guardada:", saveData);
  
    } catch (error) {
      console.error("Error detallado:", error);
      // Si el error tiene un detail (mensaje del backend), úsalo como output
      let errorMessage = error.message || t("compilationError");
      // Extraer el detail si viene en formato: ...{"detail":"mensaje"}
      const match = errorMessage.match(/\{"detail":"([^"]+)"\}/);
      if (match) {
        errorMessage = match[1];
      }
      setOutputCode(errorMessage);
      
      // Guardar el error en la base de datos como output_asm
      try {
        console.log("Intentando guardar el error en la base de datos...");
        const compiledAt = new Date().toISOString();
        const errorResponse = await fetch("http://localhost:8000/save_session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: localStorage.getItem("userEmail"),
            input_code: inputCode,
            output_asm: errorMessage, // Guardar el mensaje de error como output
            success: false,
            error_message: errorMessage,
            compiled_at: compiledAt
          })
        });

        if (!errorResponse.ok) {
          console.error("Error al guardar la sesión de error:", errorResponse.status);
        }
      } catch (saveError) {
        console.error("Error al guardar la sesión de error:", saveError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <div className="user-ide-layout">
        {/* Paneles principales */}
        <main className="dashboard-main">
          <section className="panel input-panel">
            <div className="input-panel-header">
              <h3 className="panel-title">{t("input")}</h3>
              <button className="help-btn" onClick={() => setShowHelp(true)} title={t("help")}>
                <span role="img" aria-label="help">❓</span>
              </button>
            </div>
            <textarea
              className="input-area"
              placeholder={t("writeCodeHere")}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <button className="send-btn" onClick={handleSend} disabled={loading}>
              {loading ? t("sending") : t("send")}
            </button>
          </section>
          <section className="panel output-panel">
            <div className="output-panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="panel-title">{t("output")}</h3>
            </div>
            <div className="output-area" readOnly style={{
              background: '#f8f9fa',
              borderRadius: '4px',
              padding: '8px',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              <pre
                style={{
                  margin: 0,
                  minWidth: 0,
                  minHeight: 0,
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'transparent',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}
              >
                {outputCode}
              </pre>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                className="copy-btn send-btn"
                title={t("copy")}
                onClick={() => {
                  if (outputCode) {
                    navigator.clipboard.writeText(outputCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }
                }}
                disabled={!outputCode}
                style={{ marginRight: "8px" }}
              >
                {copied ? t("copied") : t("copy")}
              </button>
              <button
                className="download-btn send-btn"
                title={t("download")}
                onClick={() => {
                  if (outputCode) {
                    const blob = new Blob([outputCode], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "output.asm";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }
                }}
                disabled={!outputCode}
              >
                {t("download")}
              </button>
            </div>
          </section>
        </main>

        {/* Modal de ayuda */}
        {showHelp && (
          <div className="modal-overlay" onClick={() => setShowHelp(false)}>
            <div className="help-modal" onClick={e => e.stopPropagation()}>
              <h3>{t("help")}</h3>
              <ol style={{ textAlign: "left" }}>
                {t("helpSteps", { returnObjects: true }).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <button onClick={() => setShowHelp(false)}>{t("close")}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;