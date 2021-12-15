import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Icon, Item } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Roles } from 'meteor/alanning:roles';
import { ProfilesEvents } from '../../api/profiles/ProfilesEvents';
import { removeProfileEventMethod } from '../../startup/both/Methods';

/** Renders the Event Collection as a set of Cards. */
class MakeEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: 'teal' };
  }

  handleClick = (event) => {
    const profile = Meteor.user().username;
    const profEvent = `${profile} ${event}`;
    if (ProfilesEvents.collection.find({ event, profile, profEvent }).fetch().length !== 1) {
      ProfilesEvents.collection.insert({ event, profile, profEvent },
        (error) => {
          if (error) {
            swal('Error', 'Cannot favorite a message multiple times', 'error');
          } else {
            this.setState({ color: 'red' });
          }
        });
    } else {
      const profileEventInfo = { profile: profile, event: event, profEvent: profEvent };
      Meteor.call(removeProfileEventMethod, profileEventInfo, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        }
      });
      this.setState({ color: 'teal' });
    }
  };

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (
      <Item className='makeEventClass'>
        <Item.Image size="small" src={this.props.event.picture}/>
        <Item.Content verticalAlign='middle'>
          <Item.Header as='a'>{this.props.event.eventName}</Item.Header>
          <Item.Meta>
            <span className='date'>{this.props.event.date} {'at'} {this.props.event.location}</span>
          </Item.Meta>
          <Item.Description>{this.props.event.description}</Item.Description>
          <Item.Extra>
            {Roles.userIsInRole(Meteor.userId(), 'student') ?
              <Button id='event-favorite' floated='right' className="ui blue icon button"
                onClick={this.handleClick.bind(this, this.props.event.eventName)}>
                <Icon className="heart icon"
                  color={ProfilesEvents.collection.find({
                    profile: Meteor.user().username, event: this.props.event.eventName }).fetch().length === 1 ?
                    'red' : this.state.color}
                />
              </Button> : ''}
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}

MakeEvent.propTypes = {
  event: PropTypes.object.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withRouter(MakeEvent);
