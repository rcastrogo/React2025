import React, { useState, useMemo, useEffect, type ReactNode } from 'react';

export type ViewType = 'Month' | 'Day' | 'Agenda';
type DayType = number | null;

const MonthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DayNamesShort = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const DaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

interface ScheduleProps {
    initialDate?: Date;
    initialView?: ViewType;
}

// Interfaz base común para todas las vistas
interface BaseViewProps {
    date: Date;
    viewName: ViewType;
}

interface MonthViewProps extends BaseViewProps {
    onDateSelect: (date: Date, view: ViewType) => void;
}

// -----------------------------------------------------------
// Lógica de Ayuda
// -----------------------------------------------------------
const getDaysInMonth = (date: Date): DayType[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const numDays = DaysInMonth[month] + (month === 1 && isLeap ? 1 : 0);
    const days: DayType[] = [];

    const startDayIndex = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < startDayIndex; i++) {
        days.push(null);
    }
    for (let i = 1; i <= numDays; i++) {
        days.push(i);
    }
    while (days.length % 7 !== 0) {
        days.push(null);
    }
    return days;
};


const MonthView = ({ date, onDateSelect }: MonthViewProps) => {
    const days = useMemo(() => getDaysInMonth(date), [date]);

    const rows: DayType[][] = useMemo(() => {
        const calendarRows: DayType[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            calendarRows.push(days.slice(i, i + 7));
        }
        return calendarRows;
    }, [days]);

    return (
        <div
            className="month-view-container"
            style={{
                height: 'calc(100% - 132px)',
                border: '0px solid white'
            }}
        >
            <table
                className="calendar-table cal-table"
                style={{ borderSpacing: '0' }}
            >
                <thead>
                    <tr className="w3-light-blue">
                        {DayNamesShort.map((day) => <th key={day}>{day}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((day, cellIndex) => {
                                const selected = (day || 0) === date.getDate();
                                return (
                                    <td
                                        key={cellIndex}
                                        className={`${selected ? 'w3-blue ' : 'w3-hover-pale-blue '}` + ` w3-border-black day-cell ${day === null ? 'empty' : ''}`}
                                        onClick={() => day !== null && onDateSelect(new Date(date.getFullYear(), date.getMonth(), day), 'Agenda')}
                                    >
                                        {day}
                                    </td>
                                )
                            }
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DayView = ({ date }: BaseViewProps) => {
    return (
        <div className="day-view-container w3-padding">
            <h3 className="w3-center w3-text-blue">Vista del día: {date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <p className="w3-center">Aquí se mostrarán los eventos del día.</p>
        </div>
    );
};

const AgendaView = ({ date }: BaseViewProps) => {
    return (
        <>
            <style>
                {`
          .box {
            background-color: whiteSmoke;
            color: black;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid gray;
            text-align: center;
          }
          .agenda-view-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
          }
        `}
            </style>
            <div className="w3-padding">
                <h3 className="w3-center w3-text-blue">Vista de agenda: {date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <div className="agenda-view-container">
                    <div className="box">1</div>
                    <div className="box">2</div>
                    <div className="box">3</div>
                    <div className="box">4</div>
                    <div className="box">5</div>
                    <div className="box">6</div>
                    <div className="box">7</div>
                    <div className="box">8</div>
                    <div className="box">9</div>
                    <div className="box">10</div>
                    <div className="box">11</div>
                    <div className="box">12</div>
                    <div className="box">13</div>
                </div>
            </div>
        </>
    );
};

// -----------------------------------------------------------
// Componente Principal
// -----------------------------------------------------------
const Schedule = (
    { initialDate = new Date(), initialView = 'Month', children
    }: ScheduleProps & { children: ReactNode }
) => {
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [currentView, setCurrentView] = useState(initialView);

    const handleViewChange = (view: ViewType) => {
        setCurrentView(view);
    };

    const handleDateSelect = (date: Date, view: ViewType) => {
        setCurrentDate(date);
        setCurrentView(view);
    };

    const renderView = useMemo(() => {
        return React.Children.map(children, (child) => {
            if (!React.isValidElement<BaseViewProps>(child)) return null;
            if (child.props.viewName === currentView) {
                const clonedProps = {
                    ...child.props,
                    date: currentDate,
                    onDateSelect: handleDateSelect
                };
                return React.cloneElement(child, clonedProps);
            }
            return null;
        });
    }, [currentView, currentDate, children]);

    const getHeaderLabel = useMemo(() => {
        switch (currentView) {
            case 'Month':
                return `${MonthNames[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;
            case 'Day':
            case 'Agenda':
                const dayName = DayNames[currentDate.getDay()];
                return `${dayName}, ${currentDate.getDate()} de ${MonthNames[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;
            default:
                return '';
        }
    }, [currentView, currentDate]);

    const handleMonthChange = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const handleDayChange = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + offset);
        setCurrentDate(newDate);
    };

    const disabledDaysButtons = currentView == 'Month';

    return (
        <div
            className="schedule-main-container"
            style={{ height: '100%' }}>

            <div className="header-container w3-light-gray">
                <div className="header-buttons left-buttons">
                    <button
                        onClick={() => handleMonthChange(-1)}
                        className="w3-button  w3-border-black w3-hover-blue"
                    ><i className="fa fa-chevron-left" aria-hidden="true"></i>
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <button
                        onClick={() => handleDayChange(-1)}
                        className="w3-button  w3-border-black w3-hover-blue"
                        disabled={disabledDaysButtons}
                    ><i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </button>
                </div>
                <h5 className="header-title">{getHeaderLabel}</h5>
                <div className="header-buttons right-buttons">
                    <button
                        onClick={() => handleDayChange(1)}
                        className="w3-button  w3-border-black w3-hover-blue"
                        disabled={disabledDaysButtons}
                    ><i className="fa fa-chevron-right" aria-hidden="true"></i>
                    </button>
                    <button
                        onClick={() => handleMonthChange(1)}
                        className="w3-button w3-border-black w3-hover-blue"
                    >
                        <i className="fa fa-chevron-right" aria-hidden="true"></i>
                        <i className="fa fa-chevron-right" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div className="w3-bar w3-border w3-center w3-light-gray">
                <button className={`w3-bar-item w3-button w3-hover-blue ${currentView === 'Month' ? 'w3-blue' : ''}`} onClick={() => handleViewChange('Month')}>Mes</button>
                <button className={`w3-bar-item w3-button w3-hover-blue ${currentView === 'Day' ? 'w3-blue' : ''}`} onClick={() => handleViewChange('Day')}>Día</button>
                <button className={`w3-bar-item w3-button w3-hover-blue ${currentView === 'Agenda' ? 'w3-blue' : ''}`} onClick={() => handleViewChange('Agenda')}>Agenda</button>
            </div>
            {renderView}
        </div>
    );
};

const ScheduleSamplePage = () => {

    useEffect(() => {

    }, []);

    const dayClick = (date: Date) => {
        console.log(date);
    }

    return (
        <>
            <Schedule>
                <MonthView viewName="Month" onDateSelect={dayClick} date={new Date()} />
                <DayView viewName="Day" date={new Date()} />
                <AgendaView viewName="Agenda" date={new Date()} />
            </Schedule>
        </>
    );
};

export default ScheduleSamplePage;