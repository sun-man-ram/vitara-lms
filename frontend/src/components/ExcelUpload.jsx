import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExcelUpload = () => {
  const [excelData, setExcelData] = useState([]);
  const fileInputRef = useRef(null); // to reset the file input

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(json);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5100/api/school/bulk-register', { schools: excelData });
      const addedCount = res.data.count || excelData.length;

      alert(`${addedCount} school(s) added successfully.`);

      // Reset form
      setExcelData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5>Excel Registration</h5>
        <div className="form-group mt-3">
          <label htmlFor="excelUpload">Upload Excel File</label>
          <input
            type="file"
            id="excelUpload"
            className="form-control-file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
        </div>
        <button
          type="button"
          className="btn btn-success mt-2"
          onClick={handleSubmit}
          disabled={excelData.length === 0}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default ExcelUpload;
