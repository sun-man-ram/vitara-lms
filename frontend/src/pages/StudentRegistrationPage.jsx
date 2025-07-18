import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Header from '../components/Header2.jsx';

const StudentRegistrationPage = () => {
  const [students, setStudents] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
        const formatted = json.map(row => ({
          schoolId: row.schoolId || row.schoolID || '',
          studentName: row.studentName || row['Student Name'] || '',
          class: row.class || row.Class || '',
          section: row.section || row.Section || '',
          rollNo: row.rollNo || row['Roll No.'] || '',
          parentName: row.parentName || row['Parent Name'] || '',
          contactNumber: row.contactNumber || row['Contact Number'] || ''
        }));
        setStudents(formatted);

    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5100/api/student/bulk-register', {
        students,
      });
      alert(`Successfully uploaded ${res.data.count} students!`);
      setStudents([]);
    } catch (err) {
      console.error(err);
      alert('Failed to upload students');
    }
  };

  return (
    <div className="container">
      <Header />
      <h2 className="mt-4">📘 Add Students</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        className="form-control my-3"
        onChange={handleFileUpload}
      />

      {students.length > 0 && (
        <>
          <p><strong>Preview:</strong> {fileName} - {students.length} records</p>
          <table className="table table-bordered">
            <thead>
              <tr>
                {Object.keys(students[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-success" onClick={handleSubmit}>
            Upload to Backend
          </button>
        </>
      )}
    </div>
  );
};

export default StudentRegistrationPage;
