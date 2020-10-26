import React from 'react';
import Event from './Event';

const EventList = (props) => {
    return (        
    <ul className="events-list">{
        props.events.map((event) => {
          return (
          <Event key={event._id}
          eventId={event._id}
          title={event.title}
          price={event.price}
          date={event.date}
          authUserId={props.authUserId}
          creatorId = {event.creator._id}
          onDetail = {props.onViewDetail}
          /> 
          );
        })
      }
    </ul>
    )
}
export default EventList;