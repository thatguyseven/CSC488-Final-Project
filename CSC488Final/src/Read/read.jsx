import React, { useEffect, useState } from 'react';

function Read() {
  const [aggregateData, setAggregateData] = useState([]);
  const [gasData, setGasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Aggregate Emissions data
    const fetchAggregateData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get-aggregate');
        if (response.ok) {
          const data = await response.json();
          
          // Convert the object with stringified JSON to actual objects
          const parsedData = Object.values(data).map(record => JSON.parse(record));
          setAggregateData(parsedData);
        } else {
          throw new Error('Failed to fetch aggregate emissions data');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    // Fetch Gas Emissions data
    const fetchGasData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get-gas');
        if (response.ok) {
          const data = await response.json();
          
          // Convert the object with stringified JSON to actual objects
          const parsedData = Object.values(data).map(record => JSON.parse(record));
          setGasData(parsedData);
        } else {
          throw new Error('Failed to fetch gas emissions data');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    // Load data
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAggregateData(), fetchGasData()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render data
  return (
    <div>
      <h3>Emission Records</h3>

      <div>
        <h4>Aggregate Emissions</h4>
        <table border="1">
          <thead>
            <tr>
              <th>NAICS Code</th>
              <th>GHG</th>
            </tr>
          </thead>
          <tbody>
            {aggregateData.map((record, index) => (
              <tr key={index}>
                <td>{record.NAICS_Code}</td>
                <td>{record.GHGs ? record.GHGs.join(', ') : 'No GHG data'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4>Gas Emissions</h4>
        <table border="1">
          <thead>
            <tr>
              <th>NAICS Code</th>
              <th>GHG</th>
            </tr>
          </thead>
          <tbody>
            {gasData.map((record, index) => (
              <tr key={index}>
                <td>{record.NAICS_Code}</td>
                <td>{record.GHGs ? record.GHGs.join(', ') : 'No GHG data'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Read;

