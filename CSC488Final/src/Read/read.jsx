import React, { useEffect, useState } from 'react';
import './read.css';

function Read() {
  const [gasData, setGasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGasData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get-gas');
        if (response.ok) {
          const data = await response.json();
          const parsedData = Object.values(data).map(record => JSON.parse(record));

          // Object to hold summed emission factors for each GHG
          const gasSums = {};

          parsedData.forEach(record => {
            const ghg = record.GHG;
            const factor = parseFloat(record['Supply_Chain_Emission_Factors_without_Margins']) || 0;

            // If GHG is already in gasSums, add the factor, otherwise initialize it
            if (ghg) {
              if (gasSums[ghg]) {
                gasSums[ghg].totalFactor += factor;
              } else {
                gasSums[ghg] = {
                  GHG: ghg,
                  totalFactor: factor,
                  Unit: record.Unit || 'No Unit' // Keeping the first unit as reference
                };
              }
            }
          });

          // Convert gasSums object to an array for rendering in the table
          setGasData(Object.values(gasSums));
        } else {
          throw new Error('Failed to fetch gas emissions data');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGasData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table">
      <h4>Gas Emissions</h4>
      <table border="1">
        <thead>
          <tr>
            <th>GHG</th>
            <th>Sum of Supply Chain Emission Factor (without margins)</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {gasData.map((record, index) => (
            <tr key={index}>
              <td>{record.GHG || 'No GHG'}</td>
              <td>{record.totalFactor ? record.totalFactor.toExponential(6) : '0'}</td>
              <td>{record.Unit || 'No Unit'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Read;


