import React, { useState, useEffect } from 'react';

const AdminHistorial = () => {
  const [historialData, setHistorialData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/admin/sessions")
      .then((res) => res.json())
      .then((data) => {
        // Ajusta los datos para que coincidan con las columnas de la tabla
        const mapped = data.sessions.map(session => ({
          date: session.compiled_at || session.start_time || "",
          user: session.email || "",
          action: session.success ? "Compilación exitosa" : "Error",
          details: session.error_message || "OK"
        }));
        setHistorialData(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="admin-historial">
      <h1>Historial</h1>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="historial-content">
          <div className="filters">
            {/* Add filters here */}
          </div>

          <div className="historial-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {historialData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.user}</td>
                    <td>{item.action}</td>
                    <td>{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHistorial;