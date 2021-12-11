import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { removeEventMethod } from '../../startup/both/Methods';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Event extends React.Component {
  handleClick = (event) => {
    Meteor.call(removeEventMethod, event, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      }
    });
  }

  render() {
    return (
      <Card fluid color={'blue'}>
        <Card.Content>
          <Card.Header style={{ float: 'right' }}>
            <Button basic compact id='companyRemoveEvent' size='mini' icon='times' style={{ boxShadow: 'none' }}
              onClick={this.handleClick.bind(this, this.props.event)}/>
          </Card.Header>
          <Image floated={'left'} size={'small'} src={this.props.event.picture}/>
          <Card.Header>{this.props.event.eventName}</Card.Header>
          <Card.Meta>Location: {this.props.event.location}</Card.Meta>
          <Card.Meta>Date:  {this.props.event.date}</Card.Meta>
          <Card.Description>{this.props.event.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Link id="editEvent" to={`/editEvent/${this.props.event._id}`} >Edit</Link>
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
