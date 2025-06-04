import React from 'react';
import AppHeader from '../../components/AppHeader';
import '../../scss/AdminDashboard.scss';

const AdminDashboard = () => {
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
                <td>print('Hola')</td>
                <td>Hola</td>
                <td>
                  <button className="delete-user-btn">Borrar usuario</button>
                </td>
              </tr>
              {/* Más filas aquí */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 