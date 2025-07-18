import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ClassExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    setStatusMsg('');
  };

  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      try {
        setUploading(true);
        setStatusMsg('');
        setProgress(10);

        await axios.post(
          'http://localhost:5100/api/class/bulk-create',
          jsonData,
          {
            onUploadProgress: (event) => {
              if (event.total) {
                const percent = Math.round((event.loaded * 100) / event.total);
                setProgress(percent);
              }
            }
          }
        );

        setProgress(100);
        setStatusMsg(`✅ Uploaded successfully`);
        setFile(null);
      } catch (err) {
        console.error(err);
        setStatusMsg('❌ Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="col-12 mb-4">
      <div className="card">
        <div className="card-header bg-info text-white">Class Excel Upload</div>
        <div className="card-body">
          <input type="file" accept=".xlsx, .xls" className="form-control mb-3" onChange={handleFileChange} />
          <button className="btn btn-primary" onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>

          {uploading && (
            <div className="progress mt-3" style={{ height: '20px' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          )}

          {statusMsg && <div className="mt-2">{statusMsg}</div>}
        </div>
      </div>
    </div>
  );
};

export default ClassExcelUpload;
