import React  from 'react';
import { getEvents } from '../api';

const Calendar = () => {
  const [events, setEvents] = React.useState([]);
  React.useEffect(() => {
    getEvents().then((resp) => {
      setEvents(resp);
    });
  },[]);

  const formatDate = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const day = startDate.getDate();
    const monthIndex = startDate.getMonth() + 1;
    const year = startDate.getFullYear();
    const startHours = startDate.getHours() < 12 ? endDate.getHours() === 0 ? '12' : endDate.getHours(): startDate.getHours() - 12;
    const ampm = startDate.getHours() < 12 ? 'am' : 'pm';
    const startMinutes = startDate.getMinutes().length > 1 ? startDate.getMinutes() : '0' + startDate.getMinutes();
    const endHours = endDate.getHours() < 12 ? endDate.getHours() === 0 ? '12' : endDate.getHours() : endDate.getHours() - 12;
    const endMinutes = endDate.getMinutes().length > 1 ? endDate.getMinutes() : '0' + endDate.getMinutes();
    return `${monthIndex}/${day}/${year} ${startHours}:${startMinutes}${ampm}-${endHours}:${endMinutes}`;
  }

  const renderEvents = () => {
    const data = events.map(e => (
      <tr className='event' key={e.id}>
        <td>{e.summary}</td>
        <td>{formatDate(e.start.dateTime, e.end.dateTime)}</td>
      </tr>))
      return <table>
        <thead>
          <tr>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          {data}
        </tbody>
      </table>;
  }

  return (
    <div className='calendar'>
      {renderEvents()}
    </div>
  );
};

export default Calendar;
