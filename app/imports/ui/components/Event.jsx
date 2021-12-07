import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Event extends React.Component {
  render() {
    return (
      <Card fluid color={'blue'}>
        <Card.Content>
          <Image floated={'left'} size={'small'} src={this.props.event.picture}/>
          <Card.Header>{this.props.event.eventName}</Card.Header>
          <Card.Meta>Location: {this.props.event.location}</Card.Meta>
          <Card.Meta>Date:  {this.props.event.date}</Card.Meta>
          <Card.Description>{this.props.event.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Link to={`/editEvent/${this.props.event._id}`} id="editEvent" >Edit</Link>
        </Card.Content>
      </Card>
    );
  }
}

// Require a document to be passed to this component.
Event.propTypes = {
  event: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Event);
