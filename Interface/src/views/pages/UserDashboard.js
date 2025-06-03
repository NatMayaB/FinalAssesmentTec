import React, { useState } from 'react';
import '../../scss/UserDashboard.scss';
import AppHeader from '../../components/AppHeader';

const UserDashboard = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <AppHeader />
      <div className="user-ide-layout">
        {/* Paneles principales */}
        <main className="dashboard-main">
          <section className="panel input-panel">
            <div className="input-panel-header">
              <h3 className="panel-title">Input</h3>
              <button className="help-btn" onClick={() => setShowHelp(true)} title="Ayuda">
                <span role="img" aria-label="help">❓</span>
              </button>
            </div>
            <textarea className="input-area" placeholder="Escribe tu código aquí..."></textarea>
            <button className="send-btn">Send</button>
          </section>
          <section className="panel output-panel">
            <h3 className="panel-title">Output</h3>
            <div className="output-area" readOnly>
              {/* Aquí se mostrará el output, el usuario no puede escribir */}
            </div>
          </section>
        </main>

        {/* Modal de ayuda */}
        {showHelp && (
          <div className="modal-overlay" onClick={() => setShowHelp(false)}>
            <div className="help-modal" onClick={e => e.stopPropagation()}>
              <h3>Ayuda</h3>
              <p>Aquí puedes poner la información de ayuda para el usuario sobre cómo usar la vista.</p>
              <button onClick={() => setShowHelp(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard; 