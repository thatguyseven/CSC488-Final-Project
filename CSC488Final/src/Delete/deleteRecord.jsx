import React, { useState } from 'react';
import './deleteRecord.css'; // Import the CSS file

function DeleteRecord() {
  const [naicsCode, setNaicsCode] = useState('');
  const [matchedRecords, setMatchedRecords] = useState([]);
  const [searched, setSearched] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [naicsTitle, setNaicsTitle] = useState(''); // State to store the NAICS Title

  const handleCheck = async () => {
    setSearched(true);
    setDeleteConfirmation(false); // Reset delete confirmation on new search
    setNaicsTitle(''); // Reset title before searching

    try {
      const [aggRes, gasRes] = await Promise.all([
        fetch('http://127.0.0.1:5000/get-aggregate'),
        fetch('http://127.0.0.1:5000/get-gas')
      ]);

      const aggData = await aggRes.json();
      const gasData = await gasRes.json();

      const matchedAgg = aggData[naicsCode] ? [JSON.parse(aggData[naicsCode])] : [];
      const matchedGas = Object.values(gasData)
        .map(JSON.parse)
        .filter(record => String(record['2017 NAICS Code']) === naicsCode);

      const allMatches = [...matchedAgg, ...matchedGas];

      if (allMatches.length > 0) {
        setMatchedRecords(allMatches);
        // Set the NAICS Title from matched records (if exists)
        const titleFromAgg = matchedAgg.length > 0 ? matchedAgg[0]['2017_NAICS_Title'] : '';
        const titleFromGas = matchedGas.length > 0 ? matchedGas[0]['2017_NAICS_Title'] : '';

        setNaicsTitle(titleFromAgg || titleFromGas); // Prefer Aggregate title if both are available
      } else {
        setMatchedRecords([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMatchedRecords([]);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true); // Show delete confirmation if not already shown
      return;
    }

    try {
      const res1 = await fetch(`http://127.0.0.1:5000/delete-aggregate/${naicsCode}`, {
        method: 'DELETE'
      });
      const res2 = await fetch(`http://127.0.0.1:5000/delete-gas/${naicsCode}`, {
        method: 'DELETE'
      });

      const msg1 = await res1.json();
      const msg2 = await res2.json();

      alert(`Delete Results:\n${msg1.message || msg1.error}\n${msg2.message || msg2.error}`);
      setMatchedRecords([]);
      setSearched(false);
      setDeleteConfirmation(false); // Reset delete confirmation
      setNaicsTitle(''); // Reset the NAICS Title
    } catch (err) {
      alert('An error occurred during deletion.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mb-4">Delete a Record</h1>

      <input
        type="text"
        placeholder="Enter NAICS Code"
        value={naicsCode}
        onChange={(e) => setNaicsCode(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <button
        onClick={handleCheck}
        className="check-btn"
      >
        Check NAICS Code
      </button>

      {searched && matchedRecords.length === 0 && (
        <p className="no-data">No data found for NAICS Code: {naicsCode}</p>
      )}

      {matchedRecords.length > 0 && !deleteConfirmation && (
        <div className="matched-records">
          <h2 className="text-xl font-semibold mb-2">This NAICS Code has been found!</h2>
          <p><strong>NAICS Title:</strong> {naicsTitle}</p>
          <p>Would you like to delete this NAICS Code from the data sets?</p>
          <button
            onClick={handleDelete}
            className="delete-btn"
          >
            Delete Record
          </button>
        </div>
      )}

      {deleteConfirmation && (
        <div className="matched-records">
          <h2 className="text-xl font-semibold mb-2">This NAICS Code has been found!</h2>
          <p><strong>NAICS Title:</strong> {naicsTitle}</p>
          <p>Are you sure you want to delete this NAICS Code from the data sets?</p>
          <button
            onClick={handleDelete}
            className="delete-btn"
          >
            Confirm Delete
          </button>
          <button
            onClick={() => setDeleteConfirmation(false)} // Cancel delete confirmation
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default DeleteRecord;
