import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Item } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Events } from '../../api/events/Events';
import { ProfilesEvents } from '../../api/profiles/ProfilesEvents';
import MakeEvent from '../components/MakeEvent';

/** Gets the Event-data. */
function getEventData(eventName) {
  const data = Events.collection.findOne({ eventName });
  return _.extend({ }, data);
}

/* const handleClick = (event) => {
  const profile = Meteor.user().username;
  const profEvent = `${event} ${profile}`;
  ProfilesEvents.collection.insert({ event, profile, profEvent },
    (error) => {
      if (error) {
        swal('Error', 'Cannot favorite a message multiple times', 'error');
      } else {
        swal('Success', 'Event favorited successfully', 'success');
      }
    });
};

const MakeItem = (props) => (
  <Item>
    <Item.Image size="small" src={props.event.picture}/>
    <Item.Content verticalAlign='middle'>
      <Item.Header as='a'>{props.event.eventName}</Item.Header>
      <Item.Meta>
        <span className='date'>{props.event.date} {'at'} {props.event.location}</span>
      </Item.Meta>
      <Item.Description>{props.event.description}</Item.Description>
      <Item.Extra>
        <Button floated='right' className="ui blue icon button"
          onClick={handleClick.bind(this, props.event.eventName)}> <i className="heart icon"></i>
        </Button>
      </Item.Extra>
    </Item.Content>
  </Item>
);

MakeItem.propTypes = {
  event: PropTypes.object.isRequired,
}; */

/** Renders the Event Collection as a set of Cards. */
class EventsPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const events = _.pluck(Events.collection.find().fetch(), 'eventName');
    const eventData = events.map(event => getEventData(event));
    return (
      <Container id="events-page">
        <Item.Group divided>
          {_.map(eventData, (event, index) => <MakeEvent key={index} event={event}/>)}
        </Item.Group>
      </Container>
    );
  }
}

EventsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub = Meteor.subscribe(Events.userPublicationName);
  const sub2 = Meteor.subscribe(ProfilesEvents.userPublicationName);
  return {
    ready: sub.ready() && sub2.ready(),
  };
})(EventsPage);
