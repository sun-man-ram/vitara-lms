import React, { useEffect, useState } from 'react';
import '../styles/admin.css';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const publicHolidays = ["2024-01-26", "2024-08-15", "2024-10-02", "2024-12-25"];

const Calendar = () => {
  const today = new Date();
  const [calendarActive, setCalendarActive] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const years = [];
    for (let y = 2020; y <= 2035; y++) {
      years.push(y);
    }
    setYearOptions(years);
  }, []);

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendar = [];
    let date = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(null);
        } else if (date > daysInMonth) {
          week.push(null);
        } else {
          const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
          week.push({
            date,
            isToday:
              date === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear(),
            isSunday: j === 0,
            isHoliday: publicHolidays.includes(fullDate),
          });
          date++;
        }
      }
      calendar.push(week);
    }
    return calendar;
  };

  const calendarData = generateCalendar();

  const toggleCalendar = () => {
    setCalendarActive(!calendarActive);
    if (!calendarActive) {
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
    }
  };

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <>
      <button className="calendar-toggle-btn" onClick={toggleCalendar}>📅 Calendar</button>
      {calendarActive && (
        <div className="calendar active">
          <div className="calendar-header">
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="nav-buttons">
              <button onClick={() => changeMonth(-1)}>&#8592;</button>
              <h3>{monthNames[currentMonth]}</h3>
              <button onClick={() => changeMonth(1)}>&#8594;</button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
              </tr>
            </thead>
            <tbody>
              {calendarData.map((week, i) => (
                <tr key={i}>
                  {week.map((cell, j) => (
                    <td key={j} className={
                      cell
                        ? `${cell.isToday ? 'today' : ''} ${cell.isSunday ? 'sunday' : ''} ${cell.isHoliday ? 'holiday' : ''}`
                        : ''
                    }>
                      {cell ? cell.date : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 10, fontSize: 14, color: '#444' }}>
            Showing: {monthNames[currentMonth]} {currentYear}
          </p>
        </div>
      )}
    </>
  );
};

export default Calendar;
