import React from 'react';
import './BookingList.css';

const BookingList = (props) =>{
  return (
  <ul className="bookings-list">
  {props.bookings.map(b => 
    {return (
        <li key={b._id} className="bookings-item">
            <div>
              {b.event.title} - 
              {new Date(b.createdAt).toLocaleDateString()}
            </div>
            <div>
              <button className="btn" 
              onClick={props.onDelete.bind(this, b._id)}>Cancel Booking</button>
            </div>
        </li>
    );
  }
)}
</ul>)

}

export default BookingList;