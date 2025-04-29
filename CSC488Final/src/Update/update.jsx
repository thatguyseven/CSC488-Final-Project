import React, { useState } from 'react';

function Update() {
  const [naicsCode, setNaicsCode] = useState('');
  const [matchedRecords, setMatchedRecords] = useState([]);
  const [searched, setSearched] = useState(false);
  const [naicsTitle, setNaicsTitle] = useState(''); // State to store the NAICS Title
  const [form, setForm] = useState({
    GHG: '',
    Unit: '',
    Margins: ''
  }); // To handle form input values

  // Define the array of GHGs for the dropdown
  const ghgs = [
    "Carbon dioxide",
    "Carbon tetrafluoride",
    "HFC-125",
    "HFC-134a",
    "HFC-143a",
    "HFC-23",
    "HFC-236fa",
    "HFC-32",
    "HFCs and PFCs, unspecified",
    "Hexafluoroethane",
    "Methane",
    "Nitrogen trifluoride",
    "Nitrous oxide",
    "Perfluorocyclobutane",
    "Perfluoropropane",
    "Sulfur hexafluoride"
  ];

  // Handle searching for the NAICS code
  const handleCheck = async () => {
    setSearched(true);
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

        // Pre-set the GHG value in the form if one is available
        const ghgsFromRecord = matchedGas.length > 0 ? matchedGas[0].GHGs : [];
        setForm({
          GHG: ghgsFromRecord[0] || '',  // Default GHG if any found
          Unit: matchedGas.length > 0 ? matchedGas[0].Unit : '',
          Margins: matchedGas.length > 0 ? matchedGas[0]['Margins_of_Supply_Chain_Emission_Factors'] : ''
        });
      } else {
        setMatchedRecords([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMatchedRecords([]);
    }
  };

  // Handle changes in the form (GHG, Unit, Margins)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update the record
  const handleSubmit = async () => {
    if (!matchedRecords.length) return;

    const updatedRecord = {
      ...matchedRecords[0],
      GHG: form.GHG,
      Unit: form.Unit,
      'Margins_of_Supply_Chain_Emission_Factors': form.Margins
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/create-gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecord)
      });

      const result = await res.json();
      alert(result.message || 'Updated successfully!');
      setSearched(false);
      setForm({
        GHG: '',
        Unit: '',
        Margins: ''
      });
      setMatchedRecords([]);
    } catch (err) {
      console.error('Update error:', err);
      alert('Error while updating the record.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mb-4">Update Gas Record</h1>

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

      {matchedRecords.length > 0 && (
        <div className="update-form">
          <h2 className="text-xl font-semibold mb-2">This NAICS Code has been found!</h2>
          <p><strong>NAICS Title:</strong> {naicsTitle}</p>

          {/* GHG Dropdown List */}
          <label>
            GHG:
            <select name="GHG" value={form.GHG} onChange={handleChange}>
              <option value="">Select GHG</option>
              {ghgs.map((ghg, index) => (
                <option key={index} value={ghg}>{ghg}</option>
              ))}
            </select>
          </label>
          <br></br>
          <label>
            Unit:
            <input type="text" name="Unit" value={form.Unit} onChange={handleChange} />
          </label>

          <label>
            Margins of Supply Chain Emission Factors:
            <input
              type="text"
              name="Margins"
              value={form.Margins}
              onChange={handleChange}
            />
          </label>

          <button onClick={handleSubmit}>Submit Update</button>
        </div>
      )}
    </div>
  );
}

export default Update;

