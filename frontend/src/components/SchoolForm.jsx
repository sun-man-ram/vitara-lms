import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SchoolForm.css';

const SchoolForm = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    boardOfAffiliation: '',
    address: '',
    officialEmail: '',
    contactNumber: '',
    iitFoundationInchargeName: '',
    inchargeContactNumber: '',
    inchargeEmail: '',
  });

  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [showCreds, setShowCreds] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5100/api/school/schoolregistration', formData);
      const { school } = res.data;
      setCredentials({ userId: school.schoolId, password: 'auto-generated' });
      setShowCreds(true);
      alert('School registered successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const copyText = (id) => {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="col-lg-10 mx-auto mt-5">
      <div className="card shadow-sm rounded-3 border-0">
        <div className="card-header text-white" style={{ backgroundColor: "#7B1FA2", fontSize: "1.25rem", fontWeight: "600" }}>
          New School Registration
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>

            {/* Row 1: School Name and School Code */}
            <div className="form-row-inline">
              <label htmlFor="schoolName">School Name</label>
              <input type="text" name="schoolName" id="schoolName" required onChange={handleChange} />
            </div>

            {/* Row 2: Board of Affiliation */}
            <div className="form-row-inline">
              <label htmlFor="boardOfAffiliation">Board of Affiliation</label>
              <input type="text" name="boardOfAffiliation" id="boardOfAffiliation" required onChange={handleChange} />
            </div>

            {/* Row 3: Address */}
            <div className="form-row-inline">
              <label htmlFor="address">Address</label>
              <input type="text" name="address" id="address" required onChange={handleChange} />
            </div>

            {/* Row 4: Contact Number, Official Email, Role */}
            <div className="form-row-inline">
              <label htmlFor="contactNumber">Contact Number</label>
              <input type="tel" name="contactNumber" id="contactNumber" required onChange={handleChange} />
            </div>
            <div className="form-row-inline">
              <label htmlFor="officialEmail">Official Email</label>
              <input type="email" name="officialEmail" id="officialEmail" required onChange={handleChange} />
            </div>

            {/* Row 5: Incharge details */}
            <div className="form-row-inline">
              <label htmlFor="iitFoundationInchargeName">Incharge Name</label>
              <input type="text" name="iitFoundationInchargeName" id="iitFoundationInchargeName" required onChange={handleChange} />
            </div>
            <div className="form-row-inline">
              <label htmlFor="inchargeContactNumber">Incharge Contact</label>
              <input type="tel" name="inchargeContactNumber" id="inchargeContactNumber" required onChange={handleChange} />
            </div>
            <div className="form-row-inline">
              <label htmlFor="inchargeEmail">Incharge Email</label>
              <input type="email" name="inchargeEmail" id="inchargeEmail" required onChange={handleChange} />
            </div>

            {/* Generated credentials */}
            {showCreds && (
              <div id="credentialsSection" className="border rounded p-3 mb-4 bg-light">
                <h6 className="fw-bold">Generated Credentials</h6>
                <p>
                  <strong>User ID:</strong> <span id="generatedUserId">{credentials.userId}</span>
                  <button type="button" onClick={() => copyText("generatedUserId")}>Copy</button>
                </p>
                <p>
                  <strong>Password:</strong> <span id="generatedPassword">{credentials.password}</span>
                  <button type="button" onClick={() => copyText("generatedPassword")}>Copy</button>
                </p>
              </div>
            )}

            {/* Submit row */}
            <div className="form-row-inline submit-row">
              <button type="submit">Submit</button>
              <button type="reset" id="resetBtn">Clear</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SchoolForm;
