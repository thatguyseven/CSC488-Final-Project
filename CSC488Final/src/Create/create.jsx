import React, { useState } from 'react';
import './create.css';

const Create = () => {
  const [databaseSelection, setDatabaseSelection] = useState('');
  const [NAICScode, setNAICSCode] = useState('');
  const [NAICSTitle, setNAICSTitle] = useState('');
  const [GHG, setGHG] = useState('');
  const [unit, setUnit] = useState('');
  const [supplyEmissionWithout, setsupplyEmissionWithout] = useState('');
  const [supplyFacotrs, setSupplyFactors] = useState('');
  const [supplyEmissionWith, setsupplyEmissionWith] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submit button clicked!')

    let url = '';
    if (databaseSelection === 'Aggregate Emissions') {
      url = 'http://127.0.0.1:5000/create-aggregate';
    } else if (databaseSelection === 'Gas Emissions') {
      url = 'http://127.0.0.1:5000/create-gas';
    } else {
      alert('Please select a database before submitting.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      NAICS_Code: NAICScode,
      NAICS_Title: NAICSTitle,
      GHG: GHG,
      Unit: unit,
      Supply_Chain_Emission_Without_Margins: supplyEmissionWithout,
      Supply_Chain_Emission_Factors: supplyFacotrs,
      Supply_Chain_Emission_With_Margins: supplyEmissionWith,
      Reference_Code: referenceCode,
      Gas_Name: GHG
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormSubmitted(true);
        console.log('Data submitted successfully.');
        // Reload the page after successful submission
        window.location.reload();
      } else {
        console.error('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3>Create a data point</h3>
      <p>Please fill in the following fields: </p>
      <form onSubmit={handleSubmit}>
        <label>
          <h4>Select a database to put this data point in:</h4>
        </label>
        <select
          id="databaseSelect"
          className="database-select"
          value={databaseSelection}
          onChange={(e) => setDatabaseSelection(e.target.value)}
        >
          <option value="">-- Please select an option --</option>
          <option value="Aggregate Emissions">Aggregate Emissions</option>
          <option value="Gas Emissions">Gas Emissions</option>
        </select>

        <label>
          <h4>NAICS Code</h4>
        </label>
        <textarea 
          id="NAICSCode"
          className="nCode"
          value={NAICScode}
          onChange={(e) => setNAICSCode(e.target.value)}
          placeholder="Enter code here..."
          rows="4"
        />

        <label>
          <h4>NAICS Title</h4>
        </label>
        <textarea 
          id="NAICSTitle"
          className="nTitle"
          value={NAICSTitle}
          onChange={(e) => setNAICSTitle(e.target.value)}
          placeholder="Enter title here..."
          rows="4"
        />

        <label>
          <h4>NAICS GHG</h4>
        </label>
        <textarea 
          id="NAICSGHG"
          className="nGHG"
          value={GHG}
          onChange={(e) => setGHG(e.target.value)}
          placeholder="Enter GHG here..."
          rows="4"
        />
        
        <label>
          <h4>NAICS Unit</h4>
        </label>
        <textarea 
          id="NAICSUnit"
          className="nUnit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Enter unit here..."
          rows="4"
        />

        <label>
          <h4>NAICS Supply Emission Without Margins</h4>
        </label>
        <textarea 
          id="NAICSNoMargins"
          className="nNoMargins"
          value={supplyEmissionWithout}
          onChange={(e) => setsupplyEmissionWithout(e.target.value)}
          placeholder="Enter supply emission without margins here..."
          rows="4"
        />

        <label>
          <h4>NAICS Supply Factors</h4>
        </label>
        <textarea 
          id="NAICSFactors"
          className="nFactors"
          value={supplyFacotrs}
          onChange={(e) => setSupplyFactors(e.target.value)}
          placeholder="Enter unit here..."
          rows="4"
        />

        <label>
          <h4>NAICS Supply Emission With Margins</h4>
        </label>
        <textarea 
          id="NAICSMargins"
          className="nMargins"
          value={supplyEmissionWith}
          onChange={(e) => setsupplyEmissionWith(e.target.value)}
          placeholder="Enter supply emission with margins here..."
          rows="4"
        />

        <label>
          <h4>NAICS Reference Code</h4>
        </label>
        <textarea 
          id="NAICSRefCode"
          className="nRefCode"
          value={referenceCode}
          onChange={(e) => setReferenceCode(e.target.value)}
          placeholder="Enter reference code here..."
          rows="4"
        />

        <br />
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {formSubmitted && <p className="success-message">Report submitted successfully!</p>}
    </div>
  );
};

export default Create;


