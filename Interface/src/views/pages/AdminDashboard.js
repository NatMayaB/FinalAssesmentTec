import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../components/AppHeader';
import { useNavigate } from 'react-router-dom';
import '../../scss/AdminDashboard.scss';

const DELETED_USERS_KEY = 'deletedUsers';
const POLLING_INTERVAL = 5000; // 5 segundos
const BACKEND_URL = 'http://localhost:8000';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabledUsers, setDisabledUsers] = useState(() => {
    // Leer usuarios eliminados de localStorage al cargar
    const stored = localStorage.getItem(DELETED_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [activeUsers, setActiveUsers] = useState([]);
  const navigate = useNavigate();

  // Función para cargar sesiones
  const fetchSessions = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }
    fetch(`${BACKEND_URL}/admin/sessions`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          navigate('/login');
          return { sessions: [] };
        }
        return res.json();
      })
      .then((data) => {
        setSessions(data.sessions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Función para cargar usuarios activos
  const fetchActiveUsers = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }
    fetch(`${BACKEND_URL}/admin/users`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          navigate('/login');
          return { users: [] };
        }
        return res.json();
      })
      .then(data => setActiveUsers(data.users || []));
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSessions();
    fetchActiveUsers();
  }, [navigate]);

  // Efecto para polling de actualizaciones
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchSessions();
      fetchActiveUsers();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // Limpia disabledUsers de emails que ya no aparecen en la tabla
  useEffect(() => {
    const sessionEmails = sessions.map(s => s.email);
    const filtered = disabledUsers.filter(email => sessionEmails.includes(email));
    if (filtered.length !== disabledUsers.length) {
      setDisabledUsers(filtered);
    }
    // eslint-disable-next-line
  }, [sessions]);

  // Actualiza localStorage cuando cambia disabledUsers
  useEffect(() => {
    localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(disabledUsers));
  }, [disabledUsers]);

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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }
    setDisabledUsers((prev) => {
      const updated = [...prev, email];
      localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(updated));
      return updated;
    });
    fetch(`${BACKEND_URL}/admin/users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar usuario');
        return res.json();
      })
      .then(() => {
        fetchSessions(); // Refresca la tabla después de borrar
        fetchActiveUsers(); // Refresca también la lista de usuarios activos
      })
      .catch(() => {
        alert(t('deleteUserError') || 'No se pudo eliminar el usuario');
        setDisabledUsers((prev) => {
          const updated = prev.filter(e => e !== email);
          localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(updated));
          return updated;
        });
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
                  <th>{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {sessions.filter(item => activeUsers.includes(item.email)).map((item, index) => (
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
                        disabled={disabledUsers.includes(item.email)}
                        style={
                          disabledUsers.includes(item.email)
                            ? { opacity: 0.5, cursor: 'not-allowed' }
                            : {}
                        }
                      >
                        {t('deleteUser') || 'Delete user'}
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