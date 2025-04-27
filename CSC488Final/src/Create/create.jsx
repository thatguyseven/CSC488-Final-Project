import React, { useState } from 'react';
import './create.css'
/* 
   2017 NAICS Code
   2017 NAICS Title
   GHG
   Unit kg CO2e/2
   Supply Chain Emission Factors without Margins
   Margins of Supply Chain Emission Factors
   Supply Chain Emission Factors with Margins
   Reference USEEIO Code
*/
const Create = () => {
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

  return (
    <div>
      <h3>Create a data point</h3>
      <p>Please fill in the following fields: </p>
      <form>
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

<       label>
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
          <h4>NAICS Supply Emission With Margins </h4>
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
        <br></br>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          Submit
        </button>
      </form>
      {formSubmitted && <p className="success-message">Report submitted successfully!</p>}
    </div>
  )
}

export default Create