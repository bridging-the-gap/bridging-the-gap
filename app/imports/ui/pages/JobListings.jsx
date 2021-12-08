import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Button, Icon, Item } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import swal from 'sweetalert';
import { Jobs } from '../../api/job/Jobs';
import { ProfilesJobs } from '../../api/profiles/ProfilesJobs';

/** Gets the Event-data. */
function getJobData(jobTitle) {
  const data = Jobs.collection.findOne({ jobTitle });
  return _.extend({ }, data);
}

/* jobTitle: String,
    location: String,
    salary: String,
    industry: String,
    image: { type: String, optional: true },
description: String,
    owner: String, */
const MakeItem = (props) => (
  <Item>
    <Item.Image size="small" src={props.job.image}/>
    <Item.Content verticalAlign='middle'>
      <Item.Header as='a'>{props.job.jobTitle}</Item.Header>
      <Item.Meta>
        <span className='owner'>{props.job.owner}{' - '}{props.job.industry}</span>
      </Item.Meta>
      <Item><span className='salary'>{'Salary: '}{props.job.salary}</span></Item>
      <Item><span className='location'>{'Location: '}{props.job.location}</span></Item>
      <Item.Description>{props.job.description}</Item.Description>
      <Item.Extra>
        <Button floated='right' onClick={ this.handle(props.job.jobTitle)}>
          <Icon name='heart' />
        </Button>
        <Button floated='right'>
          <a href={props.job.link}>Apply</a>
          <Icon name='right chevron' />
        </Button>
      </Item.Extra>
    </Item.Content>
  </Item>
);

MakeItem.propTypes = {
  job: PropTypes.object.isRequired,
};

/** Renders the Event Collection as a set of Cards. */
class JobsPage extends React.Component {
  handle(data) {
    const job = data;
    const profile = Meteor.user().username;
    ProfilesJobs.collection.insert({ job, profile },
      (error) => {
      // Meteor.call(addJobMethod, data, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Job favorited successfully', 'success');
        }
      });
  }
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const jobs = _.pluck(Jobs.collection.find().fetch(), 'jobTitle');
    const jobData = jobs.map(job => getJobData(job));
    return (
      <Container id="jobs-page">
        <Item.Group>
          {_.map(jobData, (job, index) => <MakeItem key={index} job={job}/>)}
        </Item.Group>
      </Container>
    );
  }
}

JobsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub = Meteor.subscribe(Jobs.userPublicationName);
  return {
    ready: sub.ready(),
  };
})(JobsPage);
