import React from 'react';
import './Event.css';

const Event = (props) => {
    return (
        <li key={props.eventId} className="events-list-item">
            <div>
                <h1>{props.title}</h1>
                <h6>${props.price} - {new Date(props.date).toLocaleDateString()}</h6>
            </div>
            <div>
                {(props.authUserId === props.creatorId) ? <p>You are the owner</p> : 
                <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>}
            </div>
        </li> 
    );
}
export default Event;