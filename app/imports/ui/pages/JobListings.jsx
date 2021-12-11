import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Item } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Jobs } from '../../api/job/Jobs';
import { ProfilesJobs } from '../../api/profiles/ProfilesJobs';
import MakeJob from '../components/MakeJob';

/** Gets the Event-data. */
function getJobData(jobTitle) {
  const data = Jobs.collection.findOne({ jobTitle });
  return _.extend({ }, data);
}

/** Renders the Event Collection as a set of Cards. */
class JobsPage extends React.Component {
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
        <Item.Group divided>
          {_.map(jobData, (job, index) => <MakeJob key={index} job={job}/>)}
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
  const sub1 = Meteor.subscribe(Jobs.userPublicationName);
  const sub2 = Meteor.subscribe(ProfilesJobs.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready(),
  };
})(JobsPage);
