import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Icon, Item } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Roles } from 'meteor/alanning:roles';
import { ProfilesJobs } from '../../api/profiles/ProfilesJobs';
import { removeProfileJobMethod } from '../../startup/both/Methods';

/** Renders the Event Collection as a set of Cards. */
class MakeJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: 'teal' };
  }

  handleClick = (job) => {
    const profile = Meteor.user().username;
    const profJob = `${profile} ${job}`;
    if (ProfilesJobs.collection.find({ job, profile, profJob }).fetch().length !== 1) {
      ProfilesJobs.collection.insert({ job, profile, profJob },
        (error) => {
          if (error) {
            swal('Error', 'Cannot favorite a message multiple times', 'error');
          } else {
            this.setState({ color: 'red' });
          }
        });
    } else {
      const profileJobInfo = { profile: profile, job: job, profJob: profJob };
      Meteor.call(removeProfileJobMethod, profileJobInfo, (error) => {
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
      <Item>
        <Item.Image size="small" src={this.props.job.image}/>
        <Item.Content verticalAlign='middle'>
          <Item.Header as='a'>{this.props.job.jobTitle}</Item.Header>
          <Item.Meta>
            <span className='owner'>{this.props.job.owner}{' - '}{this.props.job.industry}</span>
          </Item.Meta>
          <Item><span className='salary'>{'Salary: '}{this.props.job.salary}</span></Item>
          <Item><span className='location'>{'Location: '}{this.props.job.location}</span></Item>
          <Item.Description>{this.props.job.description}</Item.Description>
          <Item.Extra>
            {Roles.userIsInRole(Meteor.userId(), 'student') ?
              <Button floated='right' onClick={this.handleClick.bind(this, this.props.job.jobTitle)} key='job-favorite-button'>
                <Icon name='heart'
                  color={ProfilesJobs.collection.find(
                    { profile: Meteor.user().username, job: this.props.job.jobTitle },
                  ).fetch().length === 1
                    ? 'red' : this.state.color}/>
              </Button> : ''}
            <Button floated='right' key='job-apply-button'>
              <a href={this.props.job.link}>Apply</a>
              <Icon name='right chevron'/>
            </Button>
          </Item.Extra>
        </Item.Content>
      </Item>);
  }
}

MakeJob.propTypes = {
  job: PropTypes.object.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withRouter(MakeJob);
