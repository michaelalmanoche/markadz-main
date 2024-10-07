// pages/assignments.js
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const Assignments = () => {
  const [vans, setVans] = useState([]);
  const [operators, setOperators] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedVans, setSelectedVans] = useState({});
  
  useEffect(() => {
    // Fetch vans, operators, and drivers from the API
    const fetchData = async () => {
      const vansResponse = await axios.get('/api/vans');
      const operatorsResponse = await axios.get('/api/operators');
      const driversResponse = await axios.get('/api/drivers');
      setVans(vansResponse.data);
      setOperators(operatorsResponse.data);
      setDrivers(driversResponse.data);
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    await axios.post('/api/assignments', {
      operatorId: selectedOperator,
      vanDriverAssignments: selectedVans,
    });
    alert('Assignment successful');
  };

  const handleVanSelection = (vanId, driverId) => {
    setSelectedVans((prev) => ({
      ...prev,
      [vanId]: driverId,
    }));
  };

  return (
    <div>
      <h1>Assign Vans to Operator and Driver</h1>
      <div>
        <label>Select Operator: </label>
        <select onChange={(e) => setSelectedOperator(e.target.value)} value={selectedOperator}>
          <option value="">Select Operator</option>
          {operators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.firstname} {operator.lastname}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Van ID</th>
            <th>Plate Number</th>
            <th>Make</th>
            <th>Model</th>
            <th>Driver</th>
          </tr>
        </thead>
        <tbody>
          {vans.map((van) => (
            <tr key={van.id}>
              <td>
                <input
                  type="checkbox"
                  checked={!!selectedVans[van.id]}
                  onChange={(e) => handleVanSelection(van.id, e.target.value)}
                />
              </td>
              <td>{van.id}</td>
              <td>{van.plate_number}</td>
              <td>{van.make}</td>
              <td>{van.series}</td>
              <td>
                <select
                  onChange={(e) => handleVanSelection(van.id, e.target.value)}
                  value={selectedVans[van.id] || ''}
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstname} {driver.lastname}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAssign}>Assign</button>
    </div>
  );
};

export default Assignments;