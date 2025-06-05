import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../components/AppHeader';
import '../../scss/AdminDashboard.scss';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar sesiones
  const fetchSessions = () => {
    setLoading(true);
    fetch("http://localhost:8000/admin/sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

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

  // Función para eliminar usuario
  const handleDeleteUser = (email) => {
    if (!window.confirm(t('confirmDeleteUser', { email }) || `¿Seguro que deseas eliminar el usuario ${email}?`)) return;
    fetch(`http://localhost:8000/admin/users/${encodeURIComponent(email)}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar usuario');
        return res.json();
      })
      .then(() => {
        fetchSessions(); // Refresca la tabla después de borrar
      })
      .catch(() => {
        alert(t('deleteUserError') || 'No se pudo eliminar el usuario');
      });
  };

  return (
    <>
      <AppHeader />
      <div className="admin-dashboard-layout">
        <div className="admin-table-container">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
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
                {sessions.map((item, index) => (
                  <tr key={index}>
                    <td>{item.email}</td>
                    <td>{item.start_time}</td>
                    <td
                      className="clickable-cell"
                      onClick={() => handleShowModal(t('input') || 'Input', item.input_code)}
                    >
                      {item.input_code && item.input_code.length > 30
                        ? item.input_code.substring(0, 30) + '...'
                        : item.input_code}
                    </td>
                    <td
                      className="clickable-cell"
                      onClick={() => handleShowModal(t('output') || 'Output', item.output_asm)}
                    >
                      {item.output_asm && item.output_asm.length > 30
                        ? item.output_asm.substring(0, 30) + '...'
                        : item.output_asm}
                    </td>
                    <td>
                      <button
                        className="delete-user-btn"
                        onClick={() => handleDeleteUser(item.email)}
                      >
                        {t('deleteUser') || 'Borrar usuario'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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