import React, { useState, useEffect } from 'react';

const AdminHistorial = () => {
  const [historialData, setHistorialData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/admin/sessions")
      .then((res) => res.json())
      .then((data) => {
        setHistorialData(data.sessions);
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
                  <th>Email</th>
                  <th>Start Time</th>
                  <th>Input Code</th>
                  <th>Output ASM</th>
                  <th>Success</th>
                  <th>Error Message</th>
                  <th>Compiled At</th>
                </tr>
              </thead>
              <tbody>
                {historialData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.email}</td>
                    <td>{item.start_time}</td>
                    <td>{item.input_code}</td>
                    <td>{item.output_asm}</td>
                    <td>{item.success ? "Sí" : "No"}</td>
                    <td>{item.error_message || "OK"}</td>
                    <td>{item.compiled_at}</td>
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