import React, { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import '../../scss/AdminDashboard.scss';

const AdminDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleShowModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent('');
    setModalTitle('');
  };

  return (
    <>
      <AppHeader />
      <div className="admin-dashboard-layout">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Hora de inicio de sesión</th>
                <th>Input</th>
                <th>Output</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo de fila, reemplazar por datos reales */}
              <tr>
                <td>@usuario1</td>
                <td>10:00 AM</td>
                <td className="clickable-cell" onClick={() => handleShowModal('Input', "print('Hola')\nprint('Otra línea de código')")}>print('Hola')</td>
                <td className="clickable-cell" onClick={() => handleShowModal('Output', 'Hola\nResultado de la ejecución...')}>Hola</td>
                <td>
                  <button className="delete-user-btn">Borrar usuario</button>
                </td>
              </tr>
              {/* Más filas aquí */}
            </tbody>
          </table>
        </div>

        {/* Modal para mostrar texto completo */}
        {modalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3>{modalTitle}</h3>
              <pre className="modal-content">{modalContent}</pre>
              <button className="close-modal-btn" onClick={handleCloseModal}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard; 