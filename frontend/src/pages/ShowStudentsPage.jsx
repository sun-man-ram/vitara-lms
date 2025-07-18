import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header2.jsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ShowStudentsPage = () => {
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [schoolId, setSchoolId] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5100/api/school/all')
      .then(res => setSchools(res.data))
      .catch(err => console.error('Failed to fetch schools:', err));
  }, []);

  useEffect(() => {
    if (schoolId) {
      axios.get(`http://localhost:5100/api/class/by-school/${schoolId}`)
        .then(res => setClasses(res.data))
        .catch(err => console.error('Failed to fetch classes:', err));
    } else {
      setClasses([]);
    }
    setClassName('');
    setSection('');
  }, [schoolId]);

  const exportToExcel = (data) => {
    const exportData = data.map(s => ({
      StudentID: s.studentId,
      Name: s.studentName,
      ClassID: s.classId,
      RollNo: s.rollNo,
      Parent: s.parentName,
      Contact: s.contactNumber,
      Password: s.password || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const fileName = prompt("Enter filename", "students_list") || "students_list";
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${fileName}.xlsx`);
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get('http://localhost:5100/api/student/filter', {
        params: {
          schoolId,
          className,
          section
        }
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch students');
    }
  };

  const uniqueClasses = [...new Set(classes.map(c => c.className))];
  const sectionsForClass = classes
    .filter(c => c.className === className)
    .map(c => c.section);

  return (
    <div className="container mt-4">
      <Header />
      <h3>🎒 Show Students by Filter</h3>

      <div className="row my-3">
        <div className="col-md-4">
          <label>School</label>
          <select className="form-select" value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>
            <option value="">-- Select School --</option>
            {schools.map((s) => (
              <option key={s.schoolId} value={s.schoolId}>{s.schoolName} ({s.schoolId})</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label>Class</label>
          <select className="form-select" value={className} onChange={(e) => setClassName(e.target.value)}>
            <option value="">-- Select Class --</option>
            {uniqueClasses.map((cls, idx) => (
              <option key={idx} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label>Section</label>
          <select className="form-select" value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">-- Select Section --</option>
            {sectionsForClass.map((sec, idx) => (
              <option key={idx} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {students.length > 0 && (
        <>
          <div className="text-end mb-3">
            <button className="btn btn-success" onClick={() => exportToExcel(students)}>
              Export to Excel
            </button>
          </div>

          <div className="table-responsive mt-2">
            <table className="table table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class ID</th>
                  <th>Roll No</th>
                  <th>Parent</th>
                  <th>Contact</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.studentId}>
                    <td>{stu.studentId}</td>
                    <td>{stu.studentName}</td>
                    <td>{stu.classId}</td>
                    <td>{stu.rollNo}</td>
                    <td>{stu.parentName}</td>
                    <td>{stu.contactNumber}</td>
                    <td>{stu.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
};

export default ShowStudentsPage;
