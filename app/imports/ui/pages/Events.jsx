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
