import React, { Component } from 'react';
import './events.css';
import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/EventList';
import Spinner from '../components/Spinner';

class EventsPage extends Component {
  state = {
      creating: false,
      events : [],
      isLoading: false,
      selectedEvent: null
  };
  static contextType = AuthContext;

  constructor(props){
        super(props);
        this.titleRef = React.createRef();
        this.dateRef = React.createRef();
        this.priceRef = React.createRef();
        this.descRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  showViewHandler = (eventId) => {
    this.setState(prevState => {
      const selected = prevState.events.find(e => e._id === eventId);
      return {selectedEvent: selected};
    })
  }

  modalConfirmHandler = () => {
        this.setState({ creating: false });
        const title = this.titleRef.current.value;
        const description = this.descRef.current.value;
        const date = this.dateRef.current.value;
        const price = +this.priceRef.current.value;

        if(title.trim().length === 0 || date.trim().length ===0) return;

        const requestBody = {
            query: `
            mutation {
                createEvent(eventInput:{title:"${title}", price:${price}, date:"${date}", description:"${description}"}) {
                    _id
                    title
                    description
                    date
                    price
                    creator {
                        _id
                        email
                    }
                }
            }
            `
        }; 

        const token = this.context.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body:JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            }
        }).then(res =>{
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Error');
            }
            return res.json();
        })
        .then(resData => {
          this.setState(prevState => {
            const updatedEvents = [...prevState.events];
            updatedEvents.push({
              _id: resData.data.createEvent._id,
              title: resData.data.createEvent.title,
              description: resData.data.createEvent.description,
              date: resData.data.createEvent.date,
              price: resData.data.createEvent.price,
              creator: {
                _id: this.context.userId
              }
            }
            );
            return {events: updatedEvents};
          })
        })
        .catch(err => console.log(err));
  };
    
  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null});
  };

  bookEventHandler = () => {
    if(!this.context.token){
      this.setState({selectedEvent: null, creating:false});
      return;
    }
    const requestBody = {
      query: `
      mutation {
          bookEvent(eventId: "${this.state.selectedEvent._id}") {
              _id
              createdAt
              updatedAt
          }
      }
      `
  };
  const token = this.context.token;
  fetch('http://localhost:8000/graphql', {
    method: 'POST',
    body:JSON.stringify(requestBody),
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    }
  }).then(res =>{
    if(res.status !== 200 && res.status !== 201) {
        throw new Error('Error');
    }
    return res.json();
  }).then(resData => {
      console.log(resData);
      this.setState({selectedEvent: null});
  }).catch(err => {
      console.log(err);
  })
  }

  fetchEvents() {
    this.setState({isLoading: true});
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
        if(res.status !== 200 && res.status !== 201) {
          throw new Error('Failedx');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData.data);
        const events = resData.data.events;
        this.setState({ events: events , isLoading:false});
      })
      .catch(err => {
        console.log(err);
        this.setState({isLoading:false});
      });
  }

    render() {
      return (
          <React.Fragment>
            {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
            {this.state.creating && (
              <Modal
                title="Add Event"
                canCancel
                canConfirm
                onCancel={this.modalCancelHandler}
                onConfirm={this.modalConfirmHandler}
                confirmText="Confirm"
              >
                  <form>
                      <div className="form-control">
                          <label htmlFor="title">Title</label>
                          <input type="text" id="title" ref={this.titleRef}></input>
                      </div>
                      <div className="form-control">
                          <label htmlFor="title">Description</label>
                          <input type="description" id="description" ref={this.descRef}></input>
                      </div>
                      <div className="form-control">
                          <label htmlFor="title">Price</label>
                          <input type="number" id="price" ref={this.priceRef}></input>
                      </div>
                      <div className="form-control">
                          <label htmlFor="title">Date</label>
                          <input type="datetime-local" id="date" ref={this.dateRef}></input>
                      </div>
                  </form>
              </Modal>
            )}
            {this.state.selectedEvent && (
              <Modal 
              title={this.state.selectedEvent.title}
              canCancel
              canConfirm
              onCancel={this.modalCancelHandler}
              onConfirm={this.bookEventHandler}
              confirmText={this.context.token ? "Book Event" : "Confirm"}
              >
                <h1>{this.state.selectedEvent.title}</h1>
                <h6>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h6>
                <p>{this.state.selectedEvent.description}</p>
              </Modal>
            )}
            {this.context.token && 
            (<div className="events-control">
              <p>Share your own Events!</p>
              <button className="btn" onClick={this.startCreateEventHandler}>
                Create Event
              </button>
            </div>)}
            {this.state.isLoading ? <Spinner /> :
            <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail = {this.showViewHandler}
            />}
          </React.Fragment>
        );
      }
    }
    
export default EventsPage;