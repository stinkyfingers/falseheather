import React  from 'react';
import Modal from 'react-modal';
import { getEvents } from '../api';
import logo from '../images/fh_logo.png';
import '../css/calendar.css';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    backgroundColor: '#333',
    padding: '2em',
    'line-height': '2'
  },
};


const Calendar = () => {
  const [events, setEvents] = React.useState([]);
  const [event, setEvent] = React.useState(null);
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
      <tr className='event' key={e.id} onClick={() => setEvent(e)}>
        <td>{e.summary}</td>
        <td>{formatDate(e.start.dateTime, e.end.dateTime)}</td>
        <td>{e.location}</td>
      </tr>))
      return <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {data}
        </tbody>
      </table>;
  };

  const renderEvent = () => {
    if (!event) return null;
    return <div className='event'>
      <div><img src={logo} alt='False Heather' className='modalLogo'/></div>
      <div>Event: {event.summary}</div>
      <div>Date: {formatDate(event.start.dateTime, event.end.dateTime)}</div>
      <div>Location: {event.location}</div>
      <div>Description: {event.description}</div>
    </div>
  };

  return (
    <div className='calendar'>
      {renderEvents()}
      <Modal
        isOpen={event !== null}
        style={modalStyles}
        onRequestClose={() => setEvent(null)}
        contentLabel={event ? event.summary : ''}
      >
        { event ? renderEvent() : null }
      </Modal>
    </div>
  );
};

export default Calendar;
