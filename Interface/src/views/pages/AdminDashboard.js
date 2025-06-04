import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../components/AppHeader';
import '../../scss/AdminDashboard.scss';

const AdminDashboard = () => {
  const { t } = useTranslation();
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
                <th>{t('user') || 'Usuario'}</th>
                <th>{t('sessionStart') || 'Hora de inicio de sesión'}</th>
                <th>{t('input') || 'Input'}</th>
                <th>{t('output') || 'Output'}</th>
                <th>{t('actions') || 'Acciones'}</th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo de fila, reemplazar por datos reales */}
              <tr>
                <td>@usuario1</td>
                <td>10:00 AM</td>
                <td className="clickable-cell" onClick={() => handleShowModal(t('input') || 'Input', "print('Hola')\nprint('Otra línea de código')")}>print('Hola')</td>
                <td className="clickable-cell" onClick={() => handleShowModal(t('output') || 'Output', 'Hola\nResultado de la ejecución...')}>Hola</td>
                <td>
                  <button className="delete-user-btn">{t('deleteUser') || 'Borrar usuario'}</button>
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
              <button className="close-modal-btn" onClick={handleCloseModal}>{t('close') || 'Cerrar'}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard; 