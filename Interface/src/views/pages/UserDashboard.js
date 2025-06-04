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
      const response = await fetch("http://localhost:8000/save_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          input_code: inputCode,
          output_asm: "",  // Ya no necesitamos enviar esto
          success: true,
          error_message: ""
        })
      });

      const data = await response.json();
      setOutputCode(data.output);
  
    } catch (error) {
      console.error("Error:", error);
      setOutputCode(t("compilationError"));
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
            <div className="output-area" readOnly>
              <pre>{outputCode}</pre>
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
              <p>{t("helpInfo")}</p>
              <button onClick={() => setShowHelp(false)}>{t("close")}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;