import React, { useState } from 'react';
import './Calendar.css';

const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const numDays = lastDay.getDate();
        const days = [];

        const startDay = (firstDay.getDay() + 6) % 7;
        for (let i = 0; i < startDay; i++) days.push(null);
        for (let i = 1; i <= numDays; i++) days.push(i);

        return days;
    };

    const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    const goToMonth = (value: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + value, 1));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newYear = parseInt(e.target.value, 10);
        if (!isNaN(newYear)) {
            setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
        }
    };

    type DayType = number | null;
    const days: DayType[] = getDaysInMonth(currentDate); //
    const rows: DayType[][] = [];
    let cells: DayType[] = [];

    days.forEach((day, index) => {
        if (index % 7 !== 0 || index === 0) {
            cells.push(day);
        } else {
            rows.push(cells);
            cells = [day];
        }

        if (index === days.length - 1) rows.push(cells);
    });

    return (
        <div className="calendar-container">

            <div className="calendar-header">
                <button onClick={() => goToMonth(-1)}>&lt;</button>
                <h2 className="month-display">{monthName}</h2>
                <button onClick={() => goToMonth(1)}>&gt;</button>
            </div>

            <table className="calendar-table">
                <thead>
                    <tr>
                        {daysOfWeek.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((day, cellIndex) => (
                                <td key={cellIndex} className={`day-cell ${day === null ? 'empty' : ''}`}>
                                    {day}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;